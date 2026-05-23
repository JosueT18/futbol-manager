from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from database.connection import Base, engine

from models.team_model import Team
from models.player_model import Player

from routes.team_routes import router as team_router
from routes.player_routes import router as player_router


Base.metadata.create_all(bind=engine)


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# STATIC
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ROUTES
app.include_router(team_router)

app.include_router(player_router)


@app.get("/")
def root():

    return {
        "message": "Backend funcionando"
    }