import Sidebar from "./Sidebar"

function Layout({
  children,
}: any) {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">

        {children}

      </main>

    </div>
  )
}

export default Layout