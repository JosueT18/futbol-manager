from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
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

    position_x = Column(
        Integer,
        default=0
    )

    position_y = Column(
        Integer,
        default=0
    )

    role = Column(String)

    formation = relationship(
        "Formation",
        back_populates="players"
    )