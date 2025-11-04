'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { Briefcase, Calendar, MessageSquare, Loader2, AlertCircle, Plus, X } from 'lucide-react'

const experienceOptions = [
  'Fontanería',
  'Electricidad',
  'Albañilería',
  'Instalador de tabla roca',
  'Carpintería',
  'Herrería / soldadura',
  'Pintura de interiores y exteriores',
  'Instalación de pisos y cerámica',
  'Reparación de techos o goteras',
  'Reparación / instalación de puertas y ventanas',
  'Tapicería de muebles',
  'Vidriería',
  'Cerrajería',
  'Jardinería',
  'Fumigación y control de plagas',
  'Mantenimiento de aires acondicionados',
  'Reparación de refrigeradores',
  'Reparación de lavadoras y secadoras',
  'Reparación de microondas',
  'Instalación de sistemas de seguridad',
  'Mantenimiento de piscinas',
  'Limpieza de cisternas',
  'Limpieza de hogares y oficinas',
  'Chef a domicilio',
  'Manicure',
  'Pedicure',
  'Pestañas',
  'Maquillista',
  'Estilista',
  'Otro, especifique'
];


const yearsOptions = [
  { value: 0, label: 'Menos de 1 año' },
  { value: 1, label: '1-3 años' },
  { value: 3, label: '3-5 años' },
  { value: 5, label: 'Más de 5 años' }
]

export default function Step3Experience() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, experience, setExperience, setLoading, setError: setStoreError, nextStep, prevStep } = useProviderStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load existing experience data if available
    const loadExistingData = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('provider_experience')
          .select('*')
          .eq('provider_id', user.id)

        if (data && !error && data.length > 0) {
          // Load all experience areas
          const areas = data.map(exp => exp.area)
          const firstExp = data[0]
          setExperience({
            areas: areas,
            yearsExperience: firstExp.years_experience,
            description: firstExp.description || ''
          })
        }
      } catch (err) {
        console.error('Error loading existing experience data:', err)
      }
    }

    loadExistingData()
  }, [user?.id, setExperience])

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

  const toggleArea = (area: string) => {
    const newAreas = experience.areas.includes(area)
      ? experience.areas.filter(a => a !== area)
      : [...experience.areas, area]
    
    setExperience({ areas: newAreas })
  }

  const handleContinue = async () => {
    if (!user?.id) return

    // Validate required fields
    if (experience.areas.length === 0 || experience.yearsExperience === null || !experience.description.trim()) {
      setError('Por favor, completa todos los campos requeridos.')
      return
    }

    setIsLoading(true)
    setError(null)
    setStoreError(null)

    try {
      // Delete existing experience entries for this provider
      await supabase
        .from('provider_experience')
        .delete()
        .eq('provider_id', user.id)

      // Insert new experience entries
      const experienceEntries = experience.areas.map(area => ({
        provider_id: user.id,
        area,
        years_experience: experience.yearsExperience,
        description: experience.description
      }))

      const { error } = await supabase
        .from('provider_experience')
        .insert(experienceEntries)

      if (error) {
        throw error
      }

      // Update provider registration step
      const { error: updateError } = await supabase
        .from('providers')
        .update({ registration_step: 4 })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      nextStep()
    } catch (err: any) {
      console.error('Error saving experience:', err)
      setError('Error al guardar tu experiencia. Por favor, inténtalo de nuevo.')
      setStoreError('Error al guardar tu experiencia. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Experiencia y Habilidades
        </h3>
        <p className="text-gray-600">
          Cuéntanos sobre tu experiencia profesional para conectar mejor con clientes.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">Error de validación</p>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Experience Areas */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Áreas de experiencia *
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200 text-left flex items-center"
            >
              <Briefcase className="absolute left-3 w-5 h-5 text-gray-400" />
              <span className="text-gray-700 text-sm">
                {experience.areas.length === 0 
                  ? 'Selecciona tus áreas' 
                  : `${experience.areas.length} área(s) seleccionada(s)`
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
                      checked={experience.areas.includes(area)}
                      onChange={() => toggleArea(area)}
                      className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Areas Display */}
        {experience.areas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1B1C]/10 text-[#FF1B1C] text-sm rounded-lg border border-[#FF1B1C]/20"
              >
                {area}
                <button
                  type="button"
                  onClick={() => toggleArea(area)}
                  className="hover:bg-[#FF1B1C]/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Years of Experience */}
        <div className="space-y-2">
          <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
            Años de experiencia *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="yearsExperience"
              value={experience.yearsExperience || ''}
              onChange={(e) => setExperience({ yearsExperience: Number(e.target.value) })}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200 appearance-none"
            >
              <option value="">Selecciona años</option>
              {yearsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Cuéntanos de tu experiencia *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              id="description"
              value={experience.description}
              onChange={(e) => setExperience({ description: e.target.value })}
              rows={4}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200 resize-none"
              placeholder="Describe tu experiencia, habilidades y servicios que puedes ofrecer..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Atrás
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={isLoading || experience.areas.length === 0 || experience.yearsExperience === null || !experience.description.trim()}
          className="flex-1 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  )
}
