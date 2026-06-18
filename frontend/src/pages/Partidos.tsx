import { useEffect, useMemo, useState } from "react"

import Swal from "sweetalert2"

import Card from "../components/ui/Card"

import {
  getTeams,
} from "../api/teams"

import {
  createMatch,
  getMatches,
  updateMatch,
} from "../api/matches"

import {
  getMatchEvents,
  createMatchEvent,
  updateMatchEvent,
  deleteMatchEvent,
} from "../api/matchEvents"
import { div } from "framer-motion/client"

function Partidos() {

  // =========================
  // ROLE
  // =========================
  const role =
    localStorage.getItem("role") || ""

  const userTeamId =
    Number(localStorage.getItem("team_id"))

  const canCreateMatch =
    role === "Administrador"
    //||
    //role === "Comision"
    ||
    role === "Tecnico"

  const canEditMatch =
    role === "Administrador"
    ||
    role === "Comision"
    ||
    role === "Tecnico"

  // =========================
  // STATES
  // =========================
  const [teams, setTeams] =
    useState<any[]>([])

  const [matches, setMatches] =
    useState<any[]>([])

  const [homeTeamId, setHomeTeamId] =
    useState("")

  const [awayTeamId, setAwayTeamId] =
    useState("")

  const [date, setDate] =
    useState("")

  const [stadium, setStadium] =
    useState("")

  const [round, setRound] =
    useState("1")

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  // =========================
  // EVENTS
  // =========================
  const [events, setEvents] =
    useState<any[]>([])

  const [eventPlayerId, setEventPlayerId] =
    useState("")

  const [eventTeamId, setEventTeamId] =
    useState("")

  const [eventType, setEventType] =
    useState("goal")

  const [eventMinute, setEventMinute] =
    useState("")

  // =========================
  // MODAL
  // =========================
  const [selectedMatch, setSelectedMatch] =
    useState<any>(null)

  const [editHomeScore, setEditHomeScore] =
    useState(0)

  const [editAwayScore, setEditAwayScore] =
    useState(0)

  const [editStatus, setEditStatus] =
    useState("scheduled")

  const [showModal, setShowModal] =
    useState(false)

  console.log(
    "CANTIDAD EVENTOS:",
    events.length
  )
  console.log(
    "EVENTOS:",
    events
  )

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    loadTeams()

    loadMatches()

  }, [])

  // =========================
  // BLOCK BODY SCROLL
  // =========================
  useEffect(() => {

    if (showModal) {

      document.body.style.overflow =
        "hidden"

    } else {

      document.body.style.overflow =
        "auto"
    }

    return () => {

      document.body.style.overflow =
        "auto"
    }

  }, [showModal])

  // =========================
  // LOAD TEAMS
  // =========================
  async function loadTeams() {

    try {

      const data =
        await getTeams()

      if (Array.isArray(data)) {

        setTeams(data)

      } else {

        setTeams([])
      }

    } catch (error) {

      console.error(error)

      setTeams([])
    }
  }

  // =========================
  // LOAD MATCHES
  // =========================
  async function loadMatches() {

    try {

      const data =
        await getMatches()

        console.log("MATCHES:", data)

      if (Array.isArray(data)) {

        const sortedMatches =
          data.sort(
            (
              a: any,
              b: any
            ) => {

              if (
                a.round_number !==
                b.round_number
              ) {

                return (
                  a.round_number -
                  b.round_number
                )
              }

              return (
                new Date(
                  a.match_date
                ).getTime()
                -
                new Date(
                  b.match_date
                ).getTime()
              )
            }
          )

        setMatches(
          sortedMatches
        )

      } else {

        setMatches([])
      }

    } catch (error) {

      console.error(error)

      setMatches([])
    }
  }

  // =========================
  // LOAD EVENTS
  // =========================
  async function loadEvents(
      matchId: number
    ) {

      try {

        const data =
          await getMatchEvents(
            matchId
          )

        console.log(
          "EVENTOS RECIBIDOS:",
          data
        )

        if (
          Array.isArray(data) &&
          data.length > 0
        ) {

          console.log(
            "PRIMER EVENTO:",
            data[0]
          )

          console.log(
            "PLAYER:",
            data[0].player
          )
        }

        if (Array.isArray(data)) {

          setEvents(data)

        } else {

          setEvents([])
        }

      } catch (error) {

        console.error(error)

        setEvents([])
      }
    }
  // =========================
  // CREATE MATCH
  // =========================
  async function saveMatch() {

    if (!canCreateMatch) {

      Swal.fire({

        icon: "error",

        title:
          "Sin permisos",
      })

      return
    }

    if (
      !homeTeamId ||
      !awayTeamId ||
      !date ||
      !stadium ||
      !round
    ) {

      setMessage(
        "Completa todos los campos"
      )

      return
    }

    if (
      homeTeamId ===
      awayTeamId
    ) {

      Swal.fire({

        icon: "warning",

        title:
          "Los equipos no pueden ser iguales",
      })

      return
    }

    try {

      setLoading(true)

      await createMatch({

        home_team_id:
          Number(homeTeamId),

        away_team_id:
          Number(awayTeamId),

        round_number:
          Number(round),

        match_date:
          date,

        stadium,
      })

      await loadMatches()

      Swal.fire({

        icon: "success",

        title:
          "Partido creado correctamente",

        timer: 1500,

        showConfirmButton: false,
      })

      setHomeTeamId("")
      setAwayTeamId("")
      setDate("")
      setStadium("")
      setRound("1")

    } catch (error) {

      console.error(error)

      Swal.fire({

        icon: "error",

        title:
          "Error al crear partido",
      })

    } finally {

      setLoading(false)
    }
  }

  // =========================
  // OPEN MODAL
  // =========================
  async function openEditModal(
    match: any
  ) {

    if (!canEditMatch) {
      return
    }

    setSelectedMatch(match)

    setEditHomeScore(
      match.home_score || 0
    )

    setEditAwayScore(
      match.away_score || 0
    )

    setEditStatus(
      match.status ||
      "scheduled"
    )

    await loadEvents(
      match.id
    )

    setShowModal(true)
  }

  // =========================
  // SAVE RESULT
  // =========================
  async function saveResult() {

    if (!selectedMatch) {
      return
    }

    try {

      await updateMatch(

        selectedMatch.id,

        {

          home_score:
            Number(editHomeScore),

          away_score:
            Number(editAwayScore),

          status:
            editStatus,
        }
      )

      await loadMatches()

      Swal.fire({

        icon: "success",

        title:
          "Partido actualizado",

        timer: 1500,

        showConfirmButton: false,
      })

      setShowModal(false)

    } catch (error) {

      console.error(error)

      Swal.fire({

        icon: "error",

        title:
          "Error al actualizar partido",
      })
    }
  }

  // =========================
  // SAVE EVENT
  // =========================
  async function saveEvent() {

    if (
      !selectedMatch ||
      !eventPlayerId ||
      !eventMinute ||
      !eventTeamId
    ) {

      Swal.fire({

        icon: "warning",

        title:
          "Completa todos los campos",
      })

      return
    }

    try {

      await createMatchEvent({

        match_id:
          selectedMatch.id,

        player_id:
          Number(eventPlayerId),

        team_id:
          Number(eventTeamId),

        event_type:
          eventType,

        minute:
          Number(eventMinute),
      })

      await loadEvents(
        selectedMatch.id
      )

      await loadMatches()

      setEventPlayerId("")
      setEventMinute("")
      setEventType("goal")

      Swal.fire({

        icon: "success",

        title:
          "Evento agregado",

        timer: 1200,

        showConfirmButton: false,
      })

    } catch (error) {

      console.error(error)

      Swal.fire({

        icon: "error",

        title:
          "Error al agregar evento",
      })
    }
  }

  async function editEvent(
    event: any
    ) {

    const result =
    await Swal.fire({

      title: "Editar evento",

      html: `
        <input
          id="minute"
          class="swal2-input"
          type="number"
          value="${event.minute}"
          placeholder="Minuto"
        >
      `,

      showCancelButton: true,

      confirmButtonText: "Guardar",

      preConfirm: () => {

        const minute =
          (
            document.getElementById(
              "minute"
            ) as HTMLInputElement
          ).value

        return {
          minute: Number(minute)
        }
      }
    })

    if (!result.isConfirmed) {
    return
    }

    try {

    await updateMatchEvent(

      event.id,

      {
        event_type:
          event.event_type,

        minute:
          result.value.minute
      }
    )

    await loadEvents(
      selectedMatch.id
    )

    Swal.fire(
      "Actualizado",
      "",
      "success"
    )

    } catch (error) {

    console.error(error)

    Swal.fire(
      "Error",
      "No se pudo actualizar",
      "error"
    )

    }
}

async function removeEvent(
  eventId: number
  ) {

  const confirm =
  await Swal.fire({

    title:
      "¿Eliminar evento?",

    icon:
      "warning",

    showCancelButton: true
  })

  if (!confirm.isConfirmed) {
  return
  }

  try {

  await deleteMatchEvent(
    eventId
  )

  await loadEvents(
    selectedMatch.id
  )

  await loadMatches()

  Swal.fire(
    "Eliminado",
    "",
    "success"
  )

  } catch (error) {

  console.error(error)

  Swal.fire(
    "Error",
    "No se pudo eliminar",
    "error"
  )

  }
}

  // =========================
  // PLAYERS
  // =========================
  const availablePlayers =
    useMemo(() => {

      return teams
        .filter(
          (team: any) =>
            team.id ===
            Number(eventTeamId)
        )
        .flatMap(
          (team: any) =>
            team.players || []
        )
        .filter(
          (player: any) =>
            player.status ===
            "approved"
        )

    }, [
      teams,
      eventTeamId,
    ])

  // =========================
  // ICONS
  // =========================
  function getEventIcon(
    type: string
  ) {

    if (type === "goal") {
      return "⚽"
    }

    if (
      type ===
      "yellow_card"
    ) {
      return "🟨"
    }

    if (
      type ===
      "red_card"
    ) {
      return "🟥"
    }

    return "📌"
  }

  function getEventLabel(
    type: string
  ) {

    if (type === "goal") {
      return "Gol"
    }

    if (
      type ===
      "yellow_card"
    ) {
      return "Amarilla"
    }

    if (
      type ===
      "red_card"
    ) {
      return "Roja"
    }

    return type
  }

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-4xl font-bold">
          Partidos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de encuentros
        </p>

      </div>

      {/* MESSAGE */}
      {
        message && (

          <div
            className="
              mb-5
              bg-blue-100
              text-blue-800
              p-4
              rounded-xl
            "
          >
            {message}
          </div>
        )
      }

      {/* FORM */}
      {
        canCreateMatch && (

          <Card>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              <select
                value={homeTeamId}
                onChange={(e) =>
                  setHomeTeamId(
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

              <select
                value={awayTeamId}
                onChange={(e) =>
                  setAwayTeamId(
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
                  p-3
                  rounded-xl
                "
              />

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
                  p-3
                  rounded-xl
                "
              />

              <input
                type="number"
                min={1}
                value={round}
                onChange={(e) =>
                  setRound(
                    e.target.value
                  )
                }
                placeholder="Fecha"
                className="
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>

            <button
              disabled={loading}
              onClick={saveMatch}
              className="
                mt-5
                bg-black
                text-white
                px-6
                py-3
                rounded-xl
                disabled:opacity-50
              "
            >

              {
                loading
                  ? "Guardando..."
                  : "Guardar Partido"
              }

            </button>

          </Card>
        )
      }

      {/* FIXTURE */}
      <div className="mt-8 space-y-5">

        {
          matches
            .filter((match: any) => {

              if (
                role === "Administrador" ||
                role === "Comision"
              ) {
                return true
              }

              if (
                role === "Tecnico" ||
                role === "Jugador"
              ) {

                return (
                  match.home_team_id === userTeamId ||
                  match.away_team_id === userTeamId
                )
              }

              return true
            })
            .map(
              (match: any) => (

                <Card
                  key={match.id}
                >

                  <div className="flex justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex-1">

                      <p className="text-sm text-gray-500 mb-2">

                        Fecha
                        {" "}
                        {match.round_number}

                      </p>

                      <h3 className="text-xl font-bold">

                        {match.home_team}

                        {" vs "}

                        {match.away_team}

                      </h3>

                      <p className="text-gray-500 mt-2">
                        {match.stadium}
                      </p>

                      <p className="text-gray-500">
                        {
                          match.match_date &&
                          new Date(
                            match.match_date
                          ).toLocaleString()
                        }
                      </p>

                    </div>

                    {/* RIGHT */}
                    <div className="text-right">

                      <div
                        className={`
                          px-4
                          py-2
                          rounded-xl
                          font-semibold

                          ${
                            match.status === "finished"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        `}
                      >

                        {
                          match.status === "finished"
                            ? "Finalizado"
                            : "Programado"
                        }

                      </div>

                      {
                          match.status === "finished" && (

                            <>

                              <div className="text-3xl font-bold mt-3">

                                {match.home_score}

                                {" - "}

                                {match.away_score}

                              </div>

                              {
                                match.events &&
                                match.events.length > 0 && (

                                  <div
                                    className="
                                      mt-4
                                      text-left
                                      border-t
                                      pt-3
                                      space-y-1
                                    "
                                  >

                                    {
                                      match.events.map(
                                        (event: any) => (                                          

                                            <div
                                              key={event.id}
                                              className="text-sm text-gray-700"
                                            >

                                              {event.event_type === "goal" && "⚽"}
                                              {event.event_type === "yellow_card" && "🟨"}
                                              {event.event_type === "red_card" && "🟥"}

                                              {" "}

                                              {
                                                event.player_name
                                                  ? event.player_name
                                                  : "Jugador"
                                              }

                                              {" - "}

                                              {event.minute}'

                                            </div>
                                          )
                                        
                                      )
                                    }

                                  </div>
                                )
                              }

                            </>

                          )
                        }

                      {
                        canEditMatch && (

                          <button
                            onClick={() =>
                              openEditModal(match)
                            }
                            className="
                              mt-4
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              px-4
                              py-2
                              rounded-xl
                              transition
                            "
                          >
                            Editar
                          </button>
                        )
                      }

                    </div>

                  </div>

                </Card>
              )
            )
        }

      </div>
          {/* MODAL EDICION */}
          {
            showModal &&
            selectedMatch && (

              <div
                className="
                  fixed
                  inset-0
                  bg-black/60
                  flex
                  items-center
                  justify-center
                  z-50
                  p-4
                "
              >

                <div
                  className="
                    bg-white
                    rounded-2xl
                    w-full
                    max-w-4xl
                    max-h-[90vh]
                    overflow-y-auto
                    p-6
                  "
                >

                  <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                      Editar Partido
                    </h2>

                    <button
                      onClick={() =>
                        setShowModal(false)
                      }
                      className="
                        bg-gray-200
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Cerrar
                    </button>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <div>

                      <label className="block mb-2 font-semibold">
                        Goles Local
                      </label>

                      <input
                        type="number"
                        value={editHomeScore}
                        onChange={(e) =>
                          setEditHomeScore(
                            Number(e.target.value)
                          )
                        }
                        className="
                          border
                          p-3
                          rounded-xl
                          w-full
                        "
                      />

                    </div>

                    <div>

                      <label className="block mb-2 font-semibold">
                        Goles Visitante
                      </label>

                      <input
                        type="number"
                        value={editAwayScore}
                        onChange={(e) =>
                          setEditAwayScore(
                            Number(e.target.value)
                          )
                        }
                        className="
                          border
                          p-3
                          rounded-xl
                          w-full
                        "
                      />

                    </div>

                    <div>

                      <label className="block mb-2 font-semibold">
                        Estado
                      </label>

                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(
                            e.target.value
                          )
                        }
                        className="
                          border
                          p-3
                          rounded-xl
                          w-full
                        "
                      >

                        <option value="scheduled">
                          Programado
                        </option>

                        <option value="finished">
                          Finalizado
                        </option>

                      </select>

                    </div>

                  </div>

                  <button
                    onClick={saveResult}
                    className="
                      bg-green-600
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      mb-8
                    "
                  >
                    Guardar Resultado
                  </button>

                  <hr className="my-6" />

                  <h3 className="text-xl font-bold mb-4">
                    Eventos
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">

                    <select
                      value={eventTeamId}
                      onChange={(e) =>
                        setEventTeamId(
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
                      value={eventPlayerId}
                      onChange={(e) =>
                        setEventPlayerId(
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
                        Jugador
                      </option>

                      {
                        availablePlayers.map(
                          (player: any) => (

                            <option
                              key={player.id}
                              value={player.id}
                            >
                              {player.name}
                            </option>
                          )
                        )
                      }

                    </select>

                    <select
                      value={eventType}
                      onChange={(e) =>
                        setEventType(
                          e.target.value
                        )
                      }
                      className="
                        border
                        p-3
                        rounded-xl
                      "
                    >

                      <option value="goal">
                        Gol
                      </option>

                      <option value="yellow_card">
                        Amarilla
                      </option>

                      <option value="red_card">
                        Roja
                      </option>

                    </select>

                    <input
                      type="number"
                      placeholder="Minuto"
                      value={eventMinute}
                      onChange={(e) =>
                        setEventMinute(
                          e.target.value
                        )
                      }
                      className="
                        border
                        p-3
                        rounded-xl
                      "
                    />

                  </div>

                  <button
                    onClick={saveEvent}
                    className="
                      mt-4
                      bg-blue-600
                      text-white
                      px-6
                      py-3
                      rounded-xl
                    "
                  >
                    Agregar Evento
                  </button>

                  <div className="mt-6 space-y-2">

                        {events.length === 0 && (

                          <div
                            className="
                              bg-gray-100
                              p-4
                              rounded-xl
                            "
                          >
                            No hay eventos cargados
                          </div>

                        )}

                        {events.map(
                          (event: any) => (

                            <div
                              key={event.id}
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

                                {getEventIcon(
                                  event.event_type
                                )}

                                {" "}

                                {
                                  event.player
                                    ? `${event.player.name} ${event.player.lastname}`
                                    : event.player_name
                                }

                                {" - "}

                                {
                                  getEventLabel(
                                    event.event_type
                                  )
                                }

                                {" "}

                                ({event.minute}')

                              </div>

                              <div className="flex gap-2">

                                <button
                                  onClick={() =>
                                    editEvent(event)
                                  }
                                  className="
                                    bg-yellow-500
                                    text-white
                                    px-3
                                    py-1
                                    rounded-lg
                                  "
                                >
                                  ✏️
                                </button>

                                <button
                                  onClick={() =>
                                    removeEvent(
                                      event.id
                                    )
                                  }
                                  className="
                                    bg-red-600
                                    text-white
                                    px-3
                                    py-1
                                    rounded-lg
                                  "
                                >
                                  🗑️
                                </button>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                                    </div>
                                  </div>
                                
                              )
                            }

                          </div>

                        
                      )
                    }

export default Partidos