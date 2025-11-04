'use client'

import { useState } from 'react'

export default function EmailPreviewPage() {
  const [name, setName] = useState('Juan Pérez')

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Perfil Aprobado - Ya Llegué</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #FF1B1C; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <!-- Title -->
            <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0 0 20px 0; line-height: 1.2;">
              🎉 ¡Tu perfil ha sido aprobado!
            </h1>
            
            <!-- Message -->
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Hola ${name},
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              ¡Buenas noticias! 🎉
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Tu perfil ha sido <strong>aprobado exitosamente</strong>.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Muy pronto, cuando la plataforma esté activa, podrás comenzar a <strong>ofrecer tus servicios</strong> y <strong>generar ingresos extra</strong> conectando con clientes que necesitan justo lo que tú sabes hacer.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Queremos agradecerte por confiar en nosotros y por formar parte de esta comunidad de profesionales que hacen la diferencia.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Te avisaremos en cuanto la plataforma esté disponible para que puedas completar los últimos pasos y empezar a recibir solicitudes de trabajo.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 30px 0; text-align: left;">
              Un saludo,
            </p>
            
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 0 0; text-align: left; font-weight: bold;">
              El equipo de Ya Llegué!
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #F8F8F8; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5;">
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0 0 15px 0;">
              Ya Llegué! El Salvador<br>
              Ya Llegué! es operado por profesionales salvadoreños comprometidos con el desarrollo local.
            </p>
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0 0 15px 0;">
              Este es un email transaccional, no es necesario responder.
              Si necesitas ayuda, contacta a nuestro equipo de soporte a través de:
              <a href="mailto:info@yalleguesv.com" style="color: #FF1B1C; text-decoration: underline;">info@yalleguesv.com</a>
              o a nuestro número de WhatsApp: <a href="https://wa.me/50361780439" style="color: #FF1B1C; text-decoration: underline;">+503 6178-0439</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Preview</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter test name"
            />
          </div>
          <p className="text-sm text-gray-600">
            This shows exactly how the email will look when sent to users.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
        </div>
      </div>
    </div>
  )
}
