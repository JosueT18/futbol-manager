import { useEffect, useState } from "react"

function Solicitudes() {

  const [players, setPlayers] = useState([])

  const [teams, setTeams] = useState([])


  async function loadPlayers() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/players"
      )

      const data = await response.json()

      const pendingPlayers = data.filter(
        (player: any) => player.approved === false
      )

      setPlayers(pendingPlayers)

    } catch (error) {

      console.error(error)
    }
  }


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


  async function approvePlayer(id: number) {

    try {

      const response = await fetch(
      `http://127.0.0.1:8000/players/${id}/approve`,
        {
          method: "PUT",
        }
      )

      const data = await response.json()

      console.log(data)

      loadPlayers()

    } catch (error) {

      console.error(error)
    }
  }


  useEffect(() => {

    loadPlayers()

    loadTeams()

  }, [])


  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Solicitudes de Jugadores
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {
          players.map((player: any) => {

            const team: any = teams.find(
              (t: any) => t.id === player.team_id
            )

            return (

              <div
                key={player.id}
                className="bg-white p-6 rounded-xl shadow-lg"
              >

                <h2 className="text-2xl font-bold">
                  ⚽ {player.name}
                </h2>

                <p className="mt-2">
                  🏃 {player.position}
                </p>

                <p className="mt-2">
                  🛡️ {team?.name}
                </p>

                <p className="mt-2 font-bold text-yellow-600">
                  ⏳ Pendiente
                </p>

                <button
                  onClick={() => approvePlayer(player.id)}
                  className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >

                  Aprobar

                </button>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default Solicitudes