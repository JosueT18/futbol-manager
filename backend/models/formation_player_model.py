from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class FormationPlayer(Base):

    __tablename__ = "formation_players"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    formation_id = Column(
        Integer,
        ForeignKey("formations.id")
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    role = Column(
        String,
        nullable=False
    )

    position_x = Column(
        Float,
        default=0
    )

    position_y = Column(
        Float,
        default=0
    )

    # =========================
    # FORMATION
    # =========================
    formation = relationship(

        "Formation",

        back_populates="players"
    )

    # =========================
    # PLAYER
    # =========================
    player = relationship(

        "Player",

        back_populates="formations"
    )