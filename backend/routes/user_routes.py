from fastapi import APIRouter
from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.user_model import User

from schemas.user_schema import UserCreate, UserLogin

router = APIRouter()


@router.post("/register")
def register(user: UserCreate):

    db: Session = SessionLocal()

    new_user = User(
        username=user.username,
        password=user.password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Usuario creado correctamente"
    }

@router.post("/login")
def login(user: UserLogin):

    db: Session = SessionLocal()

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
        "message": "Login correcto"
    }