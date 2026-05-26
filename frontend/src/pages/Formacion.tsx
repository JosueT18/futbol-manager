import { useEffect, useState } from "react"

import {
  DndContext,
  useDraggable,
} from "@dnd-kit/core"

import { getTeams } from "../api/teams"

import { getPlayers } from "../api/players"

import {
  createFormation,
  getFormations,
  deleteFormation,
} from "../api/formations"

import Card from "../components/ui/Card"

// =========================
// AUTH
// =========================
const role =
  localStorage.getItem("role") || ""

const isPlayer =
  role === "Jugador"

const canManageFormation =
  role === "Administrador"
  ||
  role === "Director"
  ||
  role === "Comision"

// =========================
// PLAYER TOKEN
// =========================
function PlayerToken({
  item,
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: item.player.id.toString(),
    disabled: !canManageFormation,
  })

  const style = {

    position: "absolute" as const,

    left: item.x,

    top: item.y,

    transform:
      transform
        ? `
          translate3d(
            ${transform.x}px,
            ${transform.y}px,
            0
          )
        `
        : undefined,
  }

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...(canManageFormation ? listeners : {})}
      {...(canManageFormation ? attributes : {})}
      className={`
        w-12
        h-12
        rounded-full
        bg-gradient-to-b
        from-blue-500
        to-blue-700
        border-2
        border-white
        shadow-xl
        text-white
        flex
        flex-col
        items-center
        justify-center
        select-none
        z-20
        transition

        ${
          canManageFormation
            ? "cursor-grab hover:scale-110"
            : "cursor-default"
        }
      `}
    >

      <span className="text-[10px] font-bold leading-none">
        {item.player.number}
      </span>

      <span
        className="
          text-[8px]
          leading-none
          mt-[2px]
          truncate
          w-full
          text-center
          px-1
        "
      >
        {item.player.name}
      </span>

    </div>
  )
}

// =========================
// MAIN
// =========================
function Formacion() {

  // =========================
  // STATES
  // =========================
  const [teams, setTeams] =
    useState<any[]>([])

  const [players, setPlayers] =
    useState<any[]>([])

  const [formations, setFormations] =
    useState<any[]>([])

  const [teamId, setTeamId] =
    useState("")

  const [formationName, setFormationName] =
    useState("")

  const [matchType, setMatchType] =
    useState(11)

  const [tactic, setTactic] =
    useState("4-3-3")

  const [starters, setStarters] =
    useState<any[]>([])

  const [substitutes, setSubstitutes] =
    useState<any[]>([])

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [selectedFormation, setSelectedFormation] =
    useState<any>(null)

  // =========================
  // LOAD
  // =========================
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    try {

      const teamsData =
        await getTeams()

      const playersData =
        await getPlayers()

      const formationsData =
        await getFormations()

      setTeams(
        Array.isArray(teamsData)
          ? teamsData
          : []
      )

      const approvedPlayers =
        Array.isArray(playersData)
          ? playersData.filter(
              (p: any) =>
                p.status === "approved"
            )
          : []

      setPlayers(approvedPlayers)

      setFormations(
        Array.isArray(formationsData)
          ? formationsData
          : []
      )

      if (
        isPlayer &&
        Array.isArray(formationsData) &&
        formationsData.length > 0
      ) {

        const formation =
          formationsData[0]

        loadFormationData(
          formation,
          approvedPlayers
        )
      }

    } catch (error) {

      console.error(error)
    }
  }

  // =========================
  // LOAD FORMATION
  // =========================
  function loadFormationData(
    formation: any,
    playersList = players
  ) {

    setSelectedFormation(
      formation
    )

    setEditingId(
      formation.id
    )

    setFormationName(
      formation.name
    )

    setTactic(
      formation.tactic
    )

    setMatchType(
      formation.match_type
    )

    setTeamId(
      formation.team_id.toString()
    )

    const startersLoaded =
      formation.players
        .filter(
          (p: any) =>
            p.role === "starter"
        )
        .map((p: any) => {

          const player =
            playersList.find(
              (pl: any) =>
                pl.id === p.player_id
            )

          if (!player) {
            return null
          }

          return {

            player,

            x: p.position_x,

            y: p.position_y,
          }
        })
        .filter(Boolean)

    const substitutesLoaded =
      formation.players
        .filter(
          (p: any) =>
            p.role === "substitute"
        )
        .map((p: any) =>

          playersList.find(
            (pl: any) =>
              pl.id === p.player_id
          )
        )
        .filter(Boolean)

    setStarters(
      startersLoaded
    )

    setSubstitutes(
      substitutesLoaded
    )
  }

  // =========================
  // RESET
  // =========================
  function resetForm() {

    setEditingId(null)

    setSelectedFormation(null)

    setFormationName("")

    setTactic("4-3-3")

    setMatchType(11)

    setTeamId("")

    setStarters([])

    setSubstitutes([])
  }

  // =========================
  // FILTER PLAYERS
  // =========================
  const availablePlayers =
    players.filter(
      (player: any) =>
        player.team_id ===
        Number(teamId)
    )

  // =========================
  // ADD STARTER
  // =========================
  function addStarter(
    player: any
  ) {

    if (!canManageFormation) {
      return
    }

    const exists =
      starters.find(
        (p: any) =>
          p.player.id === player.id
      )

    if (exists) {
      return
    }

    setSubstitutes((prev: any) =>
      prev.filter(
        (p: any) =>
          p.id !== player.id
      )
    )

    setStarters([

      ...starters,

      {
        player,
        x: 350,
        y: 250,
      },
    ])
  }

  // =========================
  // ADD SUBSTITUTE
  // =========================
  function addSubstitute(
    player: any
  ) {

    if (!canManageFormation) {
      return
    }

    const exists =
      substitutes.find(
        (p: any) =>
          p.id === player.id
      )

    if (exists) {
      return
    }

    setStarters((prev: any) =>
      prev.filter(
        (p: any) =>
          p.player.id !== player.id
      )
    )

    setSubstitutes([
      ...substitutes,
      player,
    ])
  }

  // =========================
  // DRAG
  // =========================
  function handleDragEnd(
    event: any
  ) {

    if (!canManageFormation) {
      return
    }

    const {
      delta,
      active,
    } = event

    setStarters((prev: any) =>

      prev.map((item: any) => {

        if (
          item.player.id.toString()
          ===
          active.id.toString()
        ) {

          return {

            ...item,

            x:
              item.x + delta.x,

            y:
              item.y + delta.y,
          }
        }

        return item
      })
    )
  }

  // =========================
  // SAVE
  // =========================
  async function saveFormation() {

    if (!canManageFormation) {
      return
    }

    try {

      await createFormation({

        name:
          formationName,

        tactic,

        match_type:
          matchType,

        team_id:
          Number(teamId),

        players: [

          ...starters.map(
            (p: any) => ({

              player_id:
                p.player.id,

              role:
                "starter",

              position_x:
                p.x,

              position_y:
                p.y,
            })
          ),

          ...substitutes.map(
            (p: any) => ({

              player_id:
                p.id,

              role:
                "substitute",

              position_x: 0,

              position_y: 0,
            })
          ),
        ],
      })

      alert(
        editingId
          ? "Formación actualizada"
          : "Formación guardada"
      )

      resetForm()

      loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al guardar"
      )
    }
  }

  // =========================
  // DELETE
  // =========================
  async function removeFormation(
    id: number
  ) {

    if (!canManageFormation) {
      return
    }

    const confirmDelete =
      confirm(
        "¿Eliminar formación?"
      )

    if (!confirmDelete) {
      return
    }

    try {

      await deleteFormation(id)

      if (
        selectedFormation?.id === id
      ) {

        resetForm()
      }

      loadData()

    } catch (error) {

      console.error(error)

      alert(
        "Error al eliminar"
      )
    }
  }

  // =========================
  // EDIT
  // =========================
  function editFormation(
    formation: any
  ) {

    if (!canManageFormation) {
      return
    }

    loadFormationData(
      formation
    )
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Formación
        </h1>

        <p className="text-gray-500 mt-2">

          {
            isPlayer
              ? "Visualización táctica del equipo"
              : "Gestión táctica avanzada"
          }

        </p>

      </div>

      {/* CONFIG */}
      {
        canManageFormation && (

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
                className="border p-3 rounded-xl"
              />

              <select
                value={teamId}
                onChange={(e) =>
                  setTeamId(
                    e.target.value
                  )
                }
                className="border p-3 rounded-xl"
              >

                <option value="">
                  Equipo
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

              <select
                value={matchType}
                onChange={(e) =>
                  setMatchType(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border p-3 rounded-xl"
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

              <input
                type="text"
                value={tactic}
                onChange={(e) =>
                  setTactic(
                    e.target.value
                  )
                }
                placeholder="4-3-3"
                className="border p-3 rounded-xl"
              />

            </div>

          </Card>
        )
      }

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* LEFT */}
        {
          canManageFormation && (

            <div className="space-y-4">

              <Card>

                <h2 className="text-lg font-bold mb-3">
                  Plantilla
                </h2>

                <div className="space-y-2 max-h-[320px] overflow-auto">

                  {
                    availablePlayers.map(
                      (player: any) => (

                        <div
                          key={player.id}
                          className="
                            bg-gray-50
                            rounded-xl
                            p-2
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div>

                            <p className="text-sm font-semibold">
                              {player.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {player.position}
                            </p>

                          </div>

                          <div className="flex gap-1">

                            <button
                              onClick={() =>
                                addStarter(player)
                              }
                              className="
                                px-2
                                py-1
                                text-xs
                                rounded-lg
                                bg-blue-600
                                text-white
                              "
                            >
                              Titular
                            </button>

                            <button
                              onClick={() =>
                                addSubstitute(player)
                              }
                              className="
                                px-2
                                py-1
                                text-xs
                                rounded-lg
                                bg-yellow-500
                                text-white
                              "
                            >
                              Suplente
                            </button>

                          </div>

                        </div>
                      )
                    )
                  }

                </div>

              </Card>

              {/* TITULARES */}
              <Card>

                <h2 className="text-lg font-bold mb-3">
                  Titulares
                </h2>

                <div className="space-y-2">

                  {
                    starters.length === 0 && (

                      <p className="text-sm text-gray-500">
                        No hay titulares
                      </p>
                    )
                  }

                  {
                    starters.map(
                      (item: any) => (

                        <div
                          key={item.player.id}
                          className="
                            bg-blue-50
                            rounded-xl
                            p-3
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div>

                            <p className="text-sm font-semibold">
                              #{item.player.number} {item.player.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {item.player.position}
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              addSubstitute(
                                item.player
                              )
                            }
                            className="
                              px-2
                              py-1
                              text-xs
                              rounded-lg
                              bg-yellow-500
                              text-white
                            "
                          >
                            Pasar a suplente
                          </button>

                        </div>
                      )
                    )
                  }

                </div>

              </Card>

              {/* SUPLENTES */}
              <Card>

                <h2 className="text-lg font-bold mb-3">
                  Suplentes
                </h2>

                <div className="space-y-2">

                  {
                    substitutes.length === 0 && (

                      <p className="text-sm text-gray-500">
                        No hay suplentes
                      </p>
                    )
                  }

                  {
                    substitutes.map(
                      (player: any) => (

                        <div
                          key={player.id}
                          className="
                            bg-yellow-50
                            rounded-xl
                            p-3
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div>

                            <p className="text-sm font-semibold">
                              #{player.number} {player.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {player.position}
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              addStarter(
                                player
                              )
                            }
                            className="
                              px-2
                              py-1
                              text-xs
                              rounded-lg
                              bg-blue-600
                              text-white
                            "
                          >
                            Pasar a titular
                          </button>

                        </div>
                      )
                    )
                  }

                </div>

              </Card>

              {/* FORMATIONS */}
              <Card>

                <h2 className="text-lg font-bold mb-3">
                  Formaciones
                </h2>

                <div className="space-y-2">

                  {
                    formations.map(
                      (formation: any) => (

                        <div
                          key={formation.id}
                          className="
                            border
                            rounded-xl
                            p-3
                            flex
                            justify-between
                            items-center
                          "
                        >

                          <div>

                            <p className="font-semibold">
                              {formation.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {formation.tactic}
                            </p>

                          </div>

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                editFormation(formation)
                              }
                              className="
                                text-xs
                                bg-black
                                text-white
                                px-3
                                py-1
                                rounded-lg
                              "
                            >
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                removeFormation(
                                  formation.id
                                )
                              }
                              className="
                                text-xs
                                bg-red-600
                                text-white
                                px-3
                                py-1
                                rounded-lg
                              "
                            >
                              Eliminar
                            </button>

                          </div>

                        </div>
                      )
                    )
                  }

                </div>

              </Card>

            </div>
          )
        }

        {/* RIGHT */}
        <div
          className={
            canManageFormation
              ? "xl:col-span-3"
              : "xl:col-span-4"
          }
        >

          <DndContext
            onDragEnd={handleDragEnd}
          >

            <div
              className="
                relative
                mx-auto
                w-full
                max-w-[950px]
                h-[620px]
                rounded-[30px]
                overflow-hidden
                border-[8px]
                border-white
                shadow-2xl
                bg-gradient-to-r
                from-green-700
                via-green-600
                to-green-700
              "
            >

              {/* BORDER */}
              <div
                className="
                  absolute
                  inset-4
                  border-4
                  border-white
                  rounded-2xl
                "
              />

              {/* HALF */}
              <div
                className="
                  absolute
                  left-1/2
                  top-0
                  bottom-0
                  w-1
                  bg-white
                  -translate-x-1/2
                "
              />

              {/* CENTER */}
              <div
                className="
                  absolute
                  w-40
                  h-40
                  border-4
                  border-white
                  rounded-full
                  left-1/2
                  top-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                "
              />

              {/* LEFT AREA */}
              <div
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  w-28
                  h-72
                  border-4
                  border-white
                  border-l-0
                "
              />

              {/* RIGHT AREA */}
              <div
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  w-28
                  h-72
                  border-4
                  border-white
                  border-r-0
                "
              />

              {/* PLAYERS */}
              {
                starters.map(
                  (item: any) => (

                    <PlayerToken
                      key={
                        item.player.id
                      }
                      item={item}
                    />
                  )
                )
              }

            </div>

          </DndContext>

          {/* SUBSTITUTES */}
          {
            substitutes.length > 0 && (

              <Card className="mt-6">

                <h2 className="text-lg font-bold mb-4">
                  Suplentes
                </h2>

                <div className="flex flex-wrap gap-3">

                  {
                    substitutes.map(
                      (player: any) => (

                        <div
                          key={player.id}
                          className="
                            bg-yellow-100
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            font-semibold
                          "
                        >
                          #{player.number} {player.name}
                        </div>
                      )
                    )
                  }

                </div>

              </Card>
            )
          }

          {/* ACTIONS */}
          {
            canManageFormation && (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-3
                  mt-6
                "
              >

                <button
                  onClick={saveFormation}
                  className="
                    w-[190px]
                    h-[44px]
                    bg-black
                    hover:bg-gray-800
                    text-white
                    rounded-xl
                    text-sm
                    font-semibold
                    transition
                  "
                >

                  {
                    editingId
                      ? "Actualizar"
                      : "Guardar"
                  }

                </button>

                <button
                  onClick={resetForm}
                  className="
                    w-[190px]
                    h-[44px]
                    bg-gray-200
                    hover:bg-gray-300
                    text-black
                    rounded-xl
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Nueva Formación
                </button>

              </div>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default Formacion