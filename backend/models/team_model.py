from sqlalchemy import (
    Column,
    Integer,
    String,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class Team(Base):

    __tablename__ = "teams"

    # =========================
    # BASIC DATA
    # =========================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    city = Column(
        String,
        nullable=False
    )

    tecnico = Column(
        String,
        nullable=False
    )

    logo = Column(
        String,
        nullable=True
    )

    # =========================
    # STATS
    # =========================
    pj = Column(
        Integer,
        default=0
    )

    pg = Column(
        Integer,
        default=0
    )

    pe = Column(
        Integer,
        default=0
    )

    pp = Column(
        Integer,
        default=0
    )

    gf = Column(
        Integer,
        default=0
    )

    gc = Column(
        Integer,
        default=0
    )

    points = Column(
        Integer,
        default=0
    )

    # =========================
    # PLAYERS
    # =========================
    players = relationship(
        "Player",
        back_populates="team",
        cascade="all, delete"
    )

    # =========================
    # USERS
    # =========================
    users = relationship(
        "User",
        back_populates="team"
    )

    # =========================
    # FORMATIONS
    # =========================
    formations = relationship(
        "Formation",
        back_populates="team",
        cascade="all, delete"
    )

    # =========================
    # HOME MATCHES
    # =========================
    home_matches = relationship(
        "Match",
        foreign_keys="Match.home_team_id",
        back_populates="home_team"
    )

    # =========================
    # AWAY MATCHES
    # =========================
    away_matches = relationship(
        "Match",
        foreign_keys="Match.away_team_id",
        back_populates="away_team"
    )
     # =========================
    # EVENTS
    # =========================
    events = relationship(
        "MatchEvent",
        back_populates="team"
    )
