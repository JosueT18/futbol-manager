from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine
from database.base import Base

from models.user_model import User
from routes.user_routes import router as user_router

app = FastAPI()

app.include_router(user_router)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "message": "Backend funcionando correctamente"
    }