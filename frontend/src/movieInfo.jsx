import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Clock, Calendar, Film } from "lucide-react";

function MovieInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_TMDB_TOKEN,
      },
    })
      .then(res => res.json())
      .then(setMovie);

    fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_TMDB_TOKEN,
      },
    })
      .then(res => res.json())
      .then(setCredits);
  }, [id]);

  if (!movie) return <div className="min-h-screen bg-black text-white">Loading...</div>;

  const director = credits?.crew?.find(p => p.job === "Director");

  return (
    <div className="bg-black text-white">

      {/* ================= COVER / HERO SECTION ================= */}
      <div
        className="relative h-[70vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 text-gray-300 hover:text-white"
        >
          ← Back
        </button>

        {/* Title on cover */}
        <div className="absolute bottom-16 left-[45rem] z-20 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm">
            <span className="flex items-center gap-1">
              <Star className="text-red-500" size={18} />
              <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>/10
            </span>

            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {movie.release_date?.slice(0, 4)}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={16} />
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
            </span>
          </div>
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="relative z-30 -mt-10 px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Poster */}
          <div className="rounded-2xl relative bottom-[12rem] overflow-hidden shadow-2xl">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">

            {/* Genres */}
            <div className="flex flex-wrap gap-3 mb-6">
              {movie.genres.map(g => (
                <span
                  key={g.id}
                  className="px-4 py-1 rounded-full text-sm bg-red-600/20 text-red-400 border border-red-500/30"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold mb-1">
                  <Film className="text-red-500" size={18} />
                  Director
                </h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}

            {/* Cast */}
            {credits?.cast && (
              <div className="mb-10">
                <h3 className="font-semibold mb-3">Top Cast</h3>
                <div className="flex flex-wrap gap-3">
                  {credits.cast.slice(0, 6).map(actor => (
                    <span
                      key={actor.id}
                      className="px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-200"
                    >
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-full font-semibold">
                ▶ Watch Now
              </button>

              <button className="border border-red-500 text-red-400 hover:bg-red-500/10 transition px-8 py-3 rounded-full font-semibold">
                + Add to Watchlist
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
