import Sidebar from "./Sidebar"

function Layout({
  children,
}: any) {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Futbol Manager
          </h1>

          <p className="text-gray-500 mt-1">
            Sistema de gestión deportiva
          </p>

        </div>

        {children}

      </main>

    </div>
  )
}

export default Layout