import { useState } from "react";
import { Film, LoaderCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroPage() {
  const [movieInput, setMovieInput] = useState("");
  const [movieCards, setMovieCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const apiUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  const handleRecommend = async () => {
    const searchTerm = movieInput.trim();

    if (!searchTerm) {
      setMovieCards([]);
      setErrorMessage("Please enter a movie name.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setMovieCards([]);

    try {
      const res = await fetch(
        `${apiUrl}/recommend?movie=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        throw new Error("Recommendation server failed.");
      }

      const data = await res.json();
      const recommendedMovies = data.movies || [];

      if (
        recommendedMovies.length === 0 ||
        recommendedMovies.includes("Movie not found")
      ) {
        setErrorMessage("Movie not found. Try another title.");
        return;
      }

      const results = await Promise.all(
        recommendedMovies.map(async (title) => {
          try {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`,
              {
                headers: {
                  Authorization: "Bearer " + import.meta.env.VITE_TMDB_TOKEN,
                },
              }
            );

            if (!tmdbRes.ok) return null;

            const tmdbData = await tmdbRes.json();
            const movie = tmdbData.results?.[0];

            if (!movie || !movie.poster_path) return null;

            return {
              id: movie.id,
              title: movie.title,
              poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
            };
          } catch {
            return null;
          }
        })
      );

      const validResults = results.filter(Boolean);

      if (validResults.length === 0) {
        setErrorMessage("Recommendations found, but movie posters could not be loaded.");
        return;
      }

      setMovieCards(validResults);
    } catch {
      setErrorMessage("Something went wrong. Please check the backend and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white px-6">
      <div className="text-center pt-14">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          <span className="text-red-500">Movie</span> Recommendation
        </h1>
        <p className="text-gray-400 mt-3">
          Get movie suggestions based on what you like
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="flex items-center bg-neutral-800 rounded-full w-full max-w-2xl shadow-lg">
          <div className="pl-4 text-gray-400">
            <Search size={20} />
          </div>

          <input
            value={movieInput}
            onChange={(e) => setMovieInput(e.target.value)}
            placeholder="Search a movie..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-white"
            disabled={isLoading}
          />

          <button
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-gray-300 disabled:cursor-not-allowed transition px-6 py-3 rounded-full font-semibold flex items-center gap-2"
            onClick={handleRecommend}
            disabled={isLoading}
          >
            {isLoading && <LoaderCircle size={18} className="animate-spin" />}
            {isLoading ? "Loading..." : "Recommend"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-center text-red-400 mt-6 font-medium">
          {errorMessage}
        </p>
      )}

      {!isLoading && movieCards.length > 0 && (
        <h2 className="text-center text-xl mt-12 text-gray-300">
          Recommendations for{" "}
          <span className="text-red-500 font-semibold">
            "{movieInput.toUpperCase()}"
          </span>
        </h2>
      )}

      {isLoading && (
        <div className="mt-24 flex flex-col items-center justify-center text-center text-gray-300">
          <LoaderCircle size={44} className="animate-spin text-red-500" />
          <p className="mt-4 text-sm">Finding recommendations...</p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
        {movieCards.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => handleSelectMovie(movie.id)}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover object-top"
            />

            <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold">
              {movie.title}
            </p>
          </div>
        ))}
      </div>

      {!isLoading && !errorMessage && movieCards.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner">
            <Film size={34} className="text-gray-400" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            Ready to discover movies?
          </h2>

          <p className="mt-3 max-w-md text-gray-400 text-sm leading-relaxed">
            Enter a movie you love and we'll find similar ones you might enjoy
          </p>
        </div>
      )}
    </div>
  );
}

export default HeroPage;
