from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from database.connection import Base


class MatchEvent(Base):

    __tablename__ = "match_events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

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

    event_type = Column(
        String
    )

    minute = Column(
        Integer
    )

    # =========================
    # RELATIONSHIPS
    # =========================
    match = relationship(
        "Match",
        back_populates="events"
    )

    player = relationship(
        "Player",
        back_populates="events",
        overlaps="events"
    )

    team = relationship(
        "Team",
        back_populates="events"
    )