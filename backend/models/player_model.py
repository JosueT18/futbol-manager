from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database.connection import Base


class Player(Base):

    __tablename__ = "players"

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
        nullable=False
    )

    lastname = Column(
        String,
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    number = Column(
        Integer,
        nullable=False
    )

    position = Column(
        String,
        nullable=False
    )

    goals = Column(
        Integer,
        default=0
    )
    yellow_cards = Column(
        Integer,
        default=0
    )
    red_cards = Column(
        Integer,
        default=0
    )
    matches_played = Column(
        Integer,
        default=0
    )

    # =========================
    # STATUS
    # pending
    # approved
    # rejected
    # =========================
    status = Column(
        String,
        nullable=False,
        default="pending"
    )

    rejection_reason = Column(
        String,
        nullable=True
    )

    # =========================
    # STATS
    # =========================
    
    matches_played = Column(
        Integer,
        default=0
    )

    # =========================
    # TEAM RELATION
    # =========================
    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    team = relationship(
        "Team",
        back_populates="players"
    )

    # =========================
    # FORMATION RELATION
    # =========================
    formations = relationship(
        "FormationPlayer",
        back_populates="player",
        cascade="all, delete"
    )

    # ===============
    # MATCH EVENTS
    # ===============
    events = relationship(
        "MatchEvent",
        back_populates="player",
        overlaps="player"
    )