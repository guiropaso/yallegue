'use client'

import { Facebook, Instagram, MessageCircle } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      // Get the actual header element to calculate its height dynamically
      const headerElement = document.querySelector('header')
      const headerHeight = headerElement?.offsetHeight || (window.innerWidth < 1024 ? 80 : 100)
      
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      // Use smaller offset on mobile, larger on desktop
      const extraSpacing = window.innerWidth < 1024 ? 10 : 20
      const offsetPosition = elementPosition - headerHeight - extraSpacing
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2 text-center md:text-left">
            {/* Logo */}
            <div className="mb-4 flex justify-center md:justify-start">
              <Image 
                src="/images/logos/logo.png" 
                alt="Ya Llegué Logo" 
                width={150}
                height={60}
                className="filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4 text-center md:text-left">
              Tu ayuda confiable, cuando y donde la necesites. Conectamos clientes con proveedores 
              verificados para servicios de calidad.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => handleSmoothScroll('#inicio')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Inicio</button></li>
              <li><button onClick={() => handleSmoothScroll('#beneficios')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Beneficios</button></li>
              <li><button onClick={() => handleSmoothScroll('#como-funciona')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Cómo funciona</button></li>
              <li><button onClick={() => handleSmoothScroll('#servicios')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Servicios</button></li>
              <li><button onClick={() => handleSmoothScroll('#para-proveedores')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Para proveedores</button></li>
              <li><button onClick={() => handleSmoothScroll('#seguridad')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Seguridad</button></li>
              <li><button onClick={() => handleSmoothScroll('#testimonios')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">Testimonios</button></li>
              <li><button onClick={() => handleSmoothScroll('#faq')} className="hover:text-[#FF1B1C] transition-colors duration-200 text-left">FAQ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#FF1B1C]">Términos y condiciones</a></li>
              <li><a href="/privacidad" className="hover:text-[#FF1B1C]">Privacidad</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Política de cancelación</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Política de reembolso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Ya Llegué. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
