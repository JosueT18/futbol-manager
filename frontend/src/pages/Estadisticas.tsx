import { useState } from "react"

import { useQuery } from "@tanstack/react-query"

import {
  getPlayers,
  updatePlayer,
} from "../api/players"

import {
  getTeams,
  updateTeam,
} from "../api/teams"

import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import Input from "../components/ui/Input"

function Estadisticas() {

  // =========================
  // STATES
  // =========================
  const [teamModalOpen, setTeamModalOpen] =
    useState(false)

  const [playerModalOpen, setPlayerModalOpen] =
    useState(false)

  const [selectedTeam, setSelectedTeam] =
    useState<any>(null)

  const [selectedPlayer, setSelectedPlayer] =
    useState<any>(null)

  // TEAM STATS
  const [pj, setPj] = useState("")
  const [pg, setPg] = useState("")
  const [pe, setPe] = useState("")
  const [pp, setPp] = useState("")
  const [gf, setGf] = useState("")
  const [gc, setGc] = useState("")
  const [points, setPoints] = useState("")

  // PLAYER STATS
  const [goals, setGoals] = useState("")
  const [yellowCards, setYellowCards] =
    useState("")

  const [redCards, setRedCards] =
    useState("")

  const [matchesPlayed, setMatchesPlayed] =
    useState("")

  // =========================
  // PLAYERS
  // =========================
  const {
    data: players = [],
    refetch: refetchPlayers,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  // =========================
  // TEAMS
  // =========================
  const {
    data: teams = [],
    refetch: refetchTeams,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  // =========================
  // APPROVED PLAYERS
  // =========================
  const approvedPlayers =
    players.filter(
      (player: any) =>
        player.status === "approved"
    )

  // =========================
  // SORTS
  // =========================
  const standings = [...teams]
    .sort(
      (a: any, b: any) =>
        (b.points || 0)
        -
        (a.points || 0)
    )

  const topScorers = [...approvedPlayers]
    .sort(
      (a: any, b: any) =>
        (b.goals || 0)
        -
        (a.goals || 0)
    )

  // =========================
  // OPEN TEAM MODAL
  // =========================
  function openTeamModal(team: any) {

    setSelectedTeam(team)

    setPj(team.pj?.toString() || "0")
    setPg(team.pg?.toString() || "0")
    setPe(team.pe?.toString() || "0")
    setPp(team.pp?.toString() || "0")

    setGf(team.gf?.toString() || "0")
    setGc(team.gc?.toString() || "0")

    setPoints(
      team.points?.toString() || "0"
    )

    setTeamModalOpen(true)
  }

  // =========================
  // SAVE TEAM STATS
  // =========================
  async function saveTeamStats() {

    await updateTeam(
      selectedTeam.id,
      {
        pj: Number(pj),
        pg: Number(pg),
        pe: Number(pe),
        pp: Number(pp),

        gf: Number(gf),
        gc: Number(gc),

        points: Number(points),
      }
    )

    setTeamModalOpen(false)

    await refetchTeams()
  }

  // =========================
  // OPEN PLAYER MODAL
  // =========================
  function openPlayerModal(player: any) {

    setSelectedPlayer(player)

    setGoals(
      player.goals?.toString() || "0"
    )

    setYellowCards(
      player.yellow_cards?.toString() || "0"
    )

    setRedCards(
      player.red_cards?.toString() || "0"
    )

    setMatchesPlayed(
      player.matches_played?.toString() || "0"
    )

    setPlayerModalOpen(true)
  }

  // =========================
  // SAVE PLAYER STATS
  // =========================
  async function savePlayerStats() {

    await updatePlayer(
      selectedPlayer.id,
      {
        goals: Number(goals),

        yellow_cards:
          Number(yellowCards),

        red_cards:
          Number(redCards),

        matches_played:
          Number(matchesPlayed),
      }
    )

    setPlayerModalOpen(false)

    await refetchPlayers()
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Estadísticas
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de estadísticas
        </p>

      </div>

      {/* TABLA POSICIONES */}
      <Card>

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h2 className="text-2xl font-bold">
            Tabla de Posiciones
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  bg-gray-100
                  text-sm
                  text-gray-600
                "
              >

                <th className="px-4 py-3 text-left">
                  Equipo
                </th>

                <th className="px-4 py-3 text-center">
                  PJ
                </th>

                <th className="px-4 py-3 text-center">
                  PG
                </th>

                <th className="px-4 py-3 text-center">
                  PE
                </th>

                <th className="px-4 py-3 text-center">
                  PP
                </th>

                <th className="px-4 py-3 text-center">
                  GF
                </th>

                <th className="px-4 py-3 text-center">
                  GC
                </th>

                <th className="px-4 py-3 text-center">
                  DG
                </th>

                <th className="px-4 py-3 text-center">
                  PTS
                </th>

                <th className="px-4 py-3 text-center">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {
                standings.map(
                  (team: any) => {

                    const dg =
                      (team.gf || 0)
                      -
                      (team.gc || 0)

                    return (

                      <tr
                        key={team.id}
                        className="
                          border-t
                          hover:bg-gray-50
                        "
                      >

                        <td className="px-4 py-4 font-semibold">
                          ⚽ {team.name}
                        </td>

                        <td className="text-center">
                          {team.pj || 0}
                        </td>

                        <td className="text-center">
                          {team.pg || 0}
                        </td>

                        <td className="text-center">
                          {team.pe || 0}
                        </td>

                        <td className="text-center">
                          {team.pp || 0}
                        </td>

                        <td className="text-center">
                          {team.gf || 0}
                        </td>

                        <td className="text-center">
                          {team.gc || 0}
                        </td>

                        <td className="text-center font-semibold">
                          {dg}
                        </td>

                        <td
                          className="
                            text-center
                            font-bold
                            text-blue-600
                          "
                        >
                          {team.points || 0}
                        </td>

                        <td className="text-center">

                          <Button
                            variant="secondary"
                            onClick={() =>
                              openTeamModal(team)
                            }
                          >
                            Editar
                          </Button>

                        </td>

                      </tr>
                    )
                  }
                )
              }

            </tbody>

          </table>

        </div>

      </Card>

      {/* ESTADISTICAS JUGADORES */}
      <Card>

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h2 className="text-2xl font-bold">
            Estadísticas Jugadores
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  bg-gray-100
                  text-sm
                  text-gray-600
                "
              >

                <th className="px-4 py-3 text-left">
                  Jugador
                </th>

                <th className="px-4 py-3 text-center">
                  Posición
                </th>

                <th className="px-4 py-3 text-center">
                  PJ
                </th>

                <th className="px-4 py-3 text-center">
                  Goles
                </th>

                <th className="px-4 py-3 text-center">
                  Amarillas
                </th>

                <th className="px-4 py-3 text-center">
                  Rojas
                </th>

                <th className="px-4 py-3 text-center">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {
                approvedPlayers.map(
                  (player: any) => (

                    <tr
                      key={player.id}
                      className="
                        border-t
                        hover:bg-gray-50
                      "
                    >

                      <td className="px-4 py-4 font-semibold">
                        ⚽ {player.name}
                      </td>

                      <td className="text-center">
                        {player.position}
                      </td>

                      <td className="text-center">
                        {
                          player.matches_played || 0
                        }
                      </td>

                      <td className="text-center font-bold text-green-600">
                        {player.goals || 0}
                      </td>

                      <td className="text-center">
                        {player.yellow_cards || 0}
                      </td>

                      <td className="text-center">
                        {player.red_cards || 0}
                      </td>

                      <td className="text-center">

                        <Button
                          variant="secondary"
                          onClick={() =>
                            openPlayerModal(player)
                          }
                        >
                          Editar
                        </Button>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </Card>

      {/* GOLEADORES */}
      <Card>

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h2 className="text-2xl font-bold">
            Ranking de Goleadores
          </h2>

        </div>

        <div className="space-y-3">

          {
            topScorers
              .slice(0, 10)
              .map(
                (
                  player: any,
                  index: number
                ) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-yellow-100
                          text-yellow-700
                          flex
                          items-center
                          justify-center
                          font-bold
                        "
                      >
                        {index + 1}
                      </div>

                      <div>

                        <p className="font-semibold">
                          ⚽ {player.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {player.position}
                        </p>

                      </div>

                    </div>

                    <div
                      className="
                        bg-green-100
                        text-green-700
                        px-4
                        py-2
                        rounded-full
                        font-bold
                      "
                    >
                      {player.goals || 0} goles
                    </div>

                  </div>
                )
              )
          }

        </div>

      </Card>

      {/* TEAM MODAL */}
      <Modal
        open={teamModalOpen}
        onClose={() =>
          setTeamModalOpen(false)
        }
        title="Editar Estadísticas Equipo"
      >

        <div className="space-y-4">

          <Input
            type="number"
            placeholder="PJ"
            value={pj}
            onChange={(e) =>
              setPj(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="PG"
            value={pg}
            onChange={(e) =>
              setPg(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="PE"
            value={pe}
            onChange={(e) =>
              setPe(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="PP"
            value={pp}
            onChange={(e) =>
              setPp(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Goles a favor"
            value={gf}
            onChange={(e) =>
              setGf(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Goles en contra"
            value={gc}
            onChange={(e) =>
              setGc(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Puntos"
            value={points}
            onChange={(e) =>
              setPoints(e.target.value)
            }
          />

          <div className="flex justify-end gap-3 pt-3">

            <Button
              variant="secondary"
              onClick={() =>
                setTeamModalOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={saveTeamStats}
            >
              Guardar
            </Button>

          </div>

        </div>

      </Modal>

      {/* PLAYER MODAL */}
      <Modal
        open={playerModalOpen}
        onClose={() =>
          setPlayerModalOpen(false)
        }
        title="Editar Estadísticas Jugador"
      >

        <div className="space-y-4">

          <Input
            type="number"
            placeholder="Partidos Jugados"
            value={matchesPlayed}
            onChange={(e) =>
              setMatchesPlayed(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Goles"
            value={goals}
            onChange={(e) =>
              setGoals(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Amarillas"
            value={yellowCards}
            onChange={(e) =>
              setYellowCards(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Rojas"
            value={redCards}
            onChange={(e) =>
              setRedCards(
                e.target.value
              )
            }
          />

          <div className="flex justify-end gap-3 pt-3">

            <Button
              variant="secondary"
              onClick={() =>
                setPlayerModalOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={savePlayerStats}
            >
              Guardar
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  )
}

export default Estadisticas