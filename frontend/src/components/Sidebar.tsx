import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  Trophy,
  ChevronRight,
  CalendarDays,
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
      name: "Partidos",
      path: "/partidos",
      icon: CalendarDays,
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
        shadow-sm
      "
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10">

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-xl
                shadow-sm
              "
            >
              ⚽
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-black
                  tracking-tight
                "
              >
                Futbol Manager
              </h1>

              <p className="text-sm text-gray-500">
                Panel administrativo
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}
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
                      group
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-2xl
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

                  {/* LEFT */}
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Icon size={18} />

                    {item.name}

                  </div>

                  {/* RIGHT ICON */}
                  <ChevronRight
                    size={16}
                    className="
                      opacity-0
                      group-hover:opacity-100
                      transition
                    "
                  />

                </NavLink>
              )
            })
          }

        </nav>

      </div>

      {/* FOOTER */}
      <div className="space-y-4">

        {/* USER BOX */}
        <div
          className="
            bg-gray-50
            border
            rounded-2xl
            p-4
          "
        >

          <p className="text-sm text-gray-500">
            Sesión activa
          </p>

          <p className="font-semibold mt-1">
            Administrador
          </p>

        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            px-4
            py-3
            rounded-2xl
            text-sm
            font-medium
            text-red-500
            hover:bg-red-50
            transition
            border
            border-red-100
          "
        >

          <LogOut size={18} />

          Cerrar sesión

        </button>

      </div>

    </aside>
  )
}

export default Sidebar