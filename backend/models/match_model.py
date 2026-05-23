from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)

from sqlalchemy.orm import relationship

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

    date = Column(String)

    stadium = Column(String)

    status = Column(
        String,
        default="scheduled"
    )

    # =========================
    # RELATIONS
    # =========================
    home_team = relationship(
        "Team",
        foreign_keys=[home_team_id]
    )

    away_team = relationship(
        "Team",
        foreign_keys=[away_team_id]
    )