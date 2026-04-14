'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { CheckCircle, ArrowRight, ArrowDown, ChevronRight } from 'lucide-react'

/* ─── Service data (Section 2 image grid) ───────────────────────────────── */

const services = [
  { label: 'Fontaneros',            image: '/images/services/fontanero.png',        position: 'object-top' },
  { label: 'Maquillistas',          image: '/images/services/maquillista.png',       position: 'object-top' },
  { label: 'Electricistas',         image: '/images/services/electricista.png',      position: 'object-top' },
  { label: 'Albañiles',             image: '/images/services/albanil.png',           position: 'object-top' },
  { label: 'Rep. Electrodomésticos',image: '/images/services/electrodomesticos.png', position: 'object-top' },
  { label: 'Jardineros',            image: '/images/services/jardinero.png',         position: 'object-top' },
]

/* ─── Form options ──────────────────────────────────────────────────────── */

const serviceOptions = [
  'Fontanería / Plomería',
  'Electricidad',
  'Albañilería',
  'Jardinería',
  'Maquillaje / Servicios de Belleza',
  'Reparación de Electrodomésticos',
  'Housekeeping / Limpieza',
  'Otro',
]

/* ─── How-it-works steps ────────────────────────────────────────────────── */

const steps = [
  {
    number: '1',
    title: 'Selecciona el servicio que deseas',
    description:
      'Desde maquillaje, reparación de un chorro, reparación de electrodomésticos o quién pode tu jardín.',
  },
  {
    number: '2',
    title: 'Define tu presupuesto y tiempos',
    description:
      'Define el precio que estás dispuesto a pagar, el día que lo necesitas y nivel de urgencia. Tu solicitud se genera y nuestros proveedores ofertarán.',
  },
  {
    number: '3',
    title: 'Recibe el trabajo',
    description:
      'Nuestro proveedor llegará a la hora acordada y al finalizar el trabajo pagas en línea y calificas.',
  },
]

/* ─── Shared inner-container class ─────────────────────────────────────── */
// Padding lives here — never on the <section> — so overflow-hidden on parents
// cannot eat the right-hand side on any device.
const container = 'w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'

/* ─── Page component ────────────────────────────────────────────────────── */

export default function WaitlistPage() {
  const [name, setName]         = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError]       = useState('')

  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    setPhone(digits)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !lastName.trim() || !email.trim() || !phone || !category) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Por favor ingresa un correo electrónico válido.')
      return
    }

    if (phone.length !== 8) {
      setError('El número de teléfono debe tener 8 dígitos.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${name.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: `+503 ${phone}`,
          category,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrarse')
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-28 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-[540px] h-[540px] bg-gradient-to-br from-[#FF1B1C]/12 to-transparent rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF4444]/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1.2s' }}
          />
        </div>

        <div className={`relative ${container}`}>
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── Left copy ── */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2 mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse block" />
                <span className="text-sm font-semibold text-green-700">
                  Lista de espera · Cupo limitado
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                Ya Llegué!{' '}
                <span className="block bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">
                  La plataforma
                </span>
                donde contratas
              </h1>

              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-6">
                Jardineros · Albañiles · Electricistas · Fontaneros · Servicios de Belleza · y más
              </p>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
                Conectamos clientes con proveedores verificados para cualquier servicio en tu
                hogar. Rápido, seguro y sin complicaciones.
              </p>

              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-[#FF1B1C]/25 hover:shadow-[#FF1B1C]/40 hover:scale-105 transition-all duration-300 text-base"
              >
                Únete a la lista de espera y obtén $5 OFF
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>

            {/* ── Right: $5 OFF creative voucher ── */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#FF1B1C] to-[#FF6B6B] blur-2xl opacity-30 scale-110 animate-pulse" />

                <div className="relative bg-gradient-to-br from-[#FF1B1C] via-[#FF2D2D] to-[#c0392b] rounded-[2.5rem] p-10 w-[380px] shadow-2xl overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

                  <div className="flex flex-col items-center gap-3 mb-6 relative z-10">
                    <Image
                      src="/images/logos/logo.png"
                      alt="Ya Llegué!"
                      width={70}
                      height={28}
                      className="brightness-0 invert opacity-80"
                    />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse block" />
                      <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
                        Oferta de lanzamiento
                      </span>
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse block" />
                    </div>
                  </div>

                  <div className="border-t border-dashed border-white/30 mb-6 relative z-10" />

                  <div className="relative z-10 text-center mb-1">
                    <span className="text-[8rem] font-black text-white leading-none block" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                      $5
                    </span>
                    <div className="inline-flex items-center gap-3">
                      <div className="h-px w-12 bg-white/40" />
                      <span className="text-2xl font-black text-white tracking-widest uppercase">OFF</span>
                      <div className="h-px w-12 bg-white/40" />
                    </div>
                  </div>

                  <p className="text-white/90 text-center text-sm font-medium mt-3 mb-6 relative z-10">
                    en tu <strong className="text-white">primer servicio</strong>
                  </p>

                  <div className="relative flex items-center my-6 z-10">
                    <div className="absolute -left-10 w-5 h-5 bg-white/20 rounded-full" />
                    <div className="flex-1 border-t border-dashed border-white/30" />
                    <div className="absolute -right-10 w-5 h-5 bg-white/20 rounded-full" />
                  </div>

                  <div className="relative z-10 bg-white/15 rounded-2xl px-5 py-4 text-center">
                    <p className="text-white text-sm leading-relaxed">
                      Únete a la lista de espera y tu descuento<br />
                      queda <strong>reservado automáticamente</strong>.<br />
                      Sin tarjeta. Sin compromisos.
                    </p>
                  </div>
                </div>

                <div className="absolute -top-5 -right-5 w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#FF1B1C]/20 z-20 text-center px-2">
                  <span className="text-[#FF1B1C] font-black text-sm leading-tight">¡Solicítalo</span>
                  <span className="text-[#FF1B1C] font-black text-sm leading-tight">YA!</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — "En Ya Llegué Podrás Contratar"
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FF1B1C] py-20">
        <div className={container}>
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-14 leading-tight">
            En Ya Llegué! Podrás Contratar
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.label}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-lg"
              >
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  className={`object-cover ${s.position} group-hover:scale-110 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — "Conectamos proveedores" + How it works
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className={container}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                Conectamos{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#FF1B1C] to-[#FF6B6B] bg-clip-text text-transparent">
                    proveedores
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path d="M2 6 C 40 2, 100 1, 198 5" stroke="#FF1B1C" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                con clientes que los necesitan
              </h2>

              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF1B1C] to-[#FF4444] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[#FF1B1C]/25 hover:shadow-[#FF1B1C]/40 hover:scale-105 transition-all duration-300 text-sm"
              >
                Únete a la lista de espera y obtén $5 OFF
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: steps */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-red-50/40 transition-colors duration-300 border border-transparent hover:border-red-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF1B1C] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-md shadow-[#FF1B1C]/20">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#FF1B1C] mb-1 text-sm uppercase tracking-wide">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — "¿Se te dañó el chorro?" callout
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="grid lg:grid-cols-2 min-h-[480px]">
          {/* Left: copy — padding handled inline so it's always present */}
          <div className="bg-white flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-16">
            <p className="text-2xl text-gray-600 mb-2 font-medium">¿Se te dañó el chorro?</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
              Contrata a quien lo repare en{' '}
              <span className="bg-gradient-to-r from-[#FF1B1C] to-[#FF6B6B] bg-clip-text text-transparent">
                Ya Llegué!
              </span>
            </h2>
            <button
              onClick={scrollToForm}
              className="self-start inline-flex items-center gap-2 bg-gradient-to-r from-[#FF1B1C] to-[#FF4444] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[#FF1B1C]/25 hover:shadow-[#FF1B1C]/40 hover:scale-105 transition-all duration-300 text-sm"
            >
              Únete a la lista de espera y obtén $5 OFF
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: full-bleed image */}
          <div className="relative min-h-[320px] lg:min-h-[480px]">
            <Image
              src="/images/services/todos.png"
              alt="Proveedores de servicios"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent lg:from-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — $5 OFF + FORM
      ═══════════════════════════════════════════════════════════════ */}
      <section ref={formRef} className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-gradient-to-br from-[#FF1B1C]/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-gradient-to-tr from-[#FF4444]/6 to-transparent rounded-full blur-3xl" />
        </div>

        <div className={`relative ${container}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: $5 OFF copy */}
            <div>
              <div className="mb-4">
                <span className="text-[7rem] md:text-[9rem] font-black leading-none bg-gradient-to-br from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent block">
                  $5
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight -mt-3">
                  OFF en tu{' '}
                  <span className="bg-gradient-to-r from-[#FF1B1C] to-[#FF6B6B] bg-clip-text text-transparent">
                    primer servicio
                  </span>
                </h2>
              </div>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ¿Has necesitado una reparación, pero no sabes dónde contratar a alguien?{' '}
                <strong className="text-gray-900">Ya Llegué!</strong> resuelve eso. Únete a la lista
                de espera y recibe $5 de descuento en tu primer servicio al lanzamiento.
              </p>

              <div className="space-y-3">
                {[
                  'Proveedores verificados con documentos',
                  'Pagos seguros dentro de la plataforma',
                  'Califica y monitorea cada servicio',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              {!isSuccess ? (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B]" />

                  <div className="p-5 sm:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Únete a la lista de espera
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Completa el formulario y tu $5 OFF queda reservado.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name + Last name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF1B1C] focus:ring-2 focus:ring-[#FF1B1C]/15 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Apellido
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tu apellido"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF1B1C] focus:ring-2 focus:ring-[#FF1B1C]/15 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          disabled={isLoading}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF1B1C] focus:ring-2 focus:ring-[#FF1B1C]/15 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Phone with +503 prefix */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Número de teléfono
                        </label>
                        <div className="flex rounded-xl border border-gray-200 focus-within:border-[#FF1B1C] focus-within:ring-2 focus-within:ring-[#FF1B1C]/15 overflow-hidden transition-all duration-200 bg-white">
                          <div className="flex items-center px-4 bg-gray-50 border-r border-gray-200 flex-shrink-0">
                            <span className="text-gray-600 font-semibold text-sm select-none">+503</span>
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhone}
                            placeholder="0000 0000"
                            maxLength={8}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed bg-transparent"
                          />
                          <div className="flex items-center pr-4">
                            <span className={`text-xs font-medium tabular-nums ${phone.length === 8 ? 'text-green-500' : 'text-gray-400'}`}>
                              {phone.length}/8
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Service dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ¿Qué servicio necesitas?
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF1B1C] focus:ring-2 focus:ring-[#FF1B1C]/15 outline-none transition-all duration-200 text-gray-900 appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <option value="" disabled>
                              Selecciona una categoría...
                            </option>
                            {serviceOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/35 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          <>
                            ¡Quiero mi $5 OFF!
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-400 text-center leading-relaxed">
                        Sin spam. Solo te avisamos cuando estemos listos.
                      </p>
                    </form>
                  </div>
                </div>
              ) : (
                /* Success state */
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center">
                  <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />
                  <div className="p-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Ya estás en la lista!</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      Enviamos la confirmación a{' '}
                      <strong className="text-gray-900">{email}</strong> con tu descuento de{' '}
                      <strong className="text-green-600">$5 OFF</strong> listo para usar.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-8">
                      <div className="text-5xl font-black text-green-600 mb-1">$5</div>
                      <div className="text-sm font-semibold text-green-700">OFF reservado para ti</div>
                      <div className="text-xs text-green-600 mt-1">en tu primer servicio al lanzamiento</div>
                    </div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-[#FF1B1C] transition-colors">
                      Explorar el sitio →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <div className={container}>
          <Image
            src="/images/logos/logo.png"
            alt="Ya Llegué"
            width={130}
            height={52}
            className="h-10 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-gray-400 text-sm mb-1">Tu ayuda confiable, cuando y donde la necesites.</p>
          <p className="text-gray-600 text-xs">&copy; 2025 Ya Llegué! Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
