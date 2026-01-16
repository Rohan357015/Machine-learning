from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommend")
def get_recommend(movie: str):
    
    return {"movies": recommend(movie)}
