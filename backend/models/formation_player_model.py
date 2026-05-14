from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    String
)

from database.connection import Base


class FormationPlayer(Base):

    __tablename__ = "formation_players"

    id = Column(Integer, primary_key=True)

    formation_id = Column(
        Integer,
        ForeignKey("formations.id")
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    is_starter = Column(Boolean)

    position = Column(String)