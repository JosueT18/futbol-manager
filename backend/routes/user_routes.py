from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.user_model import User

from schemas.user_schema import (
    UserCreate,
    UserLogin,
)

from utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter()


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El email ya existe"
        )

    new_user = User(

        name=user.name,

        email=user.email,

        password=hash_password(
            user.password
        ),

        role=user.role,

        team_id=user.team_id,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Usuario creado correctamente"
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    token = create_access_token({

        "id": db_user.id,

        "role": db_user.role,

        "email": db_user.email,
    })

    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.name,

            "email": db_user.email,

            "role": db_user.role,

            "team_id": db_user.team_id,
        }
    }