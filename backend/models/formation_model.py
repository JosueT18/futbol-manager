from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
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

    name = Column(
        String,
        nullable=False
    )

    tactic = Column(
        String,
        nullable=False
    )

    match_type = Column(
        Integer,
        nullable=False
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    # =========================
    # RELATION TEAM
    # =========================
    team = relationship(
        "Team",
        back_populates="formations"
    )

    # =========================
    # RELATION PLAYERS
    # =========================
    players = relationship(

        "FormationPlayer",

        back_populates="formation",

        cascade="all, delete-orphan",

        lazy="joined"
    )