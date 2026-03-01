/**
 * Netput Backend API
 * - Login notifications
 * - Movies: top10, recommendations, categories
 */
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Attractive Root Page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Netput API | Production</title>
        <style>
          body { background: #000; color: #E50914; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { text-align: center; padding: 40px; border: 2px solid #E50914; border-radius: 20px; box-shadow: 0 0 30px rgba(229, 9, 20, 0.4); }
          h1 { font-size: 3rem; margin: 0; font-weight: 900; letter-spacing: -2px; }
          p { color: #888; margin-top: 10px; font-size: 1.1rem; }
          .status { display: inline-block; margin-top: 20px; padding: 5px 15px; background: #E50914; color: white; border-radius: 5px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>NETPUT API</h1>
          <p>The core engine of your streaming experience</p>
          <div class="status">SYSTEM ONLINE</div>
        </div>
      </body>
    </html>
  `);
});

const OMDB_API = 'https://www.omdbapi.com';
const API_KEY = process.env.VITE_OMDB_API_KEY || 'ce875263';

async function omdbFetch(params) {
  const url = new URL(OMDB_API);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

// Top 10 Movies in Netput Today
app.get('/api/movies/top10', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const data = await omdbFetch({ s: 'movie', y: String(year), page: 1 });
    const movies = data.Response === 'True' && data.Search ? data.Search.slice(0, 10) : [];
    res.json({ movies });
  } catch (err) {
    console.error('top10:', err);
    res.status(500).json({ movies: [] });
  }
});

// We Think You'll Love These (recommendations)
app.get('/api/movies/recommendations', async (req, res) => {
  try {
    const data = await omdbFetch({ s: 'action', type: 'movie', page: 1 });
    const movies = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ movies });
  } catch (err) {
    console.error('recommendations:', err);
    res.status(500).json({ movies: [] });
  }
});

// Recently released
app.get('/api/movies/recent', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const data = await omdbFetch({ s: 'movie', y: String(year), page: 1 });
    const movies = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ movies });
  } catch (err) {
    console.error('recent:', err);
    res.status(500).json({ movies: [] });
  }
});

// Category: genre
app.get('/api/movies/category/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const data = await omdbFetch({ s: genre, type: 'movie', page: 1 });
    const movies = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ movies });
  } catch (err) {
    console.error('category:', err);
    res.status(500).json({ movies: [] });
  }
});

// Search
app.get('/api/movies/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ movies: [] });
    const data = await omdbFetch({ s: String(q), page: 1 });
    const movies = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ movies });
  } catch (err) {
    console.error('search:', err);
    res.status(500).json({ movies: [] });
  }
});

// Movie detail
app.get('/api/movies/:id', async (req, res) => {
  try {
    const data = await omdbFetch({ i: req.params.id, plot: 'full' });
    res.json(data);
  } catch (err) {
    console.error('movie detail:', err);
    res.status(500).json({});
  }
});

// Get TV series
app.get('/api/series', async (req, res) => {
  try {
    const data = await omdbFetch({ s: 'series', type: 'series', page: 1 });
    const series = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ series });
  } catch (err) {
    console.error('series:', err);
    res.status(500).json({ series: [] });
  }
});

// Category: series genre
app.get('/api/series/category/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const data = await omdbFetch({ s: genre, type: 'series', page: 1 });
    const series = data.Response === 'True' && data.Search ? data.Search : [];
    res.json({ series });
  } catch (err) {
    console.error('series category:', err);
    res.status(500).json({ series: [] });
  }
});

// Login notification
app.post('/api/login-notification', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Netput <onboarding@resend.dev>';
    if (!apiKey) {
      console.log('[DEV] Login notification for:', email);
      return res.json({ success: true, message: 'Dev mode - email not sent' });
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Netput - Login Notification',
        html: `<div style="font-family: Arial;"><h2 style="color: #E50914;">Netput</h2><p>You have successfully logged in.</p><p>Time: ${new Date().toLocaleString()}</p></div>`,
      }),
    });
    if (!response.ok) throw new Error('Failed to send email');
    res.json({ success: true });
  } catch (error) {
    console.error('Login notification:', error);
    res.status(500).json({ message: error.message });
  }
});

// Popular movie IDs for random selection
const POPULAR_IDS = [
  'tt1375666', 'tt0468569', 'tt0137523', 'tt0111161', 'tt0109830',
  'tt0133093', 'tt0068646', 'tt0076759', 'tt0816692', 'tt1345836'
];

// Get random movie
app.get('/api/movies/random', async (req, res) => {
  try {
    const randomId = POPULAR_IDS[Math.floor(Math.random() * POPULAR_IDS.length)];
    const data = await omdbFetch({ i: randomId, plot: 'short' });
    res.json(data);
  } catch (err) {
    console.error('random:', err);
    res.status(500).json({});
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\x1b[31m%s\x1b[0m', '  _  _  ___ _____ ___ _   _ _____ ');
  console.log('\x1b[31m%s\x1b[0m', ' | \\| || __|_   _| _ \\ | | |_   _|');
  console.log('\x1b[31m%s\x1b[0m', ' | .  || _|  | | |  _/ |_| | | |  ');
  console.log('\x1b[31m%s\x1b[0m', ' |_|\\_||___| |_| |_|  \\___/  |_|  ');
  console.log('\x1b[32m%s\x1b[0m', `\n [✔] Netput Backend Engine LIVE | Port ${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', ` [➜] Interactive Mode: ON\n`);
});
