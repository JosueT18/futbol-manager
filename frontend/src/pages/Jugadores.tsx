import { useEffect, useState } from "react"

function Jugadores() {

  const [name, setName] = useState("")

  const [age, setAge] = useState("")

  const [position, setPosition] = useState("")

  const [number, setNumber] = useState("")

  const [teamId, setTeamId] = useState("")

  const [players, setPlayers] = useState([])

  const [teams, setTeams] = useState([])


  async function loadPlayers() {

    const response = await fetch(
      "http://127.0.0.1:8000/players"
    )

    const data = await response.json()

    setPlayers(data)
  }

  async function deletePlayer(id: number) {

  const confirmDelete = window.confirm(
    "¿Eliminar jugador?"
  )

  if (!confirmDelete) {
    return
  }

  try {

    const response = await fetch(
    `http://127.0.0.1:8000/players/${id}`,
      {
        method: "DELETE",
      }
    )

    const data = await response.json()

    console.log(data)

    loadPlayers()

  } catch (error) {

    console.error(error)
  }
}

async function updatePlayer(player: any) {

  const newName = prompt(
    "Nuevo nombre",
    player.name
  )

  const newPosition = prompt(
    "Nueva posición",
    player.position
  )

  if (!newName || !newPosition) {
    return
  }

  try {

    const response = await fetch(
      `http://127.0.0.1:8000/players/${player.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: newName,
          position: newPosition,
        }),
      }
    )

    const data = await response.json()

    console.log(data)

    loadPlayers()

  } catch (error) {

    console.error(error)
  }
}


  async function loadTeams() {

    const response = await fetch(
      "http://127.0.0.1:8000/teams"
    )

    const data = await response.json()

    setTeams(data)
  }


  async function createPlayer() {

    await fetch(
      "http://127.0.0.1:8000/players",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          age: Number(age),
          position,
          number: Number(number),
          team_id: Number(teamId),
        }),
      }
    )

    setName("")

    setAge("")

    setPosition("")

    setNumber("")

    setTeamId("")

    loadPlayers()
  }


  useEffect(() => {

    loadPlayers()

    loadTeams()

  }, [])


  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Jugadores
      </h1>


      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Posición"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Número"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="border p-3 rounded-lg"
          >

            <option value="">
              Seleccionar equipo
            </option>

            {
              teams.map((team: any) => (

                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))
            }

          </select>

        </div>


        <button
          onClick={createPlayer}
          className="mt-5 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >

          Crear Jugador

        </button>

      </div>


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

                <button
                  onClick={() => updatePlayer(player)}
                  className="mt-5 mr-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                    Editar
                </button>

                <button
                  onClick={()=> deletePlayer(player.id)}
                  className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">
                    Eliminar
                </button>

                <p className="mt-2">
                  👕 #{player.number}
                </p>

                <p className="mt-2">
                  🎂 {player.age} años
                </p>

                <p className="mt-2">
                  🛡️ {team?.name}
                </p>

                <p className="mt-2 font-bold">
                  {
                    player.approved
                      ? "✅ Aprobado"
                      : "⏳ Pendiente aprobación"
                  }
                </p>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default Jugadores