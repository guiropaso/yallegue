'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export default function Step1Authentication() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationStep, setRegistrationStep] = useState<number | null>(null)
  const { user, setUser, setLoading, setError: setStoreError, nextStep, setCurrentStep } = useProviderStore()

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          name: session.user.user_metadata?.full_name || session.user.email || null
        })

        // Fetch registration step
        try {
          const { data: providerData, error } = await supabase
            .from('providers')
            .select('registration_step')
            .eq('id', session.user.id)
            .single()

          if (providerData && !error) {
            setRegistrationStep(providerData.registration_step)
          }
        } catch (err) {
          console.error('Error fetching registration step:', err)
        }
      }
    }
    
    checkUser()
  }, [setUser])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    setStoreError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/providers/register`
        }
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      console.error('Error signing in with Google:', err)
      setError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.')
      setStoreError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      
      // Reset currentStep to 1 in both store and localStorage
      setCurrentStep(1)
      
      // Also update localStorage directly to ensure persistence
      const currentStore = JSON.parse(localStorage.getItem('provider-registration') || '{}')
      localStorage.setItem('provider-registration', JSON.stringify({
        ...currentStore,
        currentStep: 1
      }))
      
      console.log('Reset currentStep to 1 in store and localStorage')
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!user) return

    setLoading(true)
    setStoreError(null)

    try {
      // Create or update provider record
      const { error } = await supabase
        .from('providers')
        .upsert({
          id: user.id,
          registration_step: 2
        })

      if (error) {
        throw error
      }

      nextStep()
    } catch (err: any) {
      console.error('Error creating provider record:', err)
      setStoreError('Error al crear tu cuenta. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    // Show completion message for users who have finished registration
    if (registrationStep === 5) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Registro completado!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu registro ha sido enviado con éxito. Nuestro equipo revisará tu información y te contactará por WhatsApp o correo electrónico.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Cuenta registrada:</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">Próximos pasos</p>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Revisaremos tu información en 24-48 horas</li>
              <li>• Te contactaremos por WhatsApp para verificación</li>
              <li>• Una vez aprobado, podrás recibir solicitudes de servicios</li>
            </ul>
          </div>

          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100"
          >
            Usar una cuenta diferente
          </Button>
        </div>
      )
    }

    // Show normal registration flow for users who haven't completed
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Bienvenido, {user.name}!
          </h3>
          <p className="text-gray-600 mb-4">
            Tu cuenta de Google ha sido verificada exitosamente.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Cuenta actual:</p>
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
          
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100"
          >
            Usar una cuenta diferente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Crear cuenta
        </h3>
        <p className="text-gray-600 mb-6">
          Usamos tu cuenta de Google para proteger tu información y verificar tu identidad básica.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">Error de autenticación</p>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  )
}
