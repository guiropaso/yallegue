'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { User, Mail, Phone, FileText, Briefcase, Calendar, MessageSquare, CheckCircle, UserCheck, Loader2, AlertCircle } from 'lucide-react'

interface FormData {
  firstName: string
  lastName: string
  dui: string
  whatsapp: string
  email?: string
  experienceAreas: string[]
  yearsExperience: number
  experienceDescription: string
  hasFixedJob: 'yes' | 'no'
}

const experienceOptions = [
  'Fontanería',
  'Electricidad', 
  'Reparación de Lavadoras',
  'Albañilería',
  'Limpieza de Hogar',
  'Planchado de prendas'
]

const yearsOptions = [
  { value: 0, label: 'Menos de 1 año' },
  { value: 1, label: '1-3 años' },
  { value: 3, label: '3-5 años' },
  { value: 5, label: 'Más de 5 años' }
]

function ProviderSignupForm() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>()

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const submitToWebhook = async (data: FormData) => {
    const webhookUrl = 'https://n8n.yalleguesv.com/webhook/989d2ce0-8e56-4f38-b9a0-c38b9253db8c'
    
    // Map years of experience number to its label
    // Convert string to number since form inputs return strings
    const yearsExperienceValue = Number(data.yearsExperience)
    const yearsExperienceLabel = yearsOptions.find(option => option.value === yearsExperienceValue)?.label || 'No especificado'
    
    // Debug logging
    console.log('Form data yearsExperience (string):', data.yearsExperience)
    console.log('Converted to number:', yearsExperienceValue)
    console.log('Found label:', yearsExperienceLabel)
    
    // Create the payload with the label instead of the number
    const payload = {
      ...data,
      yearsExperience: yearsExperienceLabel
    }
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Error submitting to webhook:', error)
      throw error
    }
  }

  const sendWelcomeEmail = async (name: string, email: string) => {
    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error(`Email API error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error sending welcome email:', error)
      // Don't throw error here - email failure shouldn't break the form submission
      return { error: 'Failed to send welcome email' }
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // First submit to webhook
      await submitToWebhook(data)
      
      // If webhook submission is successful, send welcome email
      if (data.email) {
        const fullName = `${data.firstName} ${data.lastName}`
        await sendWelcomeEmail(fullName, data.email)
      }
      
      setSubmitStatus('success')
      reset()
      setSelectedAreas([])
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Hubo un error al enviar tu aplicación. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleArea = (area: string) => {
    const newAreas = selectedAreas.includes(area)
      ? selectedAreas.filter(a => a !== area)
      : [...selectedAreas, area]
    
    setSelectedAreas(newAreas)
    setValue('experienceAreas', newAreas)
  }

  const handleWhatsAppInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits, plus sign, spaces, and hyphens
    const filteredValue = value.replace(/[^0-9+\s-]/g, '')
    e.target.value = filteredValue
  }

  const handleDuiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits and limit to 9 characters
    const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 9)
    e.target.value = filteredValue
  }

  return (
    <div className="w-full">
      <div className="pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
            </div>
            
            {/* Name Fields - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                  Nombre *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('firstName', { required: 'El nombre es requerido' })}
                    type="text"
                    id="firstName"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200"
                    placeholder="Tu nombre"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                  Apellido *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('lastName', { required: 'El apellido es requerido' })}
                    type="text"
                    id="lastName"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200"
                    placeholder="Tu apellido"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dui" className="block text-xs font-medium text-gray-700">
                  DUI *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('dui', { required: 'El DUI es requerido' })}
                    type="text"
                    id="dui"
                    onInput={handleDuiInput}
                    maxLength={9}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200"
                    placeholder="000000000"
                  />
                </div>
                {errors.dui && (
                  <p className="text-sm text-red-600">{errors.dui.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="whatsapp" className="block text-xs font-medium text-gray-700">
                  WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('whatsapp', { required: 'El número de WhatsApp es requerido' })}
                    type="text"
                    id="whatsapp"
                    onInput={handleWhatsAppInput}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200"
                    placeholder="+503 0000-0000"
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-sm text-red-600">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>

            {/* Email Field - Row 3 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Email (opcional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          {/* Professional Experience Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Experiencia Profesional</h3>
            </div>
            
            {/* Experience Areas and Years */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Área(s) de experiencia *
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200 text-left flex items-center"
                  >
                    <Briefcase className="absolute left-3 w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 text-sm">
                      {selectedAreas.length === 0 
                        ? 'Selecciona tus áreas' 
                        : `${selectedAreas.length} área(s)`
                      }
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {experienceOptions.map((area) => (
                        <label
                          key={area}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAreas.includes(area)}
                            onChange={() => toggleArea(area)}
                            className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300 rounded"
                          />
                          <span className="text-xs text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.experienceAreas && (
                  <p className="text-sm text-red-600">{errors.experienceAreas.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="yearsExperience" className="block text-xs font-medium text-gray-700">
                  Años de experiencia *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    {...register('yearsExperience', { required: 'Los años de experiencia son requeridos' })}
                    id="yearsExperience"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200 appearance-none"
                  >
                    <option value="">Selecciona años</option>
                    {yearsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.yearsExperience && (
                  <p className="text-sm text-red-600">{errors.yearsExperience.message}</p>
                )}
              </div>
            </div>

            {/* Experience Description */}
            <div className="space-y-2">
              <label htmlFor="experienceDescription" className="block text-xs font-medium text-gray-700">
                Cuéntanos de tu experiencia y qué sabes hacer *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  {...register('experienceDescription', { required: 'La descripción de experiencia es requerida' })}
                  id="experienceDescription"
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white focus-visible:ring-0 transition-all duration-200 resize-none"
                  placeholder="Describe tu experiencia, habilidades y servicios que puedes ofrecer..."
                />
              </div>
              {errors.experienceDescription && (
                <p className="text-sm text-red-600">{errors.experienceDescription.message}</p>
              )}
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                ¿Posees trabajo fijo? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                  <input
                    {...register('hasFixedJob', { required: 'Esta información es requerida' })}
                    type="radio"
                    value="yes"
                    className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300"
                  />
                  <span className="text-xs text-gray-700 font-medium">Sí</span>
                </label>
                <label className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                  <input
                    {...register('hasFixedJob', { required: 'Esta información es requerida' })}
                    type="radio"
                    value="no"
                    className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300"
                  />
                  <span className="text-xs text-gray-700 font-medium">No</span>
                </label>
              </div>
              {errors.hasFixedJob && (
                <p className="text-sm text-red-600">{errors.hasFixedJob.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enviar mi aplicación
                </>
              )}
            </Button>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="text-center pt-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">¡Aplicación enviada exitosamente!</p>
                </div>
                <p className="text-sm text-green-700 leading-relaxed">
                  Hemos enviado un email de bienvenida a tu correo electrónico con los siguientes pasos. 
                  Nuestro equipo revisará tu información y te contactará por WhatsApp o correo. 
                  ¡Gracias por querer formar parte de nuestra comunidad de proveedores!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="text-center pt-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-medium text-red-800">Error al enviar aplicación</p>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Info Message */}
          {submitStatus === 'idle' && (
            <div className="text-center pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>¿Qué sigue?</strong><br />
                  Nuestro equipo revisará tu información y te contactará por WhatsApp o correo. 
                  ¡Gracias por querer formar parte de nuestra comunidad de proveedores!
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ProviderSignupForm
