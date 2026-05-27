'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, X, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react'

// TODO: Reemplazar con el número de WhatsApp real del equipo (sin '+' ni espacios, ej: 50370123456)
const WA_HREF = `https://wa.me/50300000000?text=${encodeURIComponent('Hola! Vi la propuesta de inversión de Ya Llegué! y me gustaría hablar con el equipo.')}`

// ─── Reusable primitives ────────────────────────────────────────────────────

const TAG = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#FF1B1C] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
    {children}
  </span>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3 leading-tight">
    {children}
  </h2>
)

const Sub = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">{children}</p>
)

// ─── Slide components ────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div className="min-h-full bg-[#0D1117] text-white px-4 py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF1B1C] opacity-[0.04] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="bg-white rounded-xl p-2.5 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/logo.png" alt="Ya Llegué!" className="h-11 w-auto object-contain" />
          </div>
          <div className="h-px w-full sm:h-10 sm:w-px bg-white/10" />
          <div>
            <p className="text-xs text-[#FF1B1C] font-semibold tracking-widest uppercase">
              Propuesta de Inversión Pre-Seed · El Salvador · 2026
            </p>
            <p className="text-xs text-white/35 mt-0.5">yalleguesv.com · Marketplace SaaS</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3.5 py-1.5 mb-7">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-sm text-green-400 font-medium">App en producción — transacciones reales activas hoy</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-4xl">
          La infraestructura que organiza el mercado de servicios{' '}
          <span className="text-[#FF1B1C]">informales</span> en Centroamérica.
        </h1>

        <p className="text-white/55 text-lg mb-10 max-w-3xl leading-relaxed">
          Ya Llegué! conecta clientes con proveedores verificados — desde limpiadoras Airbnb hasta
          electricistas, plomeros y tour guides — a través de un marketplace estructurado con pagos
          protegidos y reputación portable.
        </p>

        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FF1B1C] hover:bg-[#FF1B1C]/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#FF1B1C]/20"
        >
          Contactar al equipo <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

function ProblemaSlide() {
  return (
    <div className="min-h-full bg-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>El Problema</TAG>
          <H2>Contratar un servicio de confianza en El Salvador sigue siendo imposible.</H2>
          <Sub>El 70% de la fuerza laboral opera informalmente. Millones de transacciones diarias ocurren sin plataforma de soporte, sin protección y sin rendición de cuentas.</Sub>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: '⚠', accent: '#FF1B1C', title: 'Sin verificación de ningún tipo', desc: 'Los clientes contratan desconocidos de grupos de WhatsApp y Facebook sin validación de identidad, antecedentes penales ni experiencia comprobada.' },
            { icon: '💸', accent: '#FF1B1C', title: 'Pagos en efectivo, sin protección', desc: 'Sin comprobantes, sin mecanismo de resolución de disputas. El cliente paga por adelantado y el trabajador cobra tarde — o no cobra.' },
            { icon: '⭐', accent: '#FF1B1C', title: 'La calidad de trabajo es invisible', desc: 'Un electricista con 10 años de trayectoria luce igual que uno sin experiencia. No existe sistema de reputación portable en el mercado informal.' },
            { icon: '🔧', accent: '#0057B7', title: 'Los trabajadores no pueden escalar', desc: 'Sin visibilidad digital, sin cartera de clientes estructurada, sin historial formal. El crecimiento depende 100% del boca a boca.' },
          ].map((item, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: item.accent }} />
              <div className="p-6 pl-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${item.accent}12` }}>{item.icon}</div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          {[
            { value: '70%', label: 'Informalidad laboral en El Salvador', color: '#FF1B1C' },
            { value: '$0', label: 'Infraestructura digital dedicada existente', color: '#0057B7' },
            { value: 'Diario', label: 'Demanda constante sin plataforma', color: '#10B981' },
          ].map((stat, i) => (
            <div key={i} className={`p-6 text-center ${i < 2 ? 'border-r border-gray-200' : ''}`}>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1.5 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SolucionSlide() {
  return (
    <div className="min-h-full bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>La Solución</TAG>
          <H2>Ya Llegué! le da estructura al caos.</H2>
          <Sub>No inventamos la demanda — existe y ocurre todos los días, en efectivo y sin rastro. Construimos la capa que hace cada transacción segura, trazable y confiable.</Sub>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <div className="text-xs font-bold text-[#FF1B1C] uppercase tracking-widest mb-5">Sin Ya Llegué!</div>
            {[
              'Contratación por WhatsApp y Facebook',
              'Pagos en efectivo sin comprobante',
              'Sin verificación de identidad',
              'Sin protección por cancelación',
              'Reputación y calidad invisibles',
              'Trabajadores sin visibilidad digital',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <X className="w-4 h-4 text-[#FF1B1C] flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-green-100 p-6">
            <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-5">Con Ya Llegué!</div>
            {[
              'Marketplace verificado y estructurado',
              'Pagos digitales seguros en la plataforma',
              'DUI + PNC + antecedentes penales',
              'Flujos de cancelación y protección',
              'Sistema de reputación portable',
              'Perfiles y portafolio digital',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Flujo completo de un servicio en la plataforma</p>
          <div className="flex flex-wrap items-center gap-2">
            {['Solicitud', 'Conexión', 'Acepta', 'Pago Protegido', 'Servicio', 'Reseña + Cobro'].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800">{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VerticalesSlide() {
  return (
    <div className="min-h-full bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Verticales de Servicio</TAG>
          <H2>Seis verticales. Housekeeping como producto estrella.</H2>
          <Sub>Dos pilares dominan el volumen. Tres verticales donde somos los primeros en El Salvador con cero competencia digital directa.</Sub>
        </div>

        <div className="bg-white border-2 border-[#FF1B1C]/15 rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="text-4xl">🏠</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-bold text-gray-900 text-lg">Housekeeping & Limpieza Airbnb</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF1B1C] text-white tracking-wide">⭐ PRODUCTO ESTRELLA</span>
                <span className="text-sm font-bold text-[#FF1B1C]">38% del volumen</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                ~12,000 propiedades Airbnb activas en El Salvador más hogares y ranchos. Recurrencia semanal o quincenal. Menor CAC del portafolio y mayor LTV. Principal motor de GMV en Fase 1.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-50 text-[#FF1B1C] border border-red-100">AOV $25–$45 · Frecuencia semanal</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">LTV más alto del portafolio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '⚡', name: 'Mantenimiento del Hogar', vol: '30% vol.', color: '#10B981', pioneer: false, desc: 'Electricidad, plomería, A/C, jardinería, pintura. Junto con Housekeeping, conforma el 68% del volumen total.', aov: 'AOV $30–$120 · Alta urgencia' },
            { icon: '🔧', name: 'Mecánicos Flash', vol: '12% vol.', color: '#FF1B1C', pioneer: true, desc: '900,000+ vehículos en El Salvador con cero competidores digitales. Cambio de aceite, llantas y batería a domicilio — sin taller, sin filas.', aov: 'AOV $25–$80 · Cada 3-4 meses' },
            { icon: '🚌', name: 'Microbús & Tours Corporativos', vol: '5% vol.', color: '#0057B7', pioneer: true, desc: '+800,000 turistas/año en SV · 3,000+ empresas con traslados mensuales. Sin plataforma digital de reservas para este servicio.', aov: 'AOV $80–$350 · Alto ticket corporativo' },
            { icon: '🎉', name: 'Eventos & Entretenimiento', vol: '4% vol.', color: '#F59E0B', pioneer: true, desc: 'Mercado de eventos en SV estimado en $120M/año. DJs, luces, animadores y organizadores de eventos — 100% informal hoy. Mayor AOV del portafolio.', aov: 'AOV $200–$2,000+ · Mayor ticket' },
            { icon: '🐾', name: 'Pet Hospedaje & Taxi para Mascotas', vol: '3% vol.', color: '#6B7280', pioneer: false, desc: 'Hospedaje con proveedores pre-calificados. Transporte seguro al veterinario, peluquería canina o cualquier destino.', aov: 'Hospedaje $20–$50 · Taxi $10–$25', fullWidth: true },
          ].map((v, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${(v as { fullWidth?: boolean }).fullWidth ? 'sm:col-span-2' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{v.icon}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: `${v.color}15`, color: v.color }}>{v.vol}</span>
                  {v.pioneer && <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ background: v.color }}>PIONEROS</span>}
                </div>
              </div>
              <div className="font-bold text-gray-900 mb-2">{v.name}</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{v.desc}</p>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-50 text-[#FF1B1C] border border-red-100">{v.aov}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MercadoSlide() {
  return (
    <div className="min-h-full bg-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Tamaño de Mercado</TAG>
          <H2>Masivo, cotidiano y sin infraestructura digital.</H2>
          <Sub>El mercado de servicios a domicilio en Centroamérica mueve miles de millones de dólares — en efectivo, hoy, sin plataforma que lo organice.</Sub>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'TAM', value: '$4.2B', sub: 'Servicios domésticos y profesionales en toda Centroamérica', bg: 'rgba(0,87,183,0.04)', border: 'rgba(0,87,183,0.18)', color: '#0057B7' },
            { label: 'SAM', value: '$480M', sub: 'El Salvador + Guatemala digitalmente accesibles', bg: 'rgba(255,27,28,0.04)', border: 'rgba(255,27,28,0.18)', color: '#FF1B1C' },
            { label: 'SOM', value: '$18M', sub: 'Captura conservadora realista en Año 3 de operación', bg: 'rgba(16,185,129,0.04)', border: 'rgba(16,185,129,0.18)', color: '#10B981' },
          ].map((m, i) => (
            <div key={i} className="rounded-2xl border p-5 text-center" style={{ background: m.bg, borderColor: m.border }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: m.color }}>{m.label}</div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: m.color }}>{m.value}</div>
              <div className="text-xs text-gray-500 mt-2 leading-snug">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { value: '6.5M', label: 'Población de El Salvador', color: '#FF1B1C' },
            { value: '70%', label: 'Tasa de informalidad laboral', color: '#0057B7' },
            { value: '$38', label: 'AOV promedio ponderado', color: '#10B981' },
            { value: '75%', label: 'Penetración de teléfonos inteligentes en SV', color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1.5 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-5">¿Por qué ahora?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">El consumidor ya cambió</div>
              <p className="text-sm text-gray-500 leading-relaxed">Hoy la gente en Centroamérica pide comida en <strong className="text-gray-800">PedidosYa</strong>, reserva en <strong className="text-gray-800">Airbnb</strong> y solicita transporte con <strong className="text-gray-800">Uber</strong>. La adopción digital ya ocurrió. No estamos creando un nuevo hábito — estamos organizando una categoría que todavía opera fragmentada.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Nadie se adelantó</div>
              <p className="text-sm text-gray-500 leading-relaxed">Ningún competidor local tiene la infraestructura completa: verificación de identidad, pagos digitales con fondos en garantía, reseñas portables y operaciones formales. Somos los primeros en construirla en El Salvador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModeloSlide() {
  return (
    <div className="min-h-full bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Modelo de Negocio</TAG>
          <H2>Tres capas de ingresos. Márgenes que crecen con la escala.</H2>
          <Sub>Modelo híbrido marketplace + SaaS. Ingresos transaccionales desde el primer día. Ingresos recurrentes que escalan con la plataforma.</Sub>
        </div>

        <div className="space-y-4 mb-8">
          {[
            {
              num: '01', color: '#FF1B1C',
              title: 'Comisión por Transacción',
              rate: '15–18%',
              desc: 'Por trabajo completado, cobrado a través de la plataforma con fondos en garantía. La comisión escala al 18% conforme se consolidan las funciones avanzadas y la confianza del mercado.',
            },
            {
              num: '02', color: '#0057B7',
              title: 'Plan Avanzado para Proveedores',
              rate: '$15–$25/mes',
              desc: 'Plan de pago mensual lanzado en Año 2. Visibilidad mejorada, conexión prioritaria con clientes y análisis del negocio. Modelo inspirado en Upwork Connects y LinkedIn Premium.',
            },
            {
              num: '03', color: '#10B981',
              title: 'Posicionamiento Destacado y Publicidad',
              rate: '$8–$20/mes',
              desc: 'Posicionamiento por categoría pagado por el proveedor. Modelo de impulso de visibilidad similar a Tinder y Uber. Conforme se demuestra el retorno, la disposición a pagar crece de forma natural.',
            },
          ].map((rev, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${rev.color}12`, color: rev.color }}>{rev.num}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{rev.title}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: `${rev.color}12`, color: rev.color }}>{rev.rate}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{rev.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-[#FF1B1C]">+10%</div>
              <div className="text-xs text-gray-500 mt-0.5">Cargo por urgencia</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#0057B7]">+15%</div>
              <div className="text-xs text-gray-500 mt-0.5">Cargo fin de semana</div>
            </div>
            <div className="flex-1 text-sm text-gray-500 leading-relaxed">
              Housekeeping (38%) + Mantenimiento del Hogar (30%) = 68% del GMV. Mecánicos como pioneros en SV (12%). Eventos y Microbús como verticales de alto ticket sin competencia digital.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TraccionSlide() {
  return (
    <div className="min-h-full bg-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Tracción</TAG>
          <H2>Plataforma viva. Sin financiamiento externo.</H2>
          <Sub>Todo lo que ven a continuación fue construido con $0 en capital institucional. Esto es lo que el equipo produjo sin financiamiento de ningún tipo.</Sub>
        </div>

        <div className="divide-y divide-gray-50">
          {[
            { title: '250+ proveedores reclutados sin capital externo', sub: 'Limpieza, electricistas, plomeros, técnicos de mantenimiento, belleza, jardinería — 8 categorías activas en El Salvador.' },
            { title: 'App en producción con solicitudes reales', sub: 'Trabajos procesados en Chalatenango, Santa Tecla y La Libertad. URL activa: ya-llegue-real.vercel.app' },
            { title: 'Sitio web con tráfico activo', sub: 'Registro de proveedores operativo, lista de espera de clientes y marca completa. yalleguesv.com' },
            { title: 'Identidad de marca profesional desde cero', sub: 'Logo, guía de identidad visual, uniformes, branding vehicular, plantillas de redes sociales y materiales de presentación.' },
            { title: 'Pagos con tarjeta operativos', sub: 'Débito y crédito funcionando. Integración de API completada. Sistema de retención de pagos diseñado y documentado.' },
            { title: 'Estructura legal y corporativa en proceso', sub: 'Reunión con abogada completada. Estructura SAS iniciada. Protección de propiedad intelectual en proceso.' },
            { title: 'Redes sociales activas con campañas en curso', sub: 'Instagram, Facebook y WhatsApp Business operativos. Campañas activas de adquisición de proveedores y clientes.' },
            { title: 'MVP al 85% de avance', sub: 'Flujos de solicitud, conexión de proveedores, perfiles y panel operativos. Arquitectura técnica documentada.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FinanzasSlide() {
  return (
    <div className="min-h-full bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Proyecciones Financieras</TAG>
          <H2>Números reales, supuestos conservadores.</H2>
          <Sub>Basado en 300 proveedores activos → 35% de actividad → $38 de AOV ponderado → 15% de comisión. Con un margen de seguridad del 64% sobre el valor promedio real calculado.</Sub>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { year: 'Año 1 — 2026', gmv: '$182k GMV', rev: '$36k Ingresos', net: '($29k) Neto', netColor: '#FF1B1C', note: 'con inversión inicial' },
            { year: 'Año 2 — 2027', gmv: '$1.0M GMV', rev: '$224k Ingresos', net: '+$71k Neto', netColor: '#10B981', note: 'Rentable' },
            { year: 'Año 3 — 2028', gmv: '$4.4M GMV', rev: '$1.0M Ingresos', net: '+$650k Neto', netColor: '#10B981', note: '64% margen neto' },
          ].map((y, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">{y.year}</div>
              <div className="text-lg font-bold text-[#0057B7] mb-1">{y.gmv}</div>
              <div className="text-sm font-semibold text-[#FF1B1C] mb-1">{y.rev}</div>
              <div className="text-sm font-semibold" style={{ color: y.netColor }}>{y.net}</div>
              <div className="text-xs text-gray-400 mt-1">{y.note}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'MRR proyectado Año 1', value: '$7,500', sub: 'Fin del Mes 12' },
            { label: 'Punto de equilibrio', value: 'Mes 14', sub: 'Con la ronda de $125k' },
            { label: 'Comisión combinada', value: '~20%', sub: 'Comisiones + SaaS + Publicidad' },
            { label: 'Ratio LTV / CAC', value: '10.6x', sub: 'Año 1 conservador' },
          ].map((u, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 leading-snug">{u.label}</div>
              <div className="text-2xl font-bold text-gray-900">{u.value}</div>
              <div className="text-xs text-gray-400 mt-1">{u.sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-sm font-semibold text-gray-500 mb-5">Trayectoria de GMV mensual — Año 1</p>
          {[
            { period: 'M1–M3', pct: 15, value: '$11k' },
            { period: 'M4–M6', pct: 35, value: '$26k' },
            { period: 'M7–M9', pct: 62, value: '$47k' },
            { period: 'M10–M12', pct: 100, value: '$76k' },
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="text-xs text-gray-400 w-16 text-right flex-shrink-0">{bar.period}</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF1B1C] rounded-full" style={{ width: `${bar.pct}%` }} />
              </div>
              <div className="text-xs font-semibold text-gray-700 w-10 flex-shrink-0">{bar.value}</div>
            </div>
          ))}
        </div>

        {/* Glosario de siglas */}
        <div className="bg-gray-100 rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Glosario de siglas</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              ['GMV', 'Valor bruto total transaccionado en la plataforma'],
              ['AOV', 'Monto promedio por servicio'],
              ['CAC', 'Costo de adquirir un nuevo cliente'],
              ['LTV', 'Ingresos totales generados por un cliente a lo largo del tiempo'],
              ['MRR', 'Ingresos mensuales recurrentes'],
              ['ARR', 'Ingresos anuales recurrentes'],
              ['SaaS', 'Software como servicio (modelo de suscripción)'],
            ].map(([acr, def]) => (
              <span key={acr} className="text-xs text-gray-500">
                <strong className="text-gray-700">{acr}:</strong> {def}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompetenciaSlide() {
  return (
    <div className="min-h-full bg-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Paisaje Competitivo</TAG>
          <H2>Nadie está construyendo esto para el mercado centroamericano.</H2>
          <Sub>Los jugadores globales como TaskRabbit no operan en El Salvador. Los locales son grupos de Facebook. Somos la única plataforma con infraestructura marketplace real y operativa.</Sub>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Plataforma</th>
                  {['Verificado', 'Pago seguro', 'Reseñas', 'Foco SV', 'Ops. formales'].map(h => (
                    <th key={h} className="text-center py-3.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Ya Llegué! ✦', highlight: true, vals: [true, true, true, true, true] },
                  { name: 'Grupos de Facebook', vals: [false, false, false, true, false] },
                  { name: 'WhatsApp', vals: [false, false, false, true, false] },
                  { name: 'TaskRabbit (EUA)', vals: [true, true, true, false, true] },
                  { name: 'NomoLabs (SV)', vals: [true, false, false, true, false] },
                  { name: 'Boca a boca', vals: [false, false, false, true, false] },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 last:border-0 ${row.highlight ? 'bg-white' : ''}`}>
                    <td className={`py-3.5 px-5 font-medium ${row.highlight ? 'text-[#FF1B1C] font-bold' : 'text-gray-700'}`}>{row.name}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="py-3.5 px-3 text-center text-base">
                        {v ? <span className="text-green-500 font-bold">✓</span> : <span className="text-red-400">✕</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
            <div className="text-xs font-semibold text-[#FF1B1C] uppercase tracking-widest mb-3">Ventajas diferenciales</div>
            {[
              'Única plataforma con verificación completa en SV',
              'Pagos digitales con fondos en garantía',
              'Reputación portable entre trabajos y clientes',
              'Operaciones formales y flujos estructurados',
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
            <div className="text-xs font-semibold text-[#0057B7] uppercase tracking-widest mb-3">Por qué los actuales jugadores no ganan</div>
            {[
              'TaskRabbit: no opera en SV, sin planes de expansión',
              'Facebook/WhatsApp: redes sociales, no marketplaces',
              'NomoLabs: sin pagos, sin reseñas, sin operaciones formales',
              'Boca a boca: no escalable, invisible, sin datos',
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                <ChevronRight className="w-4 h-4 text-[#FF1B1C] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadmapSlide() {
  return (
    <div className="min-h-full bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>Roadmap</TAG>
          <H2>De El Salvador a Centroamérica en 36 meses.</H2>
          <Sub>Tres fases claras. Cada una construye sobre la anterior.</Sub>
        </div>

        <div className="space-y-4">
          {[
            {
              phase: 'Fase 1 · Q1–Q2 2026', color: '#FF1B1C', active: true,
              title: 'Primeros ingresos reales',
              items: ['Pagos digitales en producción', 'Verificación manual de proveedores', 'Chat interno entre usuario y proveedor', '500 proveedores incorporados', 'Vertical de Eventos lanzada', 'Primeros clientes pagando', 'Ronda Pre-Seed completada'],
            },
            {
              phase: 'Fase 2 · Mes 12–24', color: '#0057B7', active: false,
              title: 'Profundidad de producto + Alianzas estratégicas',
              items: ['Rastreo en tiempo real', 'Integración con WhatsApp Business', 'Plan avanzado para proveedores', 'Sistema de referidos activo', 'Alianzas con anfitriones Airbnb', 'Eventos corporativos', 'Preparación Serie A'],
            },
            {
              phase: 'Fase 3 · Mes 24–36', color: '#9CA3AF', active: false,
              title: 'Expansión regional + Conexión con IA + Apps nativas',
              items: ['Guatemala y Honduras', 'Conexión algorítmica con IA', 'Apps iOS y Android nativas', 'Alianzas con aseguradoras', 'Serie A o adquisición estratégica'],
            },
          ].map((phase, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: phase.color, opacity: i === 2 ? 0.4 : 1 }} />
              <div className="pl-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: phase.color }}>{phase.phase}</span>
                  {phase.active && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />En curso
                    </span>
                  )}
                </div>
                <div className="font-bold text-gray-900 mb-3">{phase.title}</div>
                <div className="flex flex-wrap gap-2">
                  {phase.items.map((item, j) => (
                    <span key={j} className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: `${phase.color}10`, color: phase.color }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Prioridades inmediatas — próximas 8 semanas</p>
          <div className="flex flex-wrap gap-2">
            {['Pagos digitales en producción', 'Panel del proveedor', 'Flujo de reservas', 'Pago con garantía', 'Panel de administración', 'Vertical Eventos', 'Beta con 50 proveedores'].map((item, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-50 text-[#FF1B1C] border border-red-100">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EquipoSlide() {
  return (
    <div className="min-h-full bg-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <TAG>El Equipo</TAG>
          <H2>Operadores que construyen. No solo presentan.</H2>
          <Sub>Fundado por personas con experiencia real en operaciones, tecnología de producto y ejecución en el contexto del mercado salvadoreño.</Sub>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { initials: 'MS', name: 'Manuel Suriano', role: 'Co-Fundador · CEO', color: '#FF1B1C', skills: ['Operaciones & Estrategia de Marketplace', 'Sistemas de reclutamiento', 'Arquitectura de producto', 'Sistemas de IA y Automatización'] },
            { initials: 'GP', name: 'Guillermo Palacios', role: 'Co-Fundador · CTO', color: '#0057B7', skills: ['Desarrollo de software integral', 'React / Next.js / Supabase', 'Arquitectura de marketplace', 'App en producción hoy'] },
            { initials: 'DM', name: 'Diego Meléndez', role: 'Co-Fundador · CMO', color: '#10B981', skills: ['Crecimiento y adquisición de usuarios', 'Contenido digital', 'Campañas de incorporación', 'Redes sociales activas'] },
          ].map((member, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4" style={{ background: member.color }}>{member.initials}</div>
              <div className="font-bold text-gray-900 mb-1">{member.name}</div>
              <div className="text-xs text-gray-400 mb-4">{member.role}</div>
              <div className="space-y-1.5">
                {member.skills.map((skill, j) => <div key={j} className="text-xs text-gray-600 leading-relaxed">{skill}</div>)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Lo que traemos al proyecto</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Reclutamiento de ciclo completo y operaciones de talento',
              'Arquitectura de marketplace completa ya en producción',
              '250+ proveedores reclutados sin capital externo',
              'CRM, SaaS y experiencia operacional profunda',
              'App de desarrollo integral en producción — verificada hoy',
              'Conocimiento profundo del mercado informal en SV',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center text-sm text-gray-600">
          Buscamos: <strong className="text-gray-900">Capital estratégico + acompañamiento operacional + red regional centroamericana.</strong> No solo un cheque.
        </div>
      </div>
    </div>
  )
}

function PropuestaSlide() {
  return (
    <div className="min-h-full bg-[#0D1117] text-white px-4 py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF1B1C] opacity-[0.04] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#FF1B1C]/80 mb-3">Ronda Pre-Seed · Plataforma operativa · El Salvador · 2026</p>
          <div className="text-6xl sm:text-7xl font-bold text-[#FF1B1C] mb-3">$125,000</div>
          <div className="text-lg text-white/55">10% de participación · Valoración post-inversión: $1,250,000 · ~22 meses de operación</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { pct: '32%', name: 'Desarrollo de Producto', amount: '$40,000', desc: 'Producto funcional completo, interfaz lista para usuarios, panel de administración, integraciones de pagos y contratos digitales, vertical de Eventos.' },
            { pct: '26%', name: 'Crecimiento y Adquisición', amount: '$33,000', desc: 'Publicidad en Meta/Instagram ($15k), reclutamiento de proveedores ($8k), programa de referidos ($5k), contenido y marca ($5k).' },
            { pct: '26%', name: 'Operaciones', amount: '$32,000', desc: 'Salarios del equipo fundador por 12 meses, verificación de proveedores, estructura legal SAS, atención al cliente.' },
            { pct: '16%', name: 'Reserva + Desarrollo de Negocios', amount: '$20,000', desc: 'Reserva de 3 meses operativos, alianzas con Airbnb y empresas, mejoras de infraestructura técnica.' },
          ].map((fund, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl font-bold text-[#FF1B1C] mb-1">{fund.pct}</div>
              <div className="font-semibold text-white mb-1">{fund.name}</div>
              <div className="text-xs text-white/35 mb-2">{fund.amount}</div>
              <div className="text-sm text-white/55 leading-relaxed">{fund.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start gap-5">
          <div className="text-5xl font-bold text-green-400 flex-shrink-0">4.8x</div>
          <div>
            <div className="font-semibold text-white mb-2">Retorno proyectado para el inversor en Año 3</div>
            <div className="text-sm text-white/55 leading-relaxed">
              $125k por 10% de participación → valorado en ~$600k a 5x ARR de salida ($1.0M ARR × 5 = $5M+ de valoración de empresa). Escenario conservador, sin considerar el efecto multiplicador de una Serie A. Punto de equilibrio proyectado en el Mes 14.
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white rounded-xl p-3 inline-block mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/logo.png" alt="Ya Llegué!" className="h-12 w-auto object-contain" />
          </div>
          <div className="text-white/35 text-sm mb-6">yalleguesv.com · soporte@yallegue.com · El Salvador, Centroamérica</div>
          <a
            href="mailto:soporte@yallegue.com"
            className="inline-flex items-center gap-2 bg-[#FF1B1C] hover:bg-[#FF1B1C]/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#FF1B1C]/20"
          >
            Contactar al Equipo <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Slides registry ─────────────────────────────────────────────────────────

const SLIDES = [
  { id: 'cover',       label: 'Resumen',      Component: CoverSlide },
  { id: 'problema',    label: 'Problema',      Component: ProblemaSlide },
  { id: 'solucion',    label: 'Solución',      Component: SolucionSlide },
  { id: 'verticales',  label: 'Verticales',    Component: VerticalesSlide },
  { id: 'mercado',     label: 'Mercado',       Component: MercadoSlide },
  { id: 'modelo',      label: 'Modelo',        Component: ModeloSlide },
  { id: 'traccion',    label: 'Tracción',      Component: TraccionSlide },
  { id: 'finanzas',    label: 'Finanzas',      Component: FinanzasSlide },
  { id: 'competencia', label: 'Competencia',   Component: CompetenciaSlide },
  { id: 'roadmap',     label: 'Roadmap',       Component: RoadmapSlide },
  { id: 'equipo',      label: 'Equipo',        Component: EquipoSlide },
  { id: 'propuesta',   label: 'La Propuesta',  Component: PropuestaSlide },
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PitchDeckPage() {
  const [current, setCurrent] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const goTo = (i: number) => {
    setCurrent(i)
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, SLIDES.length - 1))
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Keep active nav item visible
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const active = nav.querySelector('[data-active="true"]') as HTMLElement | null
    if (!active) return
    nav.scrollTo({
      left: nav.scrollLeft + active.getBoundingClientRect().left - nav.getBoundingClientRect().left - nav.getBoundingClientRect().width / 2 + active.getBoundingClientRect().width / 2,
      behavior: 'smooth',
    })
  }, [current])

  const { Component } = SLIDES[current]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <nav className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="px-4">
          <div ref={navRef} className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
            <Link href="/" className="mr-3 flex-shrink-0">
              <Image src="/images/logos/logo.png" alt="Ya Llegué!" width={90} height={36} className="h-8 w-auto object-contain" priority />
            </Link>
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                data-active={i === current}
                onClick={() => goTo(i)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  i === current
                    ? 'bg-[#FF1B1C] text-white font-semibold shadow-sm'
                    : 'text-gray-500 hover:text-[#FF1B1C] hover:bg-red-50'
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── SLIDE CONTENT ───────────────────────────────────── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <Component />
      </div>

      {/* ── BOTTOM NAV ──────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => goTo(Math.max(current - 1, 0))}
            disabled={current === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed text-gray-700 hover:text-[#FF1B1C] hover:bg-red-50 disabled:hover:bg-transparent disabled:hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" /> Atrás
          </button>

          <div className="text-center">
            <div className="text-xs font-semibold text-gray-400 tabular-nums">{current + 1} / {SLIDES.length}</div>
            <div className="text-xs text-[#FF1B1C] font-medium mt-0.5">{SLIDES[current].label}</div>
          </div>

          <button
            onClick={() => goTo(Math.min(current + 1, SLIDES.length - 1))}
            disabled={current === SLIDES.length - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed text-gray-700 hover:text-[#FF1B1C] hover:bg-red-50 disabled:hover:bg-transparent disabled:hover:text-gray-700"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
