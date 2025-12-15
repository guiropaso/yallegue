'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navigationItems = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Beneficios', href: '#beneficios' },
  { name: 'Cómo funciona', href: '#como-funciona' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Para proveedores', href: '#para-proveedores' },
  { name: 'Seguridad', href: '#seguridad' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'FAQ', href: '#faq' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || (window.innerWidth < 1024 ? 80 : 100)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      // Keep desktop behavior as original, optimize mobile only
      const extraSpacing = window.innerWidth < 1024 ? -430 : 40
      const offsetPosition = elementPosition - headerHeight - extraSpacing
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    closeMobileMenu()
  }

  const closeMobileMenu = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsAnimating(false)
    }, 300) // Match the animation duration
  }

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu()
    } else {
      setIsMobileMenuOpen(true)
    }
  }

  // Handle clicking outside the header to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    // Add event listener when mobile menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      {/* Main Header Pill - Grows on Mobile */}
      <div 
        ref={headerRef}
        className={`bg-white/80 md:bg-white/70 backdrop-blur-sm md:backdrop-blur-md border border-white/20 shadow-lg max-w-[1280px] w-full mx-6 overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen 
            ? 'lg:rounded-full rounded-2xl animate-header-grow' 
            : 'rounded-full animate-header-shrink'
        }`}
        style={{
          transformOrigin: 'top center',
          minHeight: isMobileMenuOpen ? 'auto' : '76px'
        }}
      >
        {/* Header Content */}
        <div className="flex items-center justify-between py-4 px-10">
          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/images/logos/logo.png" 
                alt="Ya Llegué Logo" 
                width={140}
                height={56}
                priority
                className="h-14 w-auto hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex space-x-7">
            {navigationItems.slice(1).map((item) => (
              <button
                key={item.name}
                onClick={() => handleSmoothScroll(item.href)}
                className="text-gray-700 hover:text-[#FF1B1C] transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Button - Right side */}
          <div className="hidden lg:flex">
            <Link href="/providers/register">
              <Button 
                className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Quiero ser un proveedor
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#FF1B1C] transition-colors duration-200 relative"
            >
              <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content - Grows within the header */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-10 pb-6">
            <div className="space-y-1">
              {navigationItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-[#FF1B1C] hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-[1.02] hover:translate-x-1"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-3">
                <Link href="/providers/register" onClick={closeMobileMenu}>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Quiero ser un proveedor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes header-grow {
          0% {
            border-radius: 50px;
            transform: scaleY(1) scaleX(1);
          }
          50% {
            border-radius: 32px;
            transform: scaleY(1.02) scaleX(1);
          }
          100% {
            border-radius: 16px;
            transform: scaleY(1) scaleX(1);
          }
        }

        @keyframes header-shrink {
          0% {
            border-radius: 16px;
            transform: scaleY(1) scaleX(1);
          }
          50% {
            border-radius: 32px;
            transform: scaleY(1.02) scaleX(1);
          }
          100% {
            border-radius: 50px;
            transform: scaleY(1) scaleX(1);
          }
        }

        .animate-header-grow {
          animation: header-grow 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-header-shrink {
          animation: header-shrink 400ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
      `}</style>
    </header>
  )
}
