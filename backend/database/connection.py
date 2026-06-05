from sqlalchemy import create_engine

from sqlalchemy.orm import (
    sessionmaker,
    declarative_base,
)

from urllib.parse import quote_plus


# =========================
# DATABASE CONFIG
# =========================
USER = "postgres"

PASSWORD = quote_plus(
    "JoVa1820"
)

HOST = "localhost"

DB_NAME = "futbol_manager"

DATABASE_URL = (
    f"postgresql://"
    f"{USER}:{PASSWORD}"
    f"@{HOST}/{DB_NAME}"
)


# =========================
# ENGINE
# =========================
engine = create_engine(

    DATABASE_URL,

    pool_size=10,

    max_overflow=20,

    pool_pre_ping=True,
)


# =========================
# SESSION
# =========================
SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine
)


# =========================
# BASE
# =========================
Base = declarative_base()


# =========================
# DATABASE DEPENDENCY
# =========================
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()