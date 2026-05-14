import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  Trophy,
} from "lucide-react"

import { NavLink } from "react-router-dom"

import { useAuth } from "../auth/AuthContext"

function Sidebar() {

  const { logout } = useAuth()

  const menu = [

    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Equipos",
      path: "/equipos",
      icon: Trophy,
    },

    {
      name: "Jugadores",
      path: "/jugadores",
      icon: Users,
    },

    {
      name: "Solicitudes",
      path: "/solicitudes",
      icon: ClipboardList,
    },

    {
      name: "Formación",
      path: "/formacion",
      icon: ShieldCheck,
    },

    {
      name: "Estadísticas",
      path: "/estadisticas",
      icon: BarChart3,
    },
  ]

  return (

    <aside
      className="
        w-72
        min-h-screen
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        justify-between
        px-5
        py-6
      "
    >

      <div>

        <div className="mb-10">

          <h1
            className="
              text-2xl
              font-bold
              text-black
              tracking-tight
            "
          >
            ⚽ Futbol Manager
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Panel administrativo
          </p>

        </div>

        <nav className="flex flex-col gap-2">

          {
            menu.map((item) => {

              const Icon = item.icon

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-black
                            text-white
                            shadow-sm
                          `
                          : `
                            text-gray-600
                            hover:bg-gray-100
                            hover:text-black
                          `
                      }
                    `
                  }
                >

                  <Icon size={18} />

                  {item.name}

                </NavLink>
              )
            })
          }

        </nav>

      </div>

      <button
        onClick={logout}
        className="
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          text-red-500
          hover:bg-red-50
          transition
        "
      >

        <LogOut size={18} />

        Cerrar sesión

      </button>

    </aside>
  )
}

export default Sidebar