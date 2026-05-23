from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from database.connection import Base


class Formation(Base):

    __tablename__ = "formations"

    # =========================
    # COLUMNS
    # =========================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Nombre personalizado
    # Ej:
    # "Titulares Final"
    name = Column(
        String,
        nullable=False
    )

    # Táctica
    # Ej:
    # 4-3-3
    # 4-4-2
    # custom
    tactic = Column(
        String,
        nullable=False,
        default="4-3-3"
    )

    # Tipo de partido
    # 11 / 9 / 7 / 5
    match_type = Column(
        Integer,
        nullable=False,
        default=11
    )

    # Equipo
    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    # =========================
    # RELATIONSHIPS
    # =========================

    # TEAM
    team = relationship(
        "Team",
        back_populates="formations"
    )

    # PLAYERS IN FORMATION
    players = relationship(
        "FormationPlayer",
        back_populates="formation",
        cascade="all, delete-orphan"
    )