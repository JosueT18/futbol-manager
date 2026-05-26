import { useEffect, useState } from "react"

import Card from "../components/ui/Card"

import {
  getTeams,
} from "../api/teams"

import {
  createMatch,
} from "../api/matches"


function Partidos() {

  // =========================
  // STATES
  // =========================
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

  const [message, setMessage] =
    useState("")


  // =========================
  // LOAD TEAMS
  // =========================
  useEffect(() => {

    loadTeams()

  }, [])


  async function loadTeams() {

    try {

      const data =
        await getTeams()

      if (Array.isArray(data)) {

        setTeams(data)

      } else {

        console.error(
          "Teams no es array",
          data
        )

        setTeams([])
      }

    } catch (error) {

      console.error(error)

      setTeams([])
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
      !stadium
    ) {

      setMessage(
        "Completa todos los campos"
      )

      return
    }

    if (
      homeTeamId === awayTeamId
    ) {

      setMessage(
        "Los equipos no pueden ser iguales"
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

        date,

        stadium,
      })

      setMessage(
        "Partido creado correctamente"
      )

      setHomeTeamId("")
      setAwayTeamId("")
      setDate("")
      setStadium("")

    } catch (error) {

      console.error(error)

      setMessage(
        "Error al crear partido"
      )

    } finally {

      setLoading(false)
    }
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
              p-3
              rounded-xl
            "
          >

            <option value="">
              Equipo local
            </option>

            {
              Array.isArray(teams)
              &&
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


          {/* VISITANTE */}
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
              Array.isArray(teams)
              &&
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


          {/* FECHA */}
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


          {/* ESTADIO */}
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


        {/* BUTTON */}
        <div className="mt-5">

          <button
            onClick={saveMatch}
            disabled={loading}
            className="
              bg-black
              hover:bg-gray-800
              text-white
              px-6
              py-3
              rounded-xl
              transition
            "
          >

            {
              loading
                ? "Guardando..."
                : "Crear Partido"
            }

          </button>

        </div>

      </Card>

    </div>
  )
}

export default Partidos