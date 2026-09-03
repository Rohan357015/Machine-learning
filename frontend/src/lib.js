export async function getMoviePoster(title) {
  const apiUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  try {
    const response = await fetch(
      `${apiUrl}/movie-search?title=${encodeURIComponent(title)}`
    );

    if (!response.ok) return null;

    const movie = await response.json();
    return movie.poster;
  } catch {
    return null;
  }
}
