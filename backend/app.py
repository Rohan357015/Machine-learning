import json
import os
import urllib.error
import urllib.parse
import urllib.request

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from recommender import recommend

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_env_file():
    env_path = os.path.join(BASE_DIR, ".env")

    if not os.path.exists(env_path):
        return

    with open(env_path, encoding="utf-8") as env_file:
        for line in env_file:
            line = line.strip()

            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))

load_env_file()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def tmdb_get(path: str, params: dict | None = None):
    token = os.getenv("TMDB_TOKEN")

    if not token:
        return None

    query = f"?{urllib.parse.urlencode(params)}" if params else ""
    request = urllib.request.Request(
        f"https://api.themoviedb.org/3{path}{query}",
        headers={"Authorization": f"Bearer {token}"},
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            return json.loads(response.read().decode("utf-8"))
    except (TimeoutError, urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError):
        return None

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/recommend")
def get_recommend(movie: str):
    try:
        return {"movies": recommend(movie)}
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"error": "Recommendation model failed to load or run.", "detail": str(exc)},
        )

@app.get("/movie-search")
def search_movie(title: str):
    fallback = {"id": None, "title": title, "poster": None}
    data = tmdb_get("/search/movie", {"query": title})

    if not data:
        return fallback

    movie = next(
        (item for item in data.get("results", []) if item.get("poster_path")),
        None,
    )

    if not movie:
        return fallback

    return {
        "id": movie.get("id"),
        "title": movie.get("title") or title,
        "poster": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}",
    }

@app.get("/movie/{movie_id}")
def get_movie(movie_id: int):
    data = tmdb_get(f"/movie/{movie_id}")

    if not data:
        return JSONResponse(
            status_code=503,
            content={"error": "Movie details are unavailable right now."},
        )

    return data

@app.get("/movie/{movie_id}/credits")
def get_movie_credits(movie_id: int):
    data = tmdb_get(f"/movie/{movie_id}/credits")

    if not data:
        return {"cast": [], "crew": []}

    return data
