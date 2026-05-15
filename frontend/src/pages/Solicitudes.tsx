import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useQuery, useQueryClient } from "@tanstack/react-query"

function Solicitudes() {

  const queryClient = useQueryClient()

  const [teams, setTeams] = useState([])

  // =========================
  // PLAYERS PENDING
  // =========================
  const {
    data: players = [],
    isLoading,
  } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {

      const response = await fetch(
        "http://127.0.0.1:8000/players"
      )

      const data = await response.json()

      // 🔥 SOLO PENDIENTES
      return data.filter(
        (player: any) =>
          player.status === "pending"
      )
    },
  })

  // =========================
  // LOAD TEAMS
  // =========================
  async function loadTeams() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/teams"
      )

      const data = await response.json()

      setTeams(data)

    } catch (error) {

      console.error(error)
    }
  }

  // =========================
  // APPROVE PLAYER
  // =========================
  async function approvePlayer(id: number) {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/players/${id}/approve`,
        {
          method: "PUT",
        }
      )

      if (!response.ok) {

        throw new Error(
          "Error al aprobar jugador"
        )
      }

      await Swal.fire({
        icon: "success",
        title: "Jugador aprobado",
        timer: 1500,
        showConfirmButton: false,
      })

      // 🔥 RECARGAR PLAYERS
      queryClient.invalidateQueries({
        queryKey: ["players"],
      })

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo aprobar",
      })
    }
  }

  // =========================
  // REJECT PLAYER
  // =========================
  async function rejectPlayer(id: number) {

    const result = await Swal.fire({
      title: "Motivo de rechazo",
      input: "text",
      inputPlaceholder:
        "Ingrese el motivo...",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
    })

    // 🔥 SI CANCELA
    if (!result.isConfirmed) {
      return
    }

    // 🔥 VALIDAR MOTIVO
    if (!result.value) {

      Swal.fire({
        icon: "warning",
        title: "Motivo requerido",
      })

      return
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/players/${id}/reject`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            reason: result.value,
          }),
        }
      )

      if (!response.ok) {

        throw new Error(
          "Error al rechazar"
        )
      }

      await Swal.fire({
        icon: "success",
        title: "Jugador rechazado",
        timer: 1500,
        showConfirmButton: false,
      })

      // 🔥 RECARGAR PLAYERS
      queryClient.invalidateQueries({
        queryKey: ["players"],
      })

    } catch (error) {

      console.error(error)

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo rechazar",
      })
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    loadTeams()

  }, [])

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Solicitudes de Jugadores
      </h1>

      {
        isLoading && (

          <div className="mb-5 bg-yellow-100 text-yellow-800 p-4 rounded-xl">

            ⏳ Cargando solicitudes...

          </div>
        )
      }

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {
          players.map((player: any) => {

            const team: any = teams.find(
              (t: any) =>
                t.id === player.team_id
            )

            return (

              <div
                key={player.id}
                className="
                  bg-white
                  p-6
                  rounded-2xl
                  shadow-lg
                  border border-gray-100
                "
              >

                <h2 className="text-2xl font-bold">

                  ⚽ {player.name}

                </h2>

                <p className="mt-3 text-gray-700">

                  🏃 {player.position}

                </p>

                <p className="mt-2 text-gray-700">

                  🛡️ {team?.name}

                </p>

                <p className="mt-4 font-bold text-yellow-600">

                  ⏳ Pendiente

                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      approvePlayer(player.id)
                    }
                    className="
                      bg-green-600
                      text-white
                      px-5
                      py-2
                      rounded-xl
                      hover:bg-green-700
                      transition
                    "
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() =>
                      rejectPlayer(player.id)
                    }
                    className="
                      bg-red-600
                      text-white
                      px-5
                      py-2
                      rounded-xl
                      hover:bg-red-700
                      transition
                    "
                  >
                    Rechazar
                  </button>

                </div>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default Solicitudes