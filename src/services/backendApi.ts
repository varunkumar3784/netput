const BASE = import.meta.env.VITE_API_URL ?? '';

export async function fetchTop10() {
  const res = await fetch(`${BASE}/api/movies/top10`);
  const data = await res.json();
  return data.movies || [];
}

export async function fetchRecommendations() {
  const res = await fetch(`${BASE}/api/movies/recommendations`);
  const data = await res.json();
  return data.movies || [];
}

export async function fetchRecent() {
  const res = await fetch(`${BASE}/api/movies/recent`);
  const data = await res.json();
  return data.movies || [];
}

export async function fetchCategory(genre: string) {
  const res = await fetch(`${BASE}/api/movies/category/${genre}`);
  const data = await res.json();
  return data.movies || [];
}

export async function fetchSeries() {
  const res = await fetch(`${BASE}/api/series`);
  const data = await res.json();
  return data.series || [];
}

export async function fetchSeriesCategory(genre: string) {
  const res = await fetch(`${BASE}/api/series/category/${genre}`);
  const data = await res.json();
  return data.series || [];
}

export async function searchMovies(query: string) {
  if (!query.trim()) return [];
  const res = await fetch(`${BASE}/api/movies/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.movies || [];
}

export async function getMovieById(id: string) {
  const res = await fetch(`${BASE}/api/movies/${id}`);
  return res.json();
}
