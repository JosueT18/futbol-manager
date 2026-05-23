from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from database.connection import Base


class MatchEvent(Base):

    __tablename__ = "match_events"

    id = Column(
        Integer,
        primary_key=True
    )

    minute = Column(Integer)

    event_type = Column(String)

    match_id = Column(
        Integer,
        ForeignKey("matches.id")
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    match = relationship(
       "Match",
      back_populates="events"
    )
      

    player = relationship(
        "Player"
    )

    team = relationship(
        "Team"
    )