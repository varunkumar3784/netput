const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function sendLoginNotification(email: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/api/login-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send notification');
    }
  } catch (err) {
    console.warn('Login notification failed:', err);
    throw err;
  }
}
