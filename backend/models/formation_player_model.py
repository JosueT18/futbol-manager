from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class FormationPlayer(Base):

    __tablename__ = "formation_players"

    # =========================
    # ID
    # =========================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================
    # RELATIONS
    # =========================
    formation_id = Column(
        Integer,
        ForeignKey("formations.id"),
        nullable=False
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id"),
        nullable=False
    )

    # =========================
    # POSITION
    # =========================
    pos_x = Column(
        Integer,
        default=0
    )

    pos_y = Column(
        Integer,
        default=0
    )

    # =========================
    # RELATIONSHIPS
    # =========================
    formation = relationship(
        "Formation",
        back_populates="players"
    )

    player = relationship(
        "Player",
        back_populates="formations"
    )