import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend

frontend_urls = [
    url.strip()
    for url in os.getenv("FRONTEND_URLS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if url.strip()
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/recommend")
def get_recommend(movie: str):
    return {"movies": recommend(movie)}
