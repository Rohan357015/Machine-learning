from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/recommend")
def get_recommend(movie: str):
    return {"movies": recommend(movie)}
