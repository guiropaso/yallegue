import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Ya Llegué',
  description: 'Conozca cómo Ya Llegué recopila, utiliza y protege su información personal.',
}

function MinimalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="bg-white/80 md:bg-white/70 backdrop-blur-sm md:backdrop-blur-md border border-white/20 shadow-lg max-w-[1280px] w-full mx-6 overflow-hidden rounded-full">
        <div className="flex items-center justify-between py-4 px-10">
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
        </div>
      </div>
    </header>
  )
}

export default function PrivacidadPage() {
  return (
    <>
      <MinimalHeader />
      <main className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F5]">
        {/* Offset for fixed header */}
        <div className="pt-36 pb-16 px-6">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Política de Privacidad</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: 29 de octubre de 2025</p>

            <section className="space-y-6 text-gray-800">
              <p className="leading-relaxed">
                En <span className="font-semibold">Ya Llegué</span> (“nosotros”, “nuestro” o “la Plataforma”), valoramos la privacidad de nuestros
                usuarios y proveedores de servicios. Esta Política de Privacidad explica cómo recopilamos, utilizamos,
                almacenamos y protegemos la información personal que obtenemos a través de nuestro sitio web{' '}
                <Link href="https://yalleguesv.com" className="text-[#FF1B1C] hover:underline" target="_blank">yalleguesv.com</Link>
                {' '}y nuestras integraciones con plataformas de terceros.
              </p>
              <p className="leading-relaxed">Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.</p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">1. Información que recopilamos</h2>
              <h3 className="text-lg font-medium text-gray-900 mt-6">De los proveedores de servicios:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de WhatsApp</li>
                <li>Documento Único de Identidad (DUI)</li>
                <li>Fotografías del DUI</li>
                <li>Fotografía o documento de solvencia de la Policía Nacional Civil (PNC)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">De los usuarios que solicitan servicios:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">De todos los usuarios (proveedores y clientes):</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mensajes enviados dentro de la plataforma (para prevenir fraudes, actividades ilegales o violaciones a los Términos de Uso)</li>
                <li>Información técnica básica (cookies, dirección IP, tipo de navegador, tiempo de visita, etc.)</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">2. Finalidad del uso de los datos</h2>
              <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verificar la identidad de los proveedores de servicios.</li>
                <li>Facilitar la comunicación entre usuarios y proveedores.</li>
                <li>Garantizar la seguridad de las transacciones y prevenir actividades ilegales.</li>
                <li>Analizar datos de manera anonimizada para mejorar nuestros servicios y ofrecer mejores recomendaciones.</li>
                <li>Enviar notificaciones importantes relacionadas con la cuenta, pagos o actualizaciones del sistema.</li>
                <li>Cumplir con obligaciones legales aplicables.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">3. Bases legales para el tratamiento</h2>
              <p>Procesamos los datos personales bajo las siguientes bases legales:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-semibold">Consentimiento</span>: otorgado al registrarse o usar nuestros servicios.</li>
                <li><span className="font-semibold">Ejecución de contrato</span>: cuando el tratamiento es necesario para ofrecer los servicios de la plataforma.</li>
                <li><span className="font-semibold">Cumplimiento legal</span>: para atender solicitudes de autoridades competentes.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">4. Comunicación con terceros</h2>
              <p>Podemos compartir información con:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proveedores de servicios tecnológicos que nos ayudan a operar la plataforma (por ejemplo, alojamiento, mensajería o procesamiento de pagos).</li>
                <li>Plataformas de comunicación de Meta (Instagram, Messenger, WhatsApp) integradas a través de Chatwoot, únicamente para la gestión de mensajes entre usuarios.</li>
                <li>Herramientas de análisis, como Google Analytics, que recopilan información anónima sobre el tráfico del sitio.</li>
              </ul>
              <p>No vendemos, alquilamos ni comercializamos los datos personales a terceros.</p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">5. Conservación de datos</h2>
              <p>
                Los datos personales se conservarán durante el tiempo necesario para cumplir con los fines indicados o mientras la cuenta del usuario permanezca activa. Los mensajes y documentos se eliminan o anonimizan cuando dejan de ser necesarios para propósitos operativos o legales.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">6. Seguridad de la información</h2>
              <p>
                Implementamos medidas técnicas y organizativas razonables para proteger la información personal contra pérdida, robo, acceso no autorizado, alteración o destrucción. Sin embargo, ningún sistema es completamente seguro, por lo que no podemos garantizar seguridad absoluta.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">7. Derechos de los usuarios</h2>
              <p>Los usuarios pueden ejercer los siguientes derechos sobre sus datos personales:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceso a sus datos.</li>
                <li>Rectificación de información inexacta.</li>
                <li>Eliminación (“derecho al olvido”) cuando sea aplicable.</li>
                <li>Retiro del consentimiento para el tratamiento.</li>
              </ul>
              <p>
                Para ejercer estos derechos, pueden comunicarse al correo{' '}
                <a href="mailto:info@yalleguesv.com" className="text-[#FF1B1C] hover:underline">info@yalleguesv.com</a>.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">8. Uso de cookies y tecnologías similares</h2>
              <p>
                Utilizamos cookies propias y de terceros para mejorar la experiencia del usuario, analizar el tráfico y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque algunas funciones del sitio podrían verse afectadas.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">9. Enlaces a sitios externos</h2>
              <p>
                Nuestro sitio puede contener enlaces a páginas o servicios de terceros. No somos responsables del contenido ni de las políticas de privacidad de dichos sitios.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">10. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Publicaremos cualquier cambio en esta misma página con la nueva fecha de actualización.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10">11. Contacto</h2>
              <p>
                Para cualquier consulta o solicitud relacionada con esta Política de Privacidad, puede escribirnos a:{' '}
                <a href="mailto:info@yalleguesv.com" className="text-[#FF1B1C] hover:underline">info@yalleguesv.com</a>
              </p>
            </section>

            <div className="mt-10">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-white bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:opacity-90 rounded-full px-5 py-2.5 shadow-lg transition">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


