import { useEffect, useState } from "react"

function Equipos() {

  const [name, setName] = useState("")

  const [city, setCity] = useState("")

  const [tecnico, setTecnico] = useState("")

  const [teams, setTeams] = useState([])


  async function loadTeams() {

    const response = await fetch(
      "http://127.0.0.1:8000/teams"
    )

    const data = await response.json()

    setTeams(data)
  }


  async function createTeam() {

    await fetch(
      "http://127.0.0.1:8000/teams",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          city,
          tecnico,
        }),
      }
    )

    setName("")

    setCity("")
    
    setTecnico("")

    loadTeams()
  }


  useEffect(() => {

    loadTeams()

  }, [])


  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Equipos
      </h1>


      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nombre del equipo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Director Técnico"
            value={tecnico}
            onChange={(e) => setTecnico(e.target.value)}
            className="border p-3 rounded-lg"
          />

        </div>

        <button
          onClick={createTeam}
          className="mt-5 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >

          Crear Equipo

        </button>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {
          teams.map((team: any) => (

            <div
              key={team.id}
              className="bg-white p-6 rounded-xl shadow-lg"
            >

              <h2 className="text-2xl font-bold">
                {team.name}
              </h2>

              <p className="text-gray-600 mt-2">
                📍 {team.city}
              </p>

              <p className="text-gray-600 mt-2">
                👔 {team.tecnico}
              </p>               
                              

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default Equipos