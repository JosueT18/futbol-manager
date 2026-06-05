from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from database.connection import Base


class Match(Base):

    __tablename__ = "matches"

    # =========================
    # ID
    # =========================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================
    # TEAMS
    # =========================
    home_team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    away_team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    # =================
    # EVENTS
    #==================
    events = relationship(
        "MatchEvent",
        back_populates="match",
        cascade="all,delete"
    )

    # =========================
    # RELATIONSHIPS
    # =========================
    home_team = relationship(
        "Team",
        foreign_keys=[home_team_id],
        back_populates="home_matches"
    )

    away_team = relationship(
        "Team",
        foreign_keys=[away_team_id],
        back_populates="away_matches"
    )

    # =========================
    # FIXTURE
    # =========================
    round_number = Column(
        Integer,
        default=1,
        nullable=False
    )

    match_date = Column(
        DateTime,
        nullable=True
    )

    stadium = Column(
        String,
        nullable=True
    )

    # =========================
    # RESULT
    # =========================
    home_score = Column(
        Integer,
        default=0,
        nullable=False
    )

    away_score = Column(
        Integer,
        default=0,
        nullable=False
    )

    # =========================
    # STATUS
    # scheduled
    # live
    # finished
    # =========================
    status = Column(
        String,
        default="scheduled",
        nullable=False
    )