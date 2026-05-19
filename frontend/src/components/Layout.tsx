import Sidebar from "./Sidebar"

function Layout({
  children,
}: any) {

  return (

    <div
      className="
        flex
        min-h-screen
        bg-gray-100
      "
    >

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1
          overflow-auto
          p-6
          md:p-8
        "
      >

        <div
          className="
            max-w-[1800px]
            mx-auto
          "
        >

          {children}

        </div>

      </main>

    </div>
  )
}

export default Layout