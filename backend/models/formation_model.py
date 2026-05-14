from sqlalchemy import Column, Integer, String, ForeignKey

from database.connection import Base


class Formation(Base):

    __tablename__ = "formations"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    players_per_team = Column(Integer)

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )