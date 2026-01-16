import pickle

movies = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

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

