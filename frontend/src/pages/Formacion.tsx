import { useEffect, useState } from "react"

import { getTeams } from "../api/teams"

import { getPlayers } from "../api/players"

import {
  createFormation,
} from "../api/formations"

import Card from "../components/ui/Card"

import Button from "../components/ui/Button"


function Formacion() {

  // =========================
  // STATES
  // =========================
  const [teams, setTeams] =
    useState<any[]>([])

  const [players, setPlayers] =
    useState<any[]>([])

  const [teamId, setTeamId] =
    useState("")

  const [formationName, setFormationName] =
    useState("")

  const [matchType, setMatchType] =
    useState(11)

  const [tactic, setTactic] =
    useState("4-3-3")

  const [selectedPlayer, setSelectedPlayer] =
    useState<any>(null)

  const [positions, setPositions] =
    useState<any[]>([])

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    const teamsData =
      await getTeams()

    const playersData =
      await getPlayers()

    setTeams(teamsData)

    setPlayers(

      playersData.filter(
        (p: any) =>
          p.status === "approved"
      )
    )
  }

  // =========================
  // TEAM PLAYERS
  // =========================
  const teamPlayers =
    players.filter(
      (p: any) =>
        p.team_id === Number(teamId)
    )

  // =========================
  // ADD PLAYER
  // =========================
  function addPlayer(player: any) {

    const exists =
      positions.find(
        (p: any) =>
          p.player.id === player.id
      )

    if (exists) {
      return
    }

    setPositions([
      ...positions,

      {
        player,
        x: 300,
        y: 300,
        role: "Titular",
      },
    ])
  }

  // =========================
  // SELECT PLAYER
  // =========================
  function selectPlayer(player: any) {

    setSelectedPlayer(player)
  }

  // =========================
  // FIELD CLICK
  // =========================
  function handleFieldClick(
    event: any
  ) {

    if (!selectedPlayer) {
      return
    }

    const field =
      event.currentTarget

    const rect =
      field.getBoundingClientRect()

    const x =
      event.clientX
      -
      rect.left
      -
      30

    const y =
      event.clientY
      -
      rect.top
      -
      30

    setPositions((prev: any) =>
      prev.map((p: any) => {

        if (
          p.player.id
          ===
          selectedPlayer.id
        ) {

          return {

            ...p,

            x,

            y,
          }
        }

        return p
      })
    )

    setSelectedPlayer(null)
  }

  // =========================
  // CHANGE ROLE
  // =========================
  function toggleRole(
    playerId: number
  ) {

    setPositions((prev: any) =>
      prev.map((p: any) => {

        if (
          p.player.id === playerId
        ) {

          return {

            ...p,

            role:
              p.role === "Titular"
                ? "Suplente"
                : "Titular",
          }
        }

        return p
      })
    )
  }

  // =========================
  // REMOVE PLAYER
  // =========================
  function removePlayer(
    playerId: number
  ) {

    setPositions((prev: any) =>
      prev.filter(
        (p: any) =>
          p.player.id !== playerId
      )
    )
  }

  // =========================
  // SAVE FORMATION
  // =========================
  async function saveFormation() {

    try {

      await createFormation({

        name: formationName,

        tactic,

        match_type: matchType,

        team_id: Number(teamId),

        players: positions.map(
          (p: any) => ({

            player_id:
              p.player.id,

            position_x:
              p.x,

            position_y:
              p.y,

            role:
              p.role,
          })
        ),
      })

      alert(
        "Formación guardada correctamente"
      )

    } catch (error) {

      console.error(error)

      alert(
        "Error al guardar"
      )
    }
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Formación
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión táctica profesional
        </p>

      </div>

      {/* CONFIG */}
      <Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Nombre formación"
            value={formationName}
            onChange={(e) =>
              setFormationName(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          {/* TEAM */}
          <select
            value={teamId}
            onChange={(e) =>
              setTeamId(
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
              Seleccionar equipo
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

          {/* MATCH TYPE */}
          <select
            value={matchType}
            onChange={(e) =>
              setMatchType(
                Number(
                  e.target.value
                )
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          >

            <option value={11}>
              Fútbol 11
            </option>

            <option value={9}>
              Fútbol 9
            </option>

            <option value={7}>
              Fútbol 7
            </option>

            <option value={5}>
              Fútbol 5
            </option>

          </select>

          {/* TACTIC */}
          <input
            type="text"
            value={tactic}
            onChange={(e) =>
              setTactic(
                e.target.value
              )
            }
            placeholder="4-3-3"
            className="
              border
              p-3
              rounded-xl
            "
          />

        </div>

      </Card>

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* PLAYERS */}
        <Card>

          <h2 className="text-2xl font-bold mb-4">
            Jugadores
          </h2>

          <div className="space-y-3">

            {
              teamPlayers.map(
                (player: any) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                      rounded-xl
                      p-3
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {player.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position}
                      </p>

                    </div>

                    <Button
                      onClick={() =>
                        addPlayer(player)
                      }
                    >
                      +
                    </Button>

                  </div>
                )
              )
            }

          </div>

        </Card>

        {/* FIELD */}
        <div className="xl:col-span-3">

          <div
            onClick={handleFieldClick}
            className="
              relative
              bg-green-700
              rounded-3xl
              h-[800px]
              overflow-hidden
              border-8
              border-white
              shadow-xl
            "
          >

            {/* LINE */}
            <div
              className="
                absolute
                left-1/2
                top-0
                bottom-0
                w-1
                bg-white
              "
            />

            {/* CENTER */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                w-40
                h-40
                border-4
                border-white
                rounded-full
                -translate-x-1/2
                -translate-y-1/2
              "
            />

            {/* PLAYERS */}
            {
              positions.map(
                (item: any) => (

                  <div
                    key={item.player.id}

                    onClick={(e) => {

                      e.stopPropagation()

                      selectPlayer(
                        item.player
                      )
                    }}

                    className={`
                      absolute
                      w-16
                      h-16
                      rounded-full
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-white
                      text-xs
                      font-bold
                      cursor-pointer
                      border-2
                      border-white
                      shadow-lg

                      ${
                        selectedPlayer?.id
                        ===
                        item.player.id
                          ? "bg-yellow-500"
                          : item.role === "Titular"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }
                    `}

                    style={{
                      left: item.x,
                      top: item.y,
                    }}
                  >

                    <span>
                      {item.player.number}
                    </span>

                    <span className="truncate w-full text-center px-1">
                      {item.player.name}
                    </span>

                    <button
                      onClick={(e) => {

                        e.stopPropagation()

                        toggleRole(
                          item.player.id
                        )
                      }}
                      className="
                        absolute
                        -bottom-6
                        text-[10px]
                        bg-black/70
                        px-2
                        rounded-full
                      "
                    >
                      {item.role}
                    </button>

                    <button
                      onClick={(e) => {

                        e.stopPropagation()

                        removePlayer(
                          item.player.id
                        )
                      }}
                      className="
                        absolute
                        -top-2
                        -right-2
                        w-5
                        h-5
                        rounded-full
                        bg-red-500
                        text-white
                        text-[10px]
                      "
                    >
                      X
                    </button>

                  </div>
                )
              )
            }

          </div>

          {/* SAVE */}
          <div className="mt-5 flex justify-end">

            <Button
              onClick={saveFormation}
            >
              Guardar Formación
            </Button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Formacion