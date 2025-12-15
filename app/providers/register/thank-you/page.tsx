'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Shield, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ThankYouPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndRegistration = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          // No user logged in - redirect to registration
          router.push('/providers/register')
          return
        }

        // Set user email
        setUserEmail(session.user.email || null)

        // Check if user has completed registration (registration_step === 5)
        const { data: provider, error } = await supabase
          .from('providers')
          .select('registration_step')
          .eq('id', session.user.id)
          .single()

        if (error || !provider || provider.registration_step !== 5) {
          // User hasn't completed registration - redirect to registration
          router.push('/providers/register')
          return
        }
      } catch (error) {
        console.error('Error checking auth and registration:', error)
        router.push('/providers/register')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndRegistration()
  }, [router])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/providers/register')
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      setIsLoading(false)
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
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
              Registro Enviado
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
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
              
              {userEmail && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Cuenta registrada:</p>
                  <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">Próximos pasos</p>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Revisaremos tu información</li>
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
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                'Usar una cuenta diferente'
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex md:flex-row flex-col items-center justify-between text-sm text-gray-500">
            <p>
              ¿Necesitas ayuda? <a href="mailto:info@yalleguesv.com" className="text-[#FF1B1C] hover:underline">info@yalleguesv.com</a>
            </p>
            <p className="text-center md:text-left">
              O escribe a nuestro WhatsApp: <a href="https://wa.me/50361780439" className="text-[#FF1B1C] hover:underline">6178-0439</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

