import { useState } from "react";
import { Search } from "lucide-react";
import { getMoviePoster } from "./lib.js";

import { useNavigate } from "react-router-dom";

function HeroPage() {
  const [movieInput, setMovieInput] = useState("");
  const [movieCards, setMovieCards] = useState([]);

  const navigate = useNavigate();

  const handleRecommend = async () => {
  const res = await fetch(
    `http://127.0.0.1:8000/recommend?movie=${movieInput}`
  );
  const data = await res.json();

  const results = await Promise.all(
    data.movies.map(async (title) => {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${title}`,
        {
          headers: {
            Authorization: "Bearer " + import.meta.env.VITE_TMDB_TOKEN,
          },
        }
      );

      const tmdbData = await tmdbRes.json();
      const movie = tmdbData.results[0];

      return {
        id: movie.id,
        title: movie.title,
        poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
      };
    })
  );

  setMovieCards(results);
};

  const handleSelectMovie = (movieId) => {
  navigate(`/movie/${movieId}`);
};

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white px-6">

      {/* Header */}
      <div className="text-center pt-14">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          🎬 <span className="text-red-500">Movie</span> Recommendation
        </h1>
        <p className="text-gray-400 mt-3">
          Get movie suggestions based on what you like
        </p>
      </div>

      {/* Search Bar */}
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
          />

          <button
            className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-full font-semibold"
            onClick={handleRecommend}
          >
            ✨ Recommend
          </button>
        </div>
      </div>

      {/* Recommendation Title */}
      {movieCards.length > 0 && (
        <h2 className="text-center text-xl mt-12 text-gray-300">
          Recommendations for{" "}
          <span className="text-red-500 font-semibold">
            "{movieInput.toUpperCase()}"
          </span>
        </h2>
      )}

      {/* Movie Cards */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
        {movieCards.map((movie, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer
                       hover:scale-105 transition-transform duration-300"
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

      {/* Empty State */}
      {movieCards.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner">
            <span className="text-3xl text-gray-400">🍿</span>
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
