from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.user_model import User
from models.team_model import Team

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

    "Jugador",
]

# =========================
# ROLES THAT REQUIRE TEAM
# =========================
ROLES_WITH_TEAM = [

    "Director",    

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
        User.email == user.email.strip().lower()
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
    # TEAM VALIDATION
    # =========================
    team_id = None

    # ROLES WITH TEAM
    if user.role in ROLES_WITH_TEAM:

        if not user.team_id:

            raise HTTPException(
                status_code=400,
                detail="Este rol requiere un equipo"
            )

        # VERIFY TEAM EXISTS
        team = db.query(Team).filter(
            Team.id == user.team_id
        ).first()

        if not team:

            raise HTTPException(
                status_code=400,
                detail="El equipo no existe"
            )

        team_id = user.team_id

    # ROLES WITHOUT TEAM
    else:

        team_id = None

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

        team_id=team_id,
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
    # CREATE TOKEN
    # =========================
    access_token = create_access_token(

        data={

            "sub": db_user.email,

            "id": db_user.id,

            "role": db_user.role,

            "team_id": db_user.team_id,
        }
    )

    # =========================
    # RESPONSE
    # =========================
    return {

        "access_token": access_token,

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