import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "movies.pkl", "rb") as movies_file:
    movies = pickle.load(movies_file)

with open(BASE_DIR / "similarity.pkl", "rb") as similarity_file:
    similarity = pickle.load(similarity_file)

def recommend(movie):
    movie = movie.strip().lower()

    # Case-insensitive + safe matching
    matches = movies[movies['title'].str.lower().str.strip() == movie]

    if matches.empty:
        return ["Movie not found"]

    index = matches.index[0]
    distances = similarity[index]

    movie_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:10]

    return [movies.iloc[i[0]].title for i in movie_list]

