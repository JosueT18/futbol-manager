from sqlalchemy import (
    Column,
    Integer,
    String,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class Team(Base):

    __tablename__ = "teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    city = Column(
        String,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    tecnico = Column(
        String,
        nullable=True
    )

    #===============
    # ESTADISTICAS
    #===============
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

    #==========
    # LOGO
    #==========
    logo = Column(
        String,
        nullable=True
    )

    # =========================
    # USERS
    # =========================
    users = relationship(
        "User",
        back_populates="team"
    )

    # =========================
    # PLAYERS
    # =========================
    players = relationship(
        "Player",
        back_populates="team"
    )

    # =========================
    # FORMATIONS
    # =========================
    formations = relationship(
        "Formation",
        back_populates="team"
    )

    # =========================
    # HOME MATCHES
    # =========================
    home_matches = relationship(
        "Match",
        foreign_keys="[Match.home_team_id]",
        back_populates="home_team"
    )

    # =========================
    # AWAY MATCHES
    # =========================
    away_matches = relationship(
        "Match",
        foreign_keys="[Match.away_team_id]",
        back_populates="away_team"
    )

    # =========================
    # EVENTS
    # =========================
    events = relationship(
        "MatchEvent",
        back_populates="team"
    )