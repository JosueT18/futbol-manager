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
# VALID ROLES
# =========================
VALID_ROLES = [

    "Administrador",

    "Director",

    "Comision",

    "Tecnico",

    "Jugador",
]


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # =========================
    # EMAIL EXISTS
    # =========================
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El email ya existe"
        )

    # =========================
    # VALID ROLE
    # =========================
    if user.role not in VALID_ROLES:

        raise HTTPException(
            status_code=400,
            detail="Rol inválido"
        )

    # =========================
    # PASSWORD LENGTH
    # =========================
    if len(user.password) < 6:

        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 6 caracteres"
        )

    # =========================
    # CREATE USER
    # =========================
    new_user = User(

        name=user.name.strip(),

        email=user.email.strip().lower(),

        password=hash_password(
            user.password
        ),

        role=user.role,

        active=True,

        team_id=user.team_id,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message":
            "Usuario creado correctamente"
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # =========================
    # FIND USER
    # =========================
    db_user = db.query(User).filter(
        User.email == user.email.strip().lower()
    ).first()

    # =========================
    # INVALID EMAIL
    # =========================
    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    # =========================
    # INACTIVE USER
    # =========================
    if not db_user.active:

        raise HTTPException(
            status_code=403,
            detail="Usuario desactivado"
        )

    # =========================
    # INVALID PASSWORD
    # =========================
    if not verify_password(
        user.password,
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    # =========================
    # TOKEN
    # =========================
    token = create_access_token({

        "id": db_user.id,

        "role": db_user.role,

        "email": db_user.email,

        "team_id": db_user.team_id,
    })

    # =========================
    # RESPONSE
    # =========================
    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.name,

            "email": db_user.email,

            "role": db_user.role,

            "team_id": db_user.team_id,

            "active": db_user.active,
        }
    }


# =========================
# GET USERS
# =========================
@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users