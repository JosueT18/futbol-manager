from sqlalchemy import (
    Column,
    Integer,
    String
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

    name = Column(String)

    city = Column(String)

    coach = Column(String)

    # =========================
    # RELATIONSHIPS
    # =========================
    players = relationship(
        "Player",
        back_populates="team"
    )

    formations = relationship(
        "Formation",
        back_populates="team",
        cascade="all, delete-orphan"
    )