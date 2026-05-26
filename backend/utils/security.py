from passlib.context import CryptContext

from jose import jwt

from datetime import (
    datetime,
    timedelta,
)

# =========================
# JWT
# =========================
SECRET_KEY = "futbol-manager-secret"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# =========================
# PASSWORD CONTEXT
# =========================
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

# =========================
# HASH PASSWORD
# =========================
def hash_password(password: str):

    password = password[:72]

    return pwd_context.hash(password)

# =========================
# VERIFY PASSWORD
# =========================
def verify_password(
    plain_password: str,
    hashed_password: str
):

    try:

        plain_password = plain_password[:72]

        return pwd_context.verify(
            plain_password,
            hashed_password
        )

    except Exception as e:

        print("VERIFY ERROR:", e)

        return False

# =========================
# CREATE TOKEN
# =========================
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.utcnow()
        +
        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )