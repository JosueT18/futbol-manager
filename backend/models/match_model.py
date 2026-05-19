from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from database.connection import Base


class Match(Base):

    __tablename__ = "matches"

    id = Column(
        Integer,
        primary_key=True
    )

    home_team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    away_team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    home_score = Column(
        Integer,
        default=0
    )

    away_score = Column(
        Integer,
        default=0
    )

    stadium = Column(String)

    status = Column(
        String,
        default="pending"
    )

    match_type = Column(
        String,
        default="league"
    )

    played_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    home_team = relationship(
        "Team",
        foreign_keys=[home_team_id]
    )

    away_team = relationship(
        "Team",
        foreign_keys=[away_team_id]
    )

    events = relationship(
        "MatchEvent",
        back_populates="match",
        cascade="all, delete"
    )