from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    try:
        return {"movies": recommend(movie)}
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"error": "Recommendation model failed to load or run.", "detail": str(exc)},
        )
