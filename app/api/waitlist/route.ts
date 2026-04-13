import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, category } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y correo son requeridos' },
        { status: 400 }
      )
    }

    // ── Save to Supabase ──────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .insert({ name, email, phone: phone || null, category: category || null })

    // Log DB errors but don't block the response — the email is the critical path
    if (dbError) {
      console.error('Supabase waitlist insert error:', dbError.message)
    }

    // ── Send confirmation email ───────────────────────────────────────────
    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>¡Tu $5 OFF está reservado!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Red top stripe -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#FF1B1C,#FF4444,#FF6B6B);"></td>
          </tr>

          <!-- Header / logo area -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#FF1B1C;letter-spacing:-1px;">
                Ya Llegué
              </div>
              <div style="font-size:12px;color:#9ca3af;margin-top:2px;letter-spacing:1px;text-transform:uppercase;">
                La plataforma donde contratas
              </div>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Big offer block -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:linear-gradient(135deg,#fff5f5,#fff0e0);border:1px solid #fecaca;border-radius:14px;margin-bottom:28px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <div style="font-size:72px;font-weight:900;color:#FF1B1C;line-height:1;">
                      $5
                    </div>
                    <div style="font-size:20px;font-weight:700;color:#1f2937;margin-top:4px;">
                      OFF en tu primer servicio
                    </div>
                    <div style="font-size:13px;color:#6b7280;margin-top:8px;">
                      Aplicado automáticamente cuando abramos.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 10px;">
                ¡Hola, ${name}! 🎉
              </p>
              <p style="font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 24px;">
                ¡Ya estás en la lista de espera de <strong style="color:#FF1B1C;">Ya Llegué</strong>!
                Tu descuento de <strong>$5 OFF</strong> está reservado y será aplicado
                automáticamente en tu primer servicio al lanzamiento.${category ? `<br/>Servicio de interés: <strong>${category}</strong>.` : ''}${phone ? `<br/>Teléfono registrado: <strong>${phone}</strong>.` : ''}
              </p>

              <!-- What to expect -->
              <p style="font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;
                         letter-spacing:0.5px;margin:0 0 12px;">
                ¿Qué puedes contratar?
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding:4px 8px 4px 0;font-size:14px;color:#4b5563;">
                    🔧 Fontaneros
                  </td>
                  <td width="50%" style="padding:4px 0;font-size:14px;color:#4b5563;">
                    ⚡ Electricistas
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 8px 4px 0;font-size:14px;color:#4b5563;">
                    🏗️ Albañiles
                  </td>
                  <td style="padding:4px 0;font-size:14px;color:#4b5563;">
                    🌿 Jardineros
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 8px 4px 0;font-size:14px;color:#4b5563;">
                    💄 Maquillistas
                  </td>
                  <td style="padding:4px 0;font-size:14px;color:#4b5563;">
                    📺 Electrodomésticos
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="https://yalleguesv.com/waitlist"
                       style="display:inline-block;background:linear-gradient(90deg,#FF1B1C,#FF4444);
                              color:#ffffff;text-decoration:none;padding:14px 36px;
                              border-radius:50px;font-weight:700;font-size:15px;
                              box-shadow:0 4px 14px rgba(255,27,28,0.35);">
                      Ver mis beneficios
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#9ca3af;text-align:center;line-height:1.6;margin:0;">
                Te avisaremos por este correo cuando estemos listos.<br/>
                Sin spam, prometido.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="font-size:12px;color:#9ca3af;margin:0 0 6px;">
                Ya Llegué — Tu ayuda confiable, cuando y donde la necesites.
              </p>
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                ¿Preguntas?
                <a href="mailto:info@yalleguesv.com"
                   style="color:#FF1B1C;text-decoration:none;">info@yalleguesv.com</a>
                &nbsp;·&nbsp;
                <a href="https://wa.me/50361780439"
                   style="color:#FF1B1C;text-decoration:none;">WhatsApp: 6178-0439</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    let emailResponse = await resend.emails.send({
      from: 'Ya Llegué <noreply@yalleguesv.com>',
      to: [email],
      subject: '¡Tu $5 OFF está reservado! 🎉 — Ya Llegué',
      html: emailHtml,
    })

    // Fallback to Resend default domain if custom domain not yet verified
    if (emailResponse.error?.message?.includes('domain is not verified')) {
      emailResponse = await resend.emails.send({
        from: 'Ya Llegué <onboarding@resend.dev>',
        to: [email],
        subject: '¡Tu $5 OFF está reservado! 🎉 — Ya Llegué',
        html: emailHtml,
      })
    }

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error)
      return NextResponse.json(
        { error: `Error al enviar el correo: ${emailResponse.error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
