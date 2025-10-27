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
      <title>Bienvenido a Ya Llegué</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #FF1B1C; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <!-- Welcome Icon -->
            <div style="width: 80px; height: 80px; background-color: #FFA500; border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
              🚀
            </div>
            
            <!-- Title -->
            <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0 0 20px 0; line-height: 1.2;">
              ¡Hola ${name}! 👋<br>¡Bienvenido a Ya Llegué!
            </h1>
            
            <!-- Message -->
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 30px 0;">
              Dónde podrás generar dinero extra con tu oficio.<br><br>
              Hemos recibido tu registro, para continuar con tu aprobación en la plataforma ayúdanos llenando el siguiente formulario:
            </p>
            
            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
              <tr>
                <td align="center">
                  <a href="https://yalleguesv.com/providers/register" style="display: inline-block; background-color: #FF1B1C; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                    Completar Registro
                  </a>
                </td>
              </tr>
            </table>
            
            <!-- Highlighted Text -->
            <p style="font-size: 16px; color: #FF1B1C; line-height: 1.6; margin: 20px 0 0 0; font-weight: bold;">
              Este llenado es vital para empezar a trabajar con Ya Llegué!
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #F8F8F8; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5;">
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0 0 15px 0;">
              Copyright ©2025 Ya Llegué El Salvador<br>
              Ya Llegué es operado por profesionales salvadoreños comprometidos con el desarrollo local.
            </p>
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0 0 15px 0;">
              Estás recibiendo este email porque te registraste en nuestro sitio web. 
              Puedes darte de baja enviando un email a 
              <a href="mailto:info@yalleguesv.com" style="color: #FF1B1C; text-decoration: underline;">info@yalleguesv.com</a>
            </p>
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0;">
              <a href="#" style="color: #FF1B1C; text-decoration: underline;">Nuestra Política de Privacidad</a>
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
