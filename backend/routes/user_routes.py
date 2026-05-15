from fastapi import APIRouter
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from models.user_model import User
from schemas.user_schema import UserCreate, UserLogin

router = APIRouter()


@router.post("/register")
def register(user: UserCreate):

    db: Session = SessionLocal()

    try:

        existing_user = db.query(User).filter(
            User.username == user.username
        ).first()

        if existing_user:

            return {
                "success": False,
                "message": "El usuario ya existe"
            }

        new_user = User(
            username=user.username,
            password=user.password
        )

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return {
            "success": True,
            "message": "Usuario creado correctamente"
        }

    finally:

        db.close()


@router.post("/login")
def login(user: UserLogin):

    db: Session = SessionLocal()

    try:

        existing_user = db.query(User).filter(
            User.username == user.username,
            User.password == user.password
        ).first()

        if not existing_user:

            return {
                "success": False,
                "message": "Usuario o contraseña incorrectos"
            }

        return {
            "success": True,
            "message": "Login correcto",
            "user": {
                "id": existing_user.id,
                "username": existing_user.username
            }
        }

    finally:

        db.close()