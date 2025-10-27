import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }


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
    `;

    // Try with custom domain first, fallback to Resend default if not verified
    let emailResponse = await resend.emails.send({
      from: 'Ya Llegué <noreply@yalleguesv.com>',
      to: [email],
      subject: 'Bienvenido a Ya Llegué 🚀',
      html: emailHtml,
    });

    // If custom domain fails, try with Resend default domain
    if (emailResponse.error && emailResponse.error.message.includes('domain is not verified')) {
      console.log('Custom domain not ready, using Resend default domain');
      emailResponse = await resend.emails.send({
        from: 'Ya Llegué <onboarding@resend.dev>',
        to: [email],
        subject: 'Bienvenido a Ya Llegué 🚀',
        html: emailHtml,
      });
    }

    const { data, error } = emailResponse;

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
