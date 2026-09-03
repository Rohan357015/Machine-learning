import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Film, Play, Star } from "lucide-react";

function MovieInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  useEffect(() => {
    async function loadMovie() {
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`${apiUrl}/movie/${id}`),
          fetch(`${apiUrl}/movie/${id}/credits`),
        ]);

        if (!movieRes.ok) {
          throw new Error("Movie details unavailable.");
        }

        setMovie(await movieRes.json());
        setCredits(creditsRes.ok ? await creditsRes.json() : { cast: [], crew: [] });
      } catch {
        setErrorMessage("Movie details are unavailable right now.");
      }
    }

    loadMovie();
  }, [apiUrl, id]);

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <p className="mb-6 text-red-400">{errorMessage}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full border border-red-500 px-6 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return <div className="min-h-screen bg-black text-white">Loading...</div>;
  }

  const director = credits?.crew?.find((person) => person.job === "Director");
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";
  const runtime = Number(movie.runtime) || 0;

  return (
    <div className="bg-black text-white">
      <div
        className="relative h-[70vh] w-full bg-neutral-950 bg-cover bg-center"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 z-20 flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="absolute bottom-16 left-8 right-8 z-20 max-w-3xl md:left-[45rem]">
          <h1 className="mb-4 text-4xl font-extrabold md:text-6xl">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
            <span className="flex items-center gap-1">
              <Star className="text-red-500" size={18} />
              <span className="font-semibold">
                {Number(movie.vote_average || 0).toFixed(1)}
              </span>
              /10
            </span>

            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {movie.release_date?.slice(0, 4) || "Year unavailable"}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={16} />
              {runtime
                ? `${Math.floor(runtime / 60)}h ${runtime % 60}min`
                : "Runtime unavailable"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-30 -mt-10 px-8 pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
          <div className="relative bottom-[12rem] overflow-hidden rounded-2xl shadow-2xl">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-neutral-900 text-gray-400">
                No poster available
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="mb-6 flex flex-wrap gap-3">
              {(movie.genres || []).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-red-500/30 bg-red-600/20 px-4 py-1 text-sm text-red-400"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h2 className="mb-2 text-xl font-semibold">Overview</h2>
            <p className="mb-8 max-w-3xl leading-relaxed text-gray-300">
              {movie.overview || "No overview available."}
            </p>

            {director && (
              <div className="mb-6">
                <h3 className="mb-1 flex items-center gap-2 font-semibold">
                  <Film className="text-red-500" size={18} />
                  Director
                </h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}

            {credits?.cast && (
              <div className="mb-10">
                <h3 className="mb-3 font-semibold">Top Cast</h3>
                <div className="flex flex-wrap gap-3">
                  {credits.cast.slice(0, 6).map((actor) => (
                    <span
                      key={actor.id}
                      className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200"
                    >
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 font-semibold transition hover:bg-red-700">
                <Play size={18} fill="currentColor" />
                Watch Now
              </button>

              <button className="rounded-full border border-red-500 px-8 py-3 font-semibold text-red-400 transition hover:bg-red-500/10">
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
