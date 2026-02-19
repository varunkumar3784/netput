export function openTrailer(movieTitle: string, year?: string): void {
  const query = encodeURIComponent(`${movieTitle} ${year || ''} trailer`);
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
}
