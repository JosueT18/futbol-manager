function Dashboard() {

  return (

    <div className="p-10 w-full">

      <h1 className="text-4xl font-bold mb-5">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">
            Equipos
          </h2>

          <p className="text-5xl mt-5 font-bold text-green-600">
            12
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">
            Jugadores
          </h2>

          <p className="text-5xl mt-5 font-bold text-blue-600">
            248
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">
            Partidos
          </h2>

          <p className="text-5xl mt-5 font-bold text-red-600">
            36
          </p>
        </div>

      </div>

    </div>
  )
}

export default Dashboard