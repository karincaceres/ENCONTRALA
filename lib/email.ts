import nodemailer from 'nodemailer'
import { Jugada, WinningPosition } from './types'

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user) {
    throw new Error('GMAIL_USER no está configurado')
  }

  if (!pass) {
    throw new Error('GMAIL_APP_PASSWORD no está configurado')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

const FROM_EMAIL =
  process.env.FROM_EMAIL || process.env.GMAIL_USER || 'tuemail@gmail.com'

interface SendJugadaConfirmationParams {
  to: string
  jugada: Jugada
}

export async function sendJugadaConfirmationEmail({
  to,
  jugada,
}: SendJugadaConfirmationParams) {
  const transporter = getTransporter()

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Tu jugada fue registrada - ${jugada.prizeName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background-color: #E53935; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                      ENCONTRALA
                    </h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                      River Plate
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #8BC34A; font-size: 24px; text-align: center;">
                      TU JUGADA FUE REGISTRADA
                    </h2>

                    <p style="margin: 0 0 30px; color: #cccccc; font-size: 16px; line-height: 1.6; text-align: center;">
                      Tu jugada para el premio <strong style="color: white;">${jugada.prizeName}</strong> fue guardada exitosamente.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #222; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="margin: 0 0 10px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            Tu posición elegida
                          </p>
                          <p style="margin: 0; color: #8BC34A; font-size: 28px; font-weight: bold;">
                            X: ${jugada.positionX.toFixed(1)}% &nbsp; Y: ${jugada.positionY.toFixed(1)}%
                          </p>
                        </td>
                      </tr>
                    </table>

                    ${jugada.imageUrl ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td style="text-align: center;">
                          <img src="${jugada.imageUrl}" alt="Tu jugada" style="max-width: 100%; border-radius: 8px; border: 2px solid #333;">
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <p style="margin: 0; color: #888; font-size: 14px; text-align: center; line-height: 1.6;">
                      Te notificaremos cuando se defina la posición ganadora del video/replay oficial.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #111; padding: 20px 30px; text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      ENCONTRALA - River Plate &copy; ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })

  return info
}

interface SendWinnerNotificationParams {
  to: string
  jugada: Jugada
  winningPosition: WinningPosition
}

export async function sendWinnerNotificationEmail({
  to,
  jugada,
  winningPosition,
}: SendWinnerNotificationParams) {
  const transporter = getTransporter()

  const distance = Math.sqrt(
    Math.pow(jugada.positionX - winningPosition.positionX, 2) +
      Math.pow(jugada.positionY - winningPosition.positionY, 2)
  )

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `FELICITACIONES! Ganaste - ${jugada.prizeName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background-color: #8BC34A; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0a0a; font-size: 36px; font-weight: bold; letter-spacing: 2px;">
                      GANASTE!
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: white; font-size: 24px; text-align: center;">
                      ${jugada.prizeName}
                    </h2>

                    <p style="margin: 0 0 30px; color: #cccccc; font-size: 16px; line-height: 1.6; text-align: center;">
                      Tu jugada coincidió con la posición del video/replay oficial. FELICITACIONES!
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #222; border-radius: 8px; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 20px; text-align: center; border-bottom: 1px solid #333;">
                          <p style="margin: 0 0 5px; color: #888; font-size: 12px; text-transform: uppercase;">
                            Tu posición
                          </p>
                          <p style="margin: 0; color: #8BC34A; font-size: 20px; font-weight: bold;">
                            X: ${jugada.positionX.toFixed(1)}% Y: ${jugada.positionY.toFixed(1)}%
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="margin: 0 0 5px; color: #888; font-size: 12px; text-transform: uppercase;">
                            Posición ganadora
                          </p>
                          <p style="margin: 0; color: #E53935; font-size: 20px; font-weight: bold;">
                            X: ${winningPosition.positionX.toFixed(1)}% Y: ${winningPosition.positionY.toFixed(1)}%
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 30px; color: #8BC34A; font-size: 14px; text-align: center;">
                      Distancia: ${distance.toFixed(2)}% (tolerancia: ${winningPosition.tolerance}%)
                    </p>

                    ${winningPosition.videoUrl ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td style="text-align: center;">
                          <a href="${winningPosition.videoUrl}" style="display: inline-block; background-color: #E53935; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            VER JUGADA OFICIAL
                          </a>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <p style="margin: 0; color: #888; font-size: 14px; text-align: center; line-height: 1.6;">
                      Nos pondremos en contacto contigo para coordinar la entrega del premio.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #111; padding: 20px 30px; text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      ENCONTRALA - River Plate &copy; ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })

  return info
}
