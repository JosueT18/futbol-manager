from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class User(Base):

    __tablename__ = "users"

    # =========================
    # BASIC DATA
    # =========================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    # =========================
    # ROLES
    # Administrador
    # Director
    # Comision
    # Jugador
    # =========================
    role = Column(
        String,
        nullable=False,
        default="Jugador"
    )

    # =========================
    # STATUS
    # =========================
    active = Column(
        Boolean,
        default=True
    )

    # =========================
    # TEAM
    # =========================
    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=True
    )

    team = relationship(
        "Team",
        back_populates="users"
    )