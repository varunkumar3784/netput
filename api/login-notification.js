/**
 * Vercel Serverless Function - Send login notification email
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL env vars for production
 * Get free API key at https://resend.com
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Netput <onboarding@resend.dev>';

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured - skipping email send');
      return res.status(200).json({
        success: true,
        message: 'Login notification (email service not configured)',
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Netput - Login Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E50914;">Netput</h2>
            <p>You have successfully logged in to your Netput account.</p>
            <p><strong>Login time:</strong> ${new Date().toLocaleString()}</p>
            <p>If you did not perform this action, please secure your account immediately.</p>
            <hr style="border: none; border-top: 1px solid #333;" />
            <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Netput. All rights reserved.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send email');
    }

    return res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Login notification error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to send login notification',
    });
  }
}
