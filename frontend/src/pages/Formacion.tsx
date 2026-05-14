import { useEffect, useState } from "react"

function Formacion() {

  const [players, setPlayers] = useState([])

  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])


  async function loadPlayers() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/players"
      )

      const data = await response.json()

      const approvedPlayers = data.filter(
        (player: any) => player.approved === true
      )

      setPlayers(approvedPlayers)

    } catch (error) {

      console.error(error)
    }
  }


  function togglePlayer(id: number) {

    if (selectedPlayers.includes(id)) {

      setSelectedPlayers(
        selectedPlayers.filter(
          playerId => playerId !== id
        )
      )

    } else {

      setSelectedPlayers([
        ...selectedPlayers,
        id
      ])
    }
  }

  async function saveFormation() {

  try {

    for (const playerId of selectedPlayers) {

      await fetch(
        "http://127.0.0.1:8000/formation-players",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            formation_id: 1,

            player_id: playerId,

            is_starter: true,

            position: "Titular"
          }),
        }
      )
    }

    alert("Formación guardada")

  } catch (error) {

    console.error(error)
  }
}


  useEffect(() => {

    loadPlayers()

  }, [])


  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Formación
      </h1>

      <button
      onClick={saveFormation}
        className="mb-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Guardar Formacion
        </button>  

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {
          players.map((player: any) => (

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
                onClick={() => togglePlayer(player.id)}
                className={`mt-5 px-5 py-2 rounded-lg text-white ${
                  selectedPlayers.includes(player.id)
                    ? "bg-green-600"
                    : "bg-gray-500"
                }`}
              >

                {
                  selectedPlayers.includes(player.id)
                    ? "Titular"
                    : "Suplente"
                }

              </button>

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default Formacion