from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine, Base

# =========================
# IMPORT MODELS
# =========================
from models.user_model import User
from models.team_model import Team
from models.player_model import Player

from models.formation_model import Formation
from models.formation_player_model import FormationPlayer
from models.match_model import Match

# =========================
# IMPORT ROUTES
# =========================
from routes.user_routes import (
    router as user_router
)

from routes.team_routes import (
    router as team_router
)

from routes.player_routes import (
    router as player_router
)

from routes.formation_routes import (
    router as formation_router
)

from routes.match_routes import (
    router as match_router
)

# =========================
# CREATE APP
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================
# CREATE DATABASE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# ROUTES
# =========================
app.include_router(user_router)

app.include_router(team_router)

app.include_router(player_router)

app.include_router(formation_router)

app.include_router(match_router)

# =========================
# HOME
# =========================
@app.get("/")
def home():

    return {
        "message":
        "Backend funcionando correctamente"
    }