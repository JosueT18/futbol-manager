from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

import os

from database.connection import (
    Base,
    engine,
)

# =========================
# IMPORT MODELS
# IMPORTANT:
# IMPORT ALL MODELS
# BEFORE create_all
# =========================
from models.team_model import Team
from models.player_model import Player
from models.user_model import User
from models.match_model import Match
from models.formation_model import Formation
from models.formation_player_model import FormationPlayer
from models.match_event_model import MatchEvent

# =========================
# IMPORT ROUTERS
# =========================
from routes.team_routes import (
    router as team_router
)

from routes.player_routes import (
    router as player_router
)

from routes.auth_routes import (
    router as auth_router
)

from routes.match_routes import (
    router as match_router
)

from routes.formation_routes import (
    router as formation_router
)

from routes.auth_routes import (
    router as auth_router
)

from routes.match_routes import router as match_router

from routes.match_event_routes import (
    router as match_event_router
)

from routes.standings_routes import (
    router as standing_routes
)

from routes.stats_routes import (
    router as stats_routes
)

from routes.dashboard_routes import (
    router as dashboard_routes
)

# =========================
# CREATE UPLOADS FOLDER
# =========================
os.makedirs(
    "uploads",
    exist_ok=True
)

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(
    bind=engine
)

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
app.include_router(auth_router)

app.include_router(team_router)

app.include_router(player_router)

app.include_router(auth_router)

app.include_router(match_router)

app.include_router(formation_router)

app.include_router(match_router)

app.include_router(match_event_router)

app.include_router(standing_routes)

app.include_router(stats_routes)

app.include_router(dashboard_routes)


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