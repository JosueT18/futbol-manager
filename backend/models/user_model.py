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
        nullable=False,
        index=True
    )

    password = Column(
        String,
        nullable=False
    )

    # =========================
    # ROLES
    #
    # Administrador
    # Director
    # Comision
    # Tecnico
    # Jugador
    #
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
    # Tecnicos y jugadores
    # pueden pertenecer
    # a un equipo
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

    # =========================
    # HELPER METHODS
    # =========================
    def is_admin(self):

        return (
            self.role == "Administrador"
        )

    def is_director(self):

        return (
            self.role == "Director"
        )

    def is_commission(self):

        return (
            self.role == "Comision"
        )

    def is_tecnico(self):

        return (
            self.role == "Tecnico"
        )

    def is_player(self):

        return (
            self.role == "Jugador"
        )