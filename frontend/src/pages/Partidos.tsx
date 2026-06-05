import { useEffect, useState } from "react"

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
} from "../api/matchEvents"

function Partidos() {

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

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    loadTeams()

    loadMatches()

  }, [])

  useEffect(() => {

  if (showModal) {

    document.body.style.overflow = "hidden"

  } else {

    document.body.style.overflow = "auto"
  }

  return () => {

    document.body.style.overflow = "auto"
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

      if (Array.isArray(data)) {

        const sortedMatches =
          data.sort(
            (a: any, b: any) => {

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

        setMatches(sortedMatches)

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
        await getMatchEvents(matchId)

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

        stadium:
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

    setSelectedMatch(match)

    setEditHomeScore(
      match.home_score || 0
    )

    setEditAwayScore(
      match.away_score || 0
    )

    setEditStatus(
      match.status || "scheduled"
    )

    await loadEvents(match.id)

    setShowModal(true)
  }

  // =========================
  // SAVE RESULT
  // =========================
  async function saveResult() {

    if (!selectedMatch) return

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

  // =========================
  // PLAYERS
  // =========================
  const availablePlayers =
    teams
      .filter(
        (team: any) =>
          team.id === Number(eventTeamId)
      )
      .flatMap(
        (team: any) =>
          team.players || []
      )

  // =========================
  // ICONS
  // =========================
  function getEventIcon(
    type: string
  ) {

    if (type === "goal") {
      return "⚽"
    }

    if (type === "yellow_card") {
      return "🟨"
    }

    if (type === "red_card") {
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

    if (type === "yellow_card") {
      return "Amarilla"
    }

    if (type === "red_card") {
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

        </div>

        <button
          onClick={saveMatch}
          className="
            mt-5
            bg-black
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Guardar Partido
        </button>

      </Card>

      {/* FIXTURE */}
      <div className="mt-8 space-y-5">

        {
          matches.map(
            (match: any) => (

              <Card key={match.id}>

                <div className="flex justify-between">

                  <div>

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

                    {/* EVENTS */}
                    {
                      match.events &&
                      match.events.length > 0 && (

                        <div className="mt-4 space-y-2">

                          {
                            match.events.map(
                              (event: any) => (

                                <div
                                  key={event.id}
                                  className="
                                    bg-gray-100
                                    p-2
                                    rounded-lg
                                    text-sm
                                  "
                                >

                                  <span className="font-semibold">

                                    {
                                      getEventIcon(
                                        event.event_type
                                      )
                                    }

                                  </span>

                                  {" "}

                                  {
                                    event.player_name
                                  }

                                  {" · "}

                                  {
                                    getEventLabel(
                                      event.event_type
                                    )
                                  }

                                  {" · "}

                                  {
                                    event.minute
                                  }'

                                </div>
                              )
                            )
                          }

                        </div>
                      )
                    }

                  </div>

                  <div className="text-right">

                    {/* STATUS */}
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

                    {/* SCORE */}
                    {
                      match.status === "finished" && (

                        <div className="text-3xl font-bold mt-3">

                          {match.home_score}
                          {" - "}
                          {match.away_score}

                        </div>
                      )
                    }

                    <button
                      onClick={() =>
                        openEditModal(match)
                      }
                      className="
                        mt-4
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Editar
                    </button>

                  </div>

                </div>

              </Card>
            )
          )
        }

      </div>

      {/* MODAL */}
      {
        showModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              flex
              justify-center
              items-center
              z-50
            "
          >

            <div
             className="
               bg-white
                rounded-2xl
                w-full
                max-w-2xl
                max-h-[90vh]
                flex
                flex-col
                  "
                >

              <div
                className="
                  overflow-y-auto
                  p-6
                  flex-1
                "
              >

              <h2 className="text-2xl font-bold mb-5">
                Editar Partido
              </h2>

              <div className="grid grid-cols-2 gap-4">

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
                  "
                />

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
                  "
                />

              </div>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(
                    e.target.value
                  )
                }
                className="
                  mt-4
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

              {/* EVENTS */}
              <div className="mt-6 space-y-4">

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
                    w-full
                  "
                >

                  <option value="">
                    Equipo
                  </option>

                  <option
                    value={
                      selectedMatch?.home_team_id
                    }
                  >
                    Local
                  </option>

                  <option
                    value={
                      selectedMatch?.away_team_id
                    }
                  >
                    Visitante
                  </option>

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
                    w-full
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
                          {" "}
                          {player.lastname}
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
                    w-full
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
                    w-full
                  "
                />

                <button
                  type="button"
                  onClick={saveEvent}
                  className="
                    bg-purple-600
                    hover:bg-purple-700
                    text-white
                    px-4
                    py-3
                    rounded-xl
                  "
                >
                  Agregar evento
                </button>

              </div>

              {/* EVENT LIST */}
              <div className="mt-6 space-y-2">

                {
                  events.map(
                    (event: any) => (

                      <div
                        key={event.id}
                        className="
                          bg-gray-100
                          p-3
                          rounded-xl
                        "
                      >

                        {
                          getEventIcon(
                            event.event_type
                          )
                        }

                        {" "}

                        {
                          event.player?.name
                        }

                        {" "}

                        {
                          event.player?.lastname
                        }

                        {" · "}

                        {
                          event.minute
                        }'

                      </div>
                    )
                  )
                }

              </div>

            </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={saveResult}
                  className="
                    flex-1
                    bg-green-600
                    text-white
                    py-3
                    rounded-xl
                  "
                >
                  Guardar
                </button>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    flex-1
                    bg-gray-300
                    py-3
                    rounded-xl
                  "
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default Partidos