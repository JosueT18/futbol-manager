import Sidebar from "./Sidebar"

function Layout({
  children,
}: any) {

  return (

    <div
      className="
        flex
        flex-col
        md:flex-row
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
          min-w-0
          overflow-x-hidden
          overflow-auto
          p-3
          md:p-8
        "
      >

        <div
          className="
            w-full
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