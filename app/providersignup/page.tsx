'use client'

import ProviderSignupForm from '@/components/ProviderSignupForm'
import Image from 'next/image'
import Link from 'next/link'
import { DollarSign, Clock, Users, ChevronRight, Home } from 'lucide-react'

export default function ProviderSignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-red-100 to-red-200 flex items-center justify-center p-4 py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#FF1B1C]/40 to-transparent rounded-full blur-3xl" style={{animation: 'float1 8s ease-in-out infinite'}}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-[#FF4444]/35 to-transparent rounded-full blur-3xl" style={{animationDelay: '0.5s', animation: 'float2 10s ease-in-out infinite'}}></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-[#FF6B6B]/30 to-transparent rounded-full blur-3xl" style={{animation: 'float3 12s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gradient-to-l from-[#FF1B1C]/25 to-transparent rounded-full blur-3xl" style={{animationDelay: '1s', animation: 'float4 9s ease-in-out infinite'}}></div>
        
        {/* Additional Orbs */}
        <div className="absolute top-1/4 right-1/3 w-[200px] h-[200px] bg-gradient-to-br from-[#FF4444]/30 to-transparent rounded-full blur-2xl" style={{animationDelay: '0.8s', animation: 'float5 7s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-gradient-to-tl from-[#FF6B6B]/25 to-transparent rounded-full blur-3xl" style={{animation: 'float6 13s ease-in-out infinite'}}></div>
        <div className="absolute top-2/3 left-1/6 w-[180px] h-[180px] bg-gradient-to-r from-[#FF1B1C]/35 to-transparent rounded-full blur-2xl" style={{animationDelay: '1.5s', animation: 'float7 10s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/4 right-1/6 w-[220px] h-[220px] bg-gradient-to-bl from-[#FF4444]/20 to-transparent rounded-full blur-3xl" style={{animationDelay: '0.3s', animation: 'float8 11s ease-in-out infinite'}}></div>
        <div className="absolute top-1/6 left-1/2 w-[160px] h-[160px] bg-gradient-to-br from-[#FF6B6B]/30 to-transparent rounded-full blur-2xl" style={{animation: 'float9 12s ease-in-out infinite'}}></div>
        
        {/* Additional Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-100/10 to-red-200/15"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF1B1C]/10 to-transparent"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Right Section - Visual (50%) - Shows first on mobile */}
          <div className="relative overflow-hidden order-1 lg:order-2">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/providersignup.png"
                alt="Profesionales trabajando"
                fill
                className="object-cover"
                priority
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12">
              {/* Main Text */}
              <div className="mb-8 px-4 lg:px-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight text-center">
                  Accede a nuestra red salvadoreña de profesionales verificados.
                </h2>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 px-4 lg:px-0">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Gana Dinero Extra</span>
                  </div>
                  <p className="text-white/90 text-sm">
                  Aumenta tus ingresos ofreciendo tus servicios a través de nuestra plataforma.
                  </p>
                </div>

                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Flexibilidad Total</span>
                  </div>
                  <p className="text-white/90 text-sm">
                  Decide tus horarios y proyectos según tu disponibilidad.
                  </p>
                </div>
              </div>

              {/* Floating Label - Hidden on mobile */}
              <div className="hidden lg:block absolute top-8 right-8 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-white text-sm font-medium">
                  Ya Llegué El Salvador
                </p>
                <p className="text-white/70 text-xs">
                  Servicios Profesionales
                </p>
              </div>
            </div>
          </div>

          {/* Left Section - Form (50%) - Shows second on mobile */}
          <div className="bg-white p-8 lg:p-12 order-2 lg:order-1">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-start space-x-2 text-sm mb-8">
              <Link 
                href="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-[#FF1B1C] transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Registro de proveedores</span>
            </nav>
            
            {/* Header */}
            <div className="mb-8 text-center">
              <Link href="/">
                <Image
                  src="/images/logos/logo.png"
                  alt="Ya Llegué"
                  width={300}
                  height={100}
                  className="h-20 w-auto mb-6 mx-auto hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                />
              </Link>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Únete a nuestra red de profesionales de servicios
              </h1>
            </div>

            {/* Form */}
            <ProviderSignupForm />

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ¿Prefieres email? <a href="mailto:hola@yallegue.com" className="text-[#FF1B1C] hover:underline">hola@yallegue.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(80px, -60px) rotate(90deg); }
          50% { transform: translate(-60px, 80px) rotate(180deg); }
          75% { transform: translate(60px, -80px) rotate(270deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-100px, 60px) rotate(120deg); }
          66% { transform: translate(80px, -100px) rotate(240deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-120px, 80px); }
          50% { transform: translate(100px, -60px); }
          75% { transform: translate(-80px, -100px); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(70px, -50px) rotate(72deg); }
          40% { transform: translate(-80px, 70px) rotate(144deg); }
          60% { transform: translate(90px, 60px) rotate(216deg); }
          80% { transform: translate(-60px, -90px) rotate(288deg); }
        }
        
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(60px, -80px); }
        }
        
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-70px, 90px) rotate(90deg); }
          50% { transform: translate(90px, -70px) rotate(180deg); }
          75% { transform: translate(-90px, -90px) rotate(270deg); }
        }
        
        @keyframes float7 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(80px, 60px); }
          66% { transform: translate(-60px, -80px); }
        }
        
        @keyframes float8 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(100px, -70px) rotate(108deg); }
          60% { transform: translate(-90px, 80px) rotate(216deg); }
          90% { transform: translate(70px, 90px) rotate(324deg); }
        }
        
        @keyframes float9 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          40% { transform: translate(-80px, -60px) rotate(144deg); }
          80% { transform: translate(70px, 80px) rotate(288deg); }
        }
      `}</style>
    </div>
  )
}
