from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db

from models.team_model import Team
from models.match_model import Match

router = APIRouter()

@router.get("/standings")
def get_standings(
db: Session = Depends(get_db)
):

        teams = db.query(Team).all()

        matches = db.query(Match).filter(
            Match.status == "finished"
        ).all()

        standings = []

        for team in teams:

            played = 0
            won = 0
            drawn = 0
            lost = 0

            goals_for = 0
            goals_against = 0

            points = 0

            for match in matches:

                is_home = (
                    match.home_team_id == team.id
                )

                is_away = (
                    match.away_team_id == team.id
                )

                if not is_home and not is_away:
                    continue

                played += 1

                if is_home:

                    home_score = match.home_score or 0
                    away_score = match.away_score or 0

                    goals_for += home_score
                    goals_against += away_score

                    if home_score > away_score:

                        won += 1
                        points += 3

                    elif home_score == away_score:

                        drawn += 1
                        points += 1

                    else:

                        lost += 1

                else:

                    away_score = match.away_score or 0
                    home_score = match.home_score or 0

                    goals_for += away_score
                    goals_against += home_score

                    if away_score > home_score:

                        won += 1
                        points += 3

                    elif away_score == home_score:

                        drawn += 1
                        points += 1

                    else:

                        lost += 1

            standings.append({

                "team_id": team.id,

                "team_name": team.name,

                "logo": team.logo,

                "played": played,

                "won": won,

                "drawn": drawn,

                "lost": lost,

                "goals_for": goals_for,

                "goals_against": goals_against,

                "goal_difference":
                    goals_for - goals_against,

                "points": points,
            })

        standings.sort(

            key=lambda x: (

                x["points"],

                x["goal_difference"],

                x["goals_for"],
            ),

            reverse=True,
        )

        return standings