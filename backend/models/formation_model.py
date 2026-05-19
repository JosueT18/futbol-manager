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

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Nombre de la formación
    name = Column(
        String,
        nullable=False
    )

    # Ej:
    # 4-3-3
    # 4-4-2
    # custom
    tactic = Column(
        String,
        nullable=False
    )

    # Tipo:
    # 11
    # 9
    # 7
    # 5
    match_type = Column(
        Integer,
        nullable=False,
        default=11
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    # =========================
    # RELATIONSHIPS
    # =========================
    team = relationship(
        "Team",
        back_populates="formations"
    )

    players = relationship(
        "FormationPlayer",
        back_populates="formation",
        cascade="all, delete-orphan"
    )