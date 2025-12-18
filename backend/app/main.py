from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import analysis

app = FastAPI(
    title="CTG Heart Failure Monitoring API",
    description="API for processing and analyzing Cardiotocography data.",
    version="1.0.0",
)

# --- Middleware ---
# Setup CORS to allow requests from the frontend
origins = [
    "http://localhost:5173",  # Default Vite dev server address
    "http://localhost:3000",  # Common alternative for React dev
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
# Include the router for data analysis endpoints
app.include_router(analysis.router)


# --- Root Endpoint ---
@app.get("/", tags=["Root"])
async def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"message": "Welcome to the CTG Analysis API!"}

