from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from database.connection import Base, engine

# =========================
# IMPORT MODELS
# =========================
from models.team_model import Team
from models.player_model import Player
from models.user_model import User
from models.match_model import Match
from models.formation_model import Formation

# =========================
# IMPORT ROUTERS
# =========================
from routes.team_routes import (
    router as team_router
)

from routes.player_routes import (
    router as player_router
)

from routes.user_routes import (
    router as user_router
)

from routes.match_routes import (
    router as match_router
)

from routes.formation_routes import (
    router as formation_router
)

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# FASTAPI
# =========================
app = FastAPI(
    title="Football Manager API",
    version="1.0.0"
)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================
# STATIC FILES
# =========================
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# =========================
# ROUTES
# =========================
app.include_router(team_router)

app.include_router(player_router)

app.include_router(user_router)

app.include_router(match_router)

app.include_router(formation_router)

# =========================
# ROOT
# =========================
@app.get("/")
def root():

    return {
        "message": "Backend funcionando correctamente"
    }

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():

    return {
        "status": "ok"
    }