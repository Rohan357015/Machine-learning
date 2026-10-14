# Movie Recommender API

FastAPI service for movie recommendations and TMDB-backed movie details. The Render Blueprint is in the repository root at `render.yaml`.

## Deploy to Render

1. Push the repository to GitHub, GitLab, or another Git provider supported by Render. Confirm `backend/movies.pkl` and `backend/similarity.pkl` are included; the recommendation endpoint requires both files.
2. Sign in to [Render](https://render.com/) and choose **New +** > **Blueprint**.
3. Connect the repository and select the branch to deploy. Render will detect the root `render.yaml` and create the `movie-recommender-api` web service.
4. Confirm the service settings use the `backend` root directory, Python 3.12 from `backend/.python-version`, `pip install -r requirements.txt` build command, and `uvicorn app:app --host 0.0.0.0 --port $PORT` start command. These are already defined in the Blueprint and repository configuration.
5. In the service's **Environment** settings, set `FRONTEND_URLS` to the deployed frontend origin, for example `https://your-frontend.onrender.com`. For multiple frontends, enter comma-separated origins with no trailing slash. Keep `http://localhost:5173` in the list if you also want local frontend development to call the deployed API.
6. Set `TMDB_TOKEN` to your TMDB API Read Access Token if you want movie search and details to use TMDB. This is optional; recommendations do not use TMDB. Store it only in Render's environment settings, never in source control.
7. Save the environment changes and wait for the build and deploy to finish.
8. Open `https://<your-render-service>.onrender.com/`. A healthy service responds with `{"status":"ok"}`. You can test recommendations at `/recommend?movie=Avatar`.

## Connect the Frontend

Deploy the frontend separately. Set its build-time environment variable `VITE_API_URL` to the backend service URL, for example `https://movie-recommender-api.onrender.com`, then rebuild and redeploy the frontend. Do not include a trailing slash. The backend CORS allowlist must include the frontend's exact origin in `FRONTEND_URLS`.

## Run Locally

From the repository root:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

The API is available at `http://127.0.0.1:8000`. Set `TMDB_TOKEN` and `FRONTEND_URLS` in the environment or in `backend/.env` when needed. `backend/.env` is for local use only and should not be committed.
