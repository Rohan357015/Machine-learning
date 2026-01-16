import axios from "axios";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// 1️⃣ Search movie by title → get poster
export async function getMoviePoster(title) {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query: title,
        },
        headers: {
          Authorization: "Bearer " + TMDB_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.results;
    // console.log(results);

    if (!results || results.length === 0) return null;

    const posterPath = results[0].poster_path;

    if (!posterPath) return null;

    return "https://image.tmdb.org/t/p/w500" + posterPath;
  } catch (error) {
    console.error("TMDB poster fetch failed:", error);
    return null;
  }
}
