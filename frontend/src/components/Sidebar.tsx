import {
  Link,
  useLocation,
} from "react-router-dom"

import {
  Home,
  Shield,
  Users,
  ClipboardList,
  Trophy,
  BarChart3,
  LogOut,
  Calendar,
} from "lucide-react"

import {
  useAuth,
} from "../auth/AuthContext"

function Sidebar() {

  const location =
    useLocation()

  const {
    user,
    logout,
  } = useAuth()

  // =========================
  // MENU
  // =========================
  const menu = [

    {
      label: "Inicio",
      icon: Home,
      path: "/",
      roles: [
        "Administrador",
        "Director",
        "Comision",
        "Jugador",
      ],
    },

    {
      label: "Equipos",
      icon: Shield,
      path: "/equipos",
      roles: [
        "Administrador",
        "Director",
      ],
    },

    {
      label: "Jugadores",
      icon: Users,
      path: "/jugadores",
      roles: [
        "Administrador",
        "Director",
        "Comision",
        "Jugador",
      ],
    },

    {
      label: "Solicitudes",
      icon: ClipboardList,
      path: "/solicitudes",
      roles: [
        "Administrador",
        "Director",
        "Comision",
      ],
    },

    {
      label: "Formación",
      icon: Trophy,
      path: "/formacion",
      roles: [
        "Administrador",
        "Director",
        "Comision",
        "Jugador",
      ],
    },

    {
      label: "Partidos",
      icon: Calendar,
      path: "/partidos",
      roles: [
        "Administrador",
        "Director",
        "Comision",
      ],
    },

    {
      label: "Estadísticas",
      icon: BarChart3,
      path: "/estadisticas",
      roles: [
        "Administrador",
        "Director",
        "Comision",
        "Jugador",
      ],
    },
  ]

  return (

    <div
      className="
        w-[260px]
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        justify-between
        p-5
      "
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-2xl font-bold">
            Futbol Manager
          </h1>

          <p className="text-gray-400 text-sm mt-1">

            Rol:
            {" "}
            {user?.role || "Sin rol"}

          </p>

        </div>

        {/* MENU */}
        <div className="space-y-2">

          {
            menu
              .filter((item) =>

                item.roles.includes(
                  user?.role
                )
              )
              .map((item) => {

                const Icon =
                  item.icon

                const active =
                  location.pathname ===
                  item.path

                return (

                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      transition

                      ${
                        active
                          ? `
                            bg-white
                            text-black
                          `
                          : `
                            hover:bg-gray-800
                          `
                      }
                    `}
                  >

                    <Icon size={18} />

                    <span>
                      {item.label}
                    </span>

                  </Link>
                )
              })
          }

        </div>

      </div>

      {/* BOTTOM */}
      <button
        onClick={logout}
        className="
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          hover:bg-red-600
          transition
        "
      >

        <LogOut size={18} />

        <span>
          Cerrar sesión
        </span>

      </button>

    </div>
  )
}

export default Sidebar