from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

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

    # =========================
    # PLAYER STATUS
    # =========================
    status = Column(
        String,
        default="approved"
    )

    rejection_reason = Column(
        String,
        nullable=True
    )

    # =========================
    # PLAYER STATS
    # =========================
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