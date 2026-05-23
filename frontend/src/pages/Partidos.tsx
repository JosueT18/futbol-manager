import { useEffect, useState } from "react"

import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../api/matches"

import {
  getTeams,
} from "../api/teams"

import Card from "../components/ui/Card"
import Button from "../components/ui/Button"

function Partidos() {

  // =========================
  // STATES
  // =========================
  const [matches, setMatches] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [homeTeamId, setHomeTeamId] =
    useState("")

  const [awayTeamId, setAwayTeamId] =
    useState("")

  const [date, setDate] =
    useState("")

  const [stadium, setStadium] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    try {

      setLoading(true)

      const matchesData =
        await getMatches()

      const teamsData =
        await getTeams()

      setMatches(matchesData)

      setTeams(teamsData)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  // =========================
  // CREATE MATCH
  // =========================
  async function handleCreateMatch() {

    if (
      !homeTeamId
      ||
      !awayTeamId
      ||
      !date
    ) {

      alert(
        "Completa todos los campos"
      )

      return
    }

    if (
      homeTeamId === awayTeamId
    ) {

      alert(
        "No puedes elegir el mismo equipo"
      )

      return
    }

    try {

      await createMatch({

        home_team_id:
          Number(homeTeamId),

        away_team_id:
          Number(awayTeamId),

        home_score: 0,

        away_score: 0,

        date,

        stadium,

        status: "scheduled",
      })

      setHomeTeamId("")
      setAwayTeamId("")
      setDate("")
      setStadium("")

      await loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al crear partido"
      )
    }
  }

  // =========================
  // FINISH MATCH
  // =========================
  async function finishMatch(
    match: any
  ) {

    const home =
      prompt(
        "Goles local",
        match.home_score
      )

    const away =
      prompt(
        "Goles visitante",
        match.away_score
      )

    if (
      home === null
      ||
      away === null
    ) {
      return
    }

    try {

      await updateMatch(
        match.id,
        {
          home_score:
            Number(home),

          away_score:
            Number(away),

          status: "finished",
        }
      )

      await loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al finalizar partido"
      )
    }
  }

  // =========================
  // DELETE MATCH
  // =========================
  async function handleDeleteMatch(
    id: number
  ) {

    const confirmDelete =
      confirm(
        "¿Eliminar partido?"
      )

    if (!confirmDelete) {
      return
    }

    try {

      await deleteMatch(id)

      await loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al eliminar partido"
      )
    }
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Partidos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de encuentros
        </p>

      </div>

      {/* CREATE */}
      <Card>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-5
            gap-4
          "
        >

          {/* LOCAL */}
          <select
            value={homeTeamId}
            onChange={(e) =>
              setHomeTeamId(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              p-3
            "
          >

            <option value="">
              Equipo local
            </option>

            {
              teams.map(
                (team: any) => (

                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.name}
                  </option>
                )
              )
            }

          </select>

          {/* VISITOR */}
          <select
            value={awayTeamId}
            onChange={(e) =>
              setAwayTeamId(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              p-3
            "
          >

            <option value="">
              Equipo visitante
            </option>

            {
              teams.map(
                (team: any) => (

                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.name}
                  </option>
                )
              )
            }

          </select>

          {/* DATE */}
          <input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              p-3
            "
          />

          {/* STADIUM */}
          <input
            type="text"
            placeholder="Estadio"
            value={stadium}
            onChange={(e) =>
              setStadium(
                e.target.value
              )
            }
            className="
              border
              rounded-xl
              p-3
            "
          />

          {/* BUTTON */}
          <Button
            onClick={
              handleCreateMatch
            }
          >
            Crear Partido
          </Button>

        </div>

      </Card>

      {/* MATCHES */}
      <div className="space-y-5">

        {
          loading
          ? (

            <Card>

              <p>
                Cargando partidos...
              </p>

            </Card>

          )
          : (

            matches.map(
              (match: any) => {

                const homeTeam =
                  teams.find(
                    (t: any) =>
                      t.id ===
                      match.home_team_id
                  )

                const awayTeam =
                  teams.find(
                    (t: any) =>
                      t.id ===
                      match.away_team_id
                  )

                return (

                  <Card
                    key={match.id}
                  >

                    <div
                      className="
                        flex
                        flex-col
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                        gap-5
                      "
                    >

                      {/* INFO */}
                      <div>

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            text-2xl
                            font-bold
                          "
                        >

                          <span>
                            {homeTeam?.name}
                          </span>

                          <span className="text-gray-400">
                            vs
                          </span>

                          <span>
                            {awayTeam?.name}
                          </span>

                        </div>

                        <p className="text-gray-500 mt-2">

                          📍 {match.stadium || "Sin estadio"}

                        </p>

                        <p className="text-gray-500">

                          📅 {match.date}

                        </p>

                      </div>

                      {/* SCORE */}
                      <div
                        className="
                          text-center
                        "
                      >

                        <div
                          className="
                            text-5xl
                            font-black
                          "
                        >

                          {match.home_score}

                          <span className="mx-3 text-gray-400">
                            -
                          </span>

                          {match.away_score}

                        </div>

                        <div
                          className="
                            mt-2
                            inline-block
                            px-4
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                            bg-gray-100
                          "
                        >

                          {
                            match.status
                          }

                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div
                        className="
                          flex
                          gap-3
                        "
                      >

                        {
                          match.status !==
                          "finished"
                          && (

                            <Button
                              onClick={() =>
                                finishMatch(
                                  match
                                )
                              }
                            >
                              Finalizar
                            </Button>
                          )
                        }

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDeleteMatch(
                              match.id
                            )
                          }
                        >
                          Eliminar
                        </Button>

                      </div>

                    </div>

                  </Card>
                )
              }
            )
          )
        }

      </div>

    </div>
  )
}

export default Partidos