import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Get user emails from auth.users table using admin client
    console.log('Service role key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: usersError.message },
        { status: 500 }
      );
    }

    // Filter users with valid emails and matching IDs
    const userEmails = (users?.users || [])
      .filter(user => ids.includes(user.id) && user.email)
      .map(user => ({
        id: user.id,
        email: user.email!
      }));

    if (userEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid users found with the provided IDs' },
        { status: 404 }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Registro - Ya Llegué</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #FF1B1C; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <!-- Reminder Icon -->
              <div style="width: 80px; height: 80px; background-color: #FFA500; border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                😥
              </div>
              
              <!-- Title -->
              <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0 0 20px 0; line-height: 1.2;">
                Hola 👋
              </h1>
              
              <!-- Message -->
              <p style="font-size: 16px; color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                hemos revisado y aún te falta documentación por subir en el formulario de registro para proveedores.
              </p>
              
              <!-- Highlighted Text -->
              <p style="font-size: 18px; color: #FF1B1C; line-height: 1.6; margin: 0 0 30px 0; font-weight: bold;">
                🔶El llenado de este formulario es vital para que empieces a generar dinero con Ya Llegué!
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

    const results = [];
    const successfulIds = [];

    // Send emails to each user
    for (const user of userEmails) {
      try {
        // Try with custom domain first, fallback to Resend default if not verified
        let emailResponse = await resend.emails.send({
          from: 'Ya Llegué <noreply@yalleguesv.com>',
          to: [user.email],
          subject: 'Recordatorio: Completa tu registro en Ya Llegué 📋',
          html: emailHtml,
        });

        // If custom domain fails, try with Resend default domain
        if (emailResponse.error && emailResponse.error.message.includes('domain is not verified')) {
          console.log('Custom domain not ready, using Resend default domain');
          emailResponse = await resend.emails.send({
            from: 'Ya Llegué <onboarding@resend.dev>',
            to: [user.email],
            subject: 'Recordatorio: Completa tu registro en Ya Llegué 📋',
            html: emailHtml,
          });
        }

        const { data, error } = emailResponse;

        if (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          results.push({
            id: user.id,
            email: user.email,
            success: false,
            error: error.message || 'Unknown error'
          });
        } else {
          console.log(`Successfully sent reminder email to ${user.email}`);
          results.push({
            id: user.id,
            email: user.email,
            success: true,
            messageId: data?.id
          });
          successfulIds.push(user.id);
        }
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
        results.push({
          id: user.id,
          email: user.email,
          success: false,
          error: 'Internal error'
        });
      }
    }

    // Update first_reminder_email_sent column for successfully sent emails
    if (successfulIds.length > 0) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('providers')
          .update({ first_reminder_email_sent: new Date().toISOString() })
          .in('id', successfulIds);

        if (updateError) {
          console.error('Error updating reminder timestamps:', updateError);
          // Don't fail the entire request, just log the error
        } else {
          console.log(`Updated reminder timestamps for ${successfulIds.length} providers`);
        }
      } catch (error) {
        console.error('Error updating reminder timestamps:', error);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: userEmails.length,
        successful: successfulIds.length,
        failed: userEmails.length - successfulIds.length
      },
      note: 'Using real auth.users data from Supabase'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}