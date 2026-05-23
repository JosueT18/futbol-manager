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
      {...listeners}
      {...attributes}
      className="
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
        cursor-grab
        select-none
        z-20
        hover:scale-110
        transition
      "
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

      setTeams(teamsData)

      setPlayers(

        playersData.filter(
          (p: any) =>
            p.status === "approved"
        )
      )

      setFormations(
        formationsData
      )

    } catch (error) {

      console.error(error)
    }
  }


  // =========================
  // RESET FORM
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
  // REMOVE
  // =========================
  async function removeFormation(
    id: number
  ) {

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
  async function editFormation(
    formation: any
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
            players.find(
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

          players.find(
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


  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Formación
        </h1>

        {
  teamId && (

    <div className="mt-3">

      {
        teams
          .filter(
            (t: any) =>
              t.id === Number(teamId)
          )
          .map((team: any) => (

            <div
              key={team.id}
              className="
                flex
                items-center
                gap-3
              "
            >

              {
                team.logo && (

                  <img
                    src={
                      `http://localhost:8000${team.logo}`
                    }
                    alt={team.name}
                    className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                      border-2
                      border-white
                      shadow-lg
                    "
                  />

                )
              }

              <div>

                <p className="font-bold text-lg">
                  {team.name}
                </p>

                <p className="text-sm text-gray-500">
                  {team.city}
                </p>

              </div>

              </div>
            ))
          }

          </div>
        )
        }

        <p className="text-gray-500 mt-2">
          Gestión táctica avanzada
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

        {/* LEFT */}
        <div className="space-y-4">

          {/* PLANTILLA */}
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

                      <p className="text-sm font-semibold">
                        {player.name}
                      </p>

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
                starters.map(
                  (item: any) => (

                    <div
                      key={item.player.id}
                      className="
                        bg-blue-50
                        border
                        border-blue-100
                        rounded-xl
                        p-2
                      "
                    >

                      <p className="text-sm font-semibold">
                        {item.player.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.player.position}
                      </p>

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
                substitutes.map(
                  (player: any) => (

                    <div
                      key={player.id}
                      className="
                        bg-yellow-50
                        border
                        border-yellow-100
                        rounded-xl
                        p-2
                      "
                    >

                      <p className="text-sm font-semibold">
                        {player.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {player.position}
                      </p>

                    </div>
                  )
                )
              }

            </div>

          </Card>


          {/* FORMACIONES */}
          <Card>

            <div className="mb-4">

              <h2 className="text-lg font-bold">
                Formaciones guardadas
              </h2>

            </div>

            <div className="space-y-3">

              {
                formations.map(
                  (formation: any) => (

                    <div
                      key={formation.id}
                      onClick={() =>
                        editFormation(
                          formation
                        )
                      }
                      className={`
                        border
                        rounded-2xl
                        p-3
                        cursor-pointer
                        transition

                        ${
                          selectedFormation?.id ===
                          formation.id
                            ? `
                              bg-black
                              text-white
                            `
                            : `
                              bg-gray-50
                              hover:bg-gray-100
                            `
                        }
                      `}
                    >

                      <h3 className="font-bold text-sm">
                        {formation.name}
                      </h3>

                      <p
                        className={`
                          text-xs
                          mt-1

                          ${
                            selectedFormation?.id ===
                            formation.id
                              ? "text-gray-300"
                              : "text-gray-500"
                          }
                        `}
                      >

                        {formation.tactic}
                        {" • "}
                        Fútbol {formation.match_type}

                      </p>

                    </div>
                  )
                )
              }

            </div>

          </Card>

        </div>


        {/* RIGHT */}
        <div className="xl:col-span-3">

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

              {/* STRIPES */}
              <div className="absolute inset-0 grid grid-cols-8 opacity-10">

                {
                  Array.from({
                    length: 8,
                  }).map((_, i) => (

                    <div
                      key={i}
                      className={
                        i % 2 === 0
                          ? "bg-white"
                          : ""
                      }
                    />

                  ))
                }

              </div>


              {/* MID LINE */}
              <div
                className="
                  absolute
                  top-0
                  bottom-0
                  left-1/2
                  w-[4px]
                  bg-white
                  -translate-x-1/2
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
                  rounded-full
                  border-[4px]
                  border-white
                  -translate-x-1/2
                  -translate-y-1/2
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  -translate-x-1/2
                  -translate-y-1/2
                "
              />


              {/* AREAS */}
              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  w-[180px]
                  h-[320px]
                  border-[4px]
                  border-white
                  border-l-0
                "
              />

              <div
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  w-[180px]
                  h-[320px]
                  border-[4px]
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


          {/* ACTIONS */}
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

            {
              selectedFormation && (

                <button
                  onClick={() =>
                    removeFormation(
                      selectedFormation.id
                    )
                  }
                  className="
                    w-[190px]
                    h-[44px]
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    rounded-xl
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Eliminar
                </button>
              )
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default Formacion