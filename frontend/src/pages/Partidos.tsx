import { useEffect, useState } from "react"

import {
  getTeams
} from "../api/teams"

import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../api/matches"

import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import Input from "../components/ui/Input"


function Partidos() {

  // =========================
  // STATES
  // =========================
  const [teams, setTeams] =
    useState<any[]>([])

  const [matches, setMatches] =
    useState<any[]>([])

  const [homeTeam, setHomeTeam] =
    useState("")

  const [awayTeam, setAwayTeam] =
    useState("")

  const [stadium, setStadium] =
    useState("")

  const [tournament, setTournament] =
    useState("")

  const [date, setDate] =
    useState("")

  const [modalOpen, setModalOpen] =
    useState(false)

  const [selectedMatch, setSelectedMatch] =
    useState<any>(null)

  const [homeScore, setHomeScore] =
    useState("0")

  const [awayScore, setAwayScore] =
    useState("0")

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    const teamsData =
      await getTeams()

    const matchesData =
      await getMatches()

    setTeams(teamsData)

    setMatches(matchesData)
  }

  // =========================
  // CREATE MATCH
  // =========================
  async function handleCreateMatch() {

    if (
      !homeTeam ||
      !awayTeam
    ) {

      alert(
        "Selecciona ambos equipos"
      )

      return
    }

    if (
      homeTeam === awayTeam
    ) {

      alert(
        "Los equipos no pueden ser iguales"
      )

      return
    }

    try {

      await createMatch({

        home_team_id:
          Number(homeTeam),

        away_team_id:
          Number(awayTeam),

        stadium,

        tournament,

        match_date: date,
      })

      alert(
        "Partido creado"
      )

      setHomeTeam("")
      setAwayTeam("")
      setStadium("")
      setTournament("")
      setDate("")

      loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al crear partido"
      )
    }
  }

  // =========================
  // OPEN RESULT MODAL
  // =========================
  function openResultModal(
    match: any
  ) {

    setSelectedMatch(match)

    setHomeScore(
      match.home_score?.toString()
      || "0"
    )

    setAwayScore(
      match.away_score?.toString()
      || "0"
    )

    setModalOpen(true)
  }

  // =========================
  // SAVE RESULT
  // =========================
  async function saveResult() {

    try {

      await updateMatch(
        selectedMatch.id,
        {

          home_score:
            Number(homeScore),

          away_score:
            Number(awayScore),

          status: "finished",
        }
      )

      alert(
        "Resultado guardado"
      )

      setModalOpen(false)

      loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al guardar resultado"
      )
    }
  }

  // =========================
  // DELETE MATCH
  // =========================
  async function handleDelete(
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

      loadData()

    } catch (error) {

      console.error(error)
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
          Gestión de partidos y resultados
        </p>

      </div>

      {/* CREATE */}
      <Card>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* HOME */}
          <select
            value={homeTeam}
            onChange={(e) =>
              setHomeTeam(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          >

            <option value="">
              Local
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

          {/* AWAY */}
          <select
            value={awayTeam}
            onChange={(e) =>
              setAwayTeam(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          >

            <option value="">
              Visitante
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

          <Input
            placeholder="Estadio"
            value={stadium}
            onChange={(e) =>
              setStadium(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Torneo"
            value={tournament}
            onChange={(e) =>
              setTournament(
                e.target.value
              )
            }
          />

          <Input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />

        </div>

        <div className="mt-5">

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
      <div className="space-y-4">

        {
          matches.map(
            (match: any) => {

              const home =
                teams.find(
                  (t: any) =>
                    t.id
                    ===
                    match.home_team_id
                )

              const away =
                teams.find(
                  (t: any) =>
                    t.id
                    ===
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
                      md:flex-row
                      items-center
                      justify-between
                      gap-5
                    "
                  >

                    {/* INFO */}
                    <div>

                      <h2
                        className="
                          text-2xl
                          font-bold
                        "
                      >

                        {home?.name}
                        {" "}
                        {match.home_score}
                        {" - "}
                        {match.away_score}
                        {" "}
                        {away?.name}

                      </h2>

                      <p
                        className="
                          text-gray-500
                          mt-2
                        "
                      >
                        🏟️ {match.stadium}
                      </p>

                      <p
                        className="
                          text-gray-500
                        "
                      >
                        🏆 {match.tournament}
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div
                      className="
                        flex
                        gap-3
                      "
                    >

                      <Button
                        onClick={() =>
                          openResultModal(
                            match
                          )
                        }
                      >
                        Resultado
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDelete(
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
        }

      </div>

      {/* RESULT MODAL */}
      <Modal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        title="Cargar Resultado"
      >

        <div className="space-y-4">

          <Input
            type="number"
            placeholder="Goles Local"
            value={homeScore}
            onChange={(e) =>
              setHomeScore(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Goles Visitante"
            value={awayScore}
            onChange={(e) =>
              setAwayScore(
                e.target.value
              )
            }
          />

          <div
            className="
              flex
              justify-end
              gap-3
              pt-4
            "
          >

            <Button
              variant="secondary"
              onClick={() =>
                setModalOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={saveResult}
            >
              Guardar
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  )
}

export default Partidos