# Netput

A Netflix-inspired streaming UI for discovering movies, built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** + Vite
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **Context API** (auth, My List)

## Features

- **Creative Hero Front Page** – Large featured movie poster with genre tags
- **Play Button** – Opens YouTube trailer search
- **My List / Watch Later** – Save movies to watch later (stored in localStorage)
- **Genre Sections** – Horror, Comedy, Action, Drama, Romance, Sci-Fi
- **Recently Released** – Movies from current year
- **Login Email Notification** – Backend sends login notification to user email (Resend)
- **Search** – Full-screen search with magnifying glass icon
- **Responsive** – Mobile-first, Netflix-style dark UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install --legacy-peer-deps
```

### Environment Variables

Create `.env`:

```
VITE_OMDB_API_KEY=your_omdb_api_key
RESEND_API_KEY=re_xxx          # Optional: for login email notifications
RESEND_FROM_EMAIL=you@domain.com  # Optional: sender email (requires verified domain in Resend)
```

Get OMDb key: [omdbapi.com](https://www.omdbapi.com/apikey.aspx)  
Get Resend key: [resend.com](https://resend.com) (free tier: 100 emails/day)

### Run Development

**Option A – Frontend only**
```bash
npm run dev
```

**Option B – Frontend + API (for login notifications)**
```bash
npm run dev:full
```

Open http://localhost:5173 (or 5174 if 5173 is in use).

### Build

```bash
npm run build
```

### Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add env vars: `VITE_OMDB_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
4. Deploy

Or via CLI:
```bash
npx vercel
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   ├── Layout/       # Header with pills, search, profile
│   └── Movies/       # Hero, GenreRow, MovieCard, Modal
├── context/
│   ├── AuthContext.tsx
│   └── MyListContext.tsx
├── pages/
├── routes/
├── services/
├── utils/
api/                  # Vercel serverless (login notification)
server/               # Local Express API for dev
```

## License

MIT
