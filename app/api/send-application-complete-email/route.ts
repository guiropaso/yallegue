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
      <title>Solicitud Completada - Ya Llegué</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #FF1B1C; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <!-- Title -->
            <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0 0 20px 0; line-height: 1.2;">
              ¡Gracias por completar tu solicitud! 🎉
            </h1>
            
            <!-- Message -->
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Hola ${name},
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Queremos agradecerte por completar tu solicitud de registro como proveedor en Ya Llegué. Hemos recibido todos tus documentos y tu información ha sido registrada exitosamente.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Nuestro equipo está revisando tu solicitud y documentos. Te contactaremos pronto con más información sobre el estado de tu aprobación y próximos pasos.
            </p>
            
            <!-- Highlighted Text -->
            <p style="font-size: 18px; color: #FF1B1C; line-height: 1.6; margin: 0 0 30px 0; font-weight: bold; text-align: center;">
              Por favor, espera nuestra notificación de aprobación.
            </p>
            
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
              Mientras tanto, si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
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
  `;

    // Try with custom domain first, fallback to Resend default if not verified
    let emailResponse = await resend.emails.send({
      from: 'Ya Llegué <noreply@yalleguesv.com>',
      to: [email],
      subject: 'Solicitud Completada - Ya Llegué ✅',
      html: emailHtml,
    });

    // If custom domain fails, try with Resend default domain
    if (emailResponse.error && emailResponse.error.message.includes('domain is not verified')) {
      console.log('Custom domain not ready, using Resend default domain');
      emailResponse = await resend.emails.send({
        from: 'Ya Llegué <onboarding@resend.dev>',
        to: [email],
        subject: 'Solicitud Completada - Ya Llegué ✅',
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

