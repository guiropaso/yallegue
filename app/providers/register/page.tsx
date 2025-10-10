'use client'

import { useEffect, useState } from 'react'
import { useProviderStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import Step1Authentication from '@/components/registration/Step1Authentication'
import Step2PersonalInfo from '@/components/registration/Step2PersonalInfo'
import Step3Experience from '@/components/registration/Step3Experience'
import Step4Verification from '@/components/registration/Step4Verification'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const steps = [
  { id: 1, title: 'Autenticación', description: 'Inicia sesión con Google' },
  { id: 2, title: 'Información Personal', description: 'Datos básicos' },
  { id: 3, title: 'Experiencia', description: 'Habilidades y experiencia' },
  { id: 4, title: 'Verificación', description: 'Documentos de identidad' }
]

export default function ProviderRegistrationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { currentStep, user, setCurrentStep, setUser } = useProviderStore()

  useEffect(() => {
    const initializeAuthAndStep = async () => {
      try {
        // First, check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          // No user logged in - set currentStep to 1
          console.log('No user logged in, setting currentStep to 1')
          setCurrentStep(1)
          // Also update localStorage
          const currentStore = JSON.parse(localStorage.getItem('provider-registration') || '{}')
          localStorage.setItem('provider-registration', JSON.stringify({
            ...currentStore,
            currentStep: 1
          }))
          return
        }

        // User is logged in - set user info
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          name: session.user.user_metadata?.full_name || session.user.email || null
        })

        // Check if user has a provider record
        const { data: provider, error } = await supabase
          .from('providers')
          .select('registration_step')
          .eq('id', session.user.id)
          .single()

        if (provider && !error) {
          // User has provider record - use their registration_step
          console.log('User has provider record, registration_step:', provider.registration_step)
          setCurrentStep(provider.registration_step)
          // Also update localStorage
          const currentStore = JSON.parse(localStorage.getItem('provider-registration') || '{}')
          localStorage.setItem('provider-registration', JSON.stringify({
            ...currentStore,
            currentStep: provider.registration_step
          }))
        } else {
          // No provider record - new user, default to step 2
          console.log('No provider record found, defaulting to step 2 for new user')
          setCurrentStep(2)
          // Also update localStorage
          const currentStore = JSON.parse(localStorage.getItem('provider-registration') || '{}')
          localStorage.setItem('provider-registration', JSON.stringify({
            ...currentStore,
            currentStep: 2
          }))
        }
      } catch (error) {
        console.error('Error checking auth and progress:', error)
        // On error, default to step 1
        setCurrentStep(1)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuthAndStep()
  }, [setUser, setCurrentStep])

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Authentication />
      case 2:
        return <Step2PersonalInfo />
      case 3:
        return <Step3Experience />
      case 4:
        return <Step4Verification />
      default:
        return <Step1Authentication />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-red-100 to-red-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF1B1C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-red-100 to-red-200 flex items-center justify-center p-4 py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#FF1B1C]/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-[#FF4444]/35 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-[#FF6B6B]/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logos/logo.png"
                alt="Ya Llegué"
                width={120}
                height={40}
                className="h-10 w-auto hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
            
            <div className="text-sm text-gray-500">
              {currentStep === 5 ? 'Registro Enviado' : `Paso ${currentStep} de 4`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-[#FF1B1C] text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`} style={{ borderRadius: '50%' }}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>
              ¿Necesitas ayuda? <a href="mailto:hola@yallegue.com" className="text-[#FF1B1C] hover:underline">hola@yallegue.com</a>
            </p>
            <p>
              Al continuar, aceptas nuestros términos de servicio
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
