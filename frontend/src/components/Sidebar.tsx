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

  const role =
    user?.role || ""

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
        "Tecnico",
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
        "Tecnico",
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
        "Tecnico",
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
        "Tecnico",
      ],
    },

    {
      label: "Tabla",
      icon: Trophy,
      path: "/TablaPosiciones",
      roles: [
        "Administrador",
        "Director",
        "Comision",
        "Tecnico",
        "Jugador",
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
        "Tecnico",
      ],
    },
  ]

  return (

    <div
      className="
        w-[280px]
        min-h-screen
        bg-[#111827]
        border-r
        border-[#1f2937]
        text-white
        flex
        flex-col
        justify-between
        px-5
        py-6
        shadow-2xl
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
                bg-emerald-500
                flex
                items-center
                justify-center
                shadow-lg
                shadow-emerald-500/40
              "
            >

              ⚽

            </div>

            <div>

              <h1 className="text-2xl font-black">
                Futbol Manager
              </h1>

              <p className="text-xs text-zinc-400 mt-1">
                Professional League
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="space-y-2">

          {
            menu
              .filter((item) =>

                item.roles.includes(role)
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
                      group
                      relative
                      flex
                      items-center
                      gap-4
                      px-4
                      py-4
                      rounded-2xl
                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                            bg-emerald-500
                            text-white
                            shadow-lg
                            shadow-emerald-500/30
                          `
                          : `
                            hover:bg-[#1f2937]
                            text-zinc-300
                          `
                      }
                    `}
                  >

                    {/* ACTIVE LINE */}
                    {
                      active && (

                        <div
                          className="
                            absolute
                            left-0
                            top-2
                            bottom-2
                            w-1
                            rounded-r-full
                            bg-white
                          "
                        />
                      )
                    }

                    <Icon
                      size={20}
                      className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    <span className="font-semibold text-[15px]">
                      {item.label}
                    </span>

                  </Link>
                )
              })
          }

        </div>

      </div>

      {/* USER */}
      <div className="space-y-4">

        <div
          className="
            bg-[#18222f]
            border
            border-[#253041]
            rounded-3xl
            p-5
          "
        >

          <div className="flex items-center gap-4">

            {/* AVATAR */}
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-emerald-500
                flex
                items-center
                justify-center
                font-black
                text-xl
                shadow-lg
                shadow-emerald-500/30
              "
            >

              {
                user?.name?.charAt(0)
              }

            </div>

            <div>

              <p className="font-bold text-lg">
                {user?.name}
              </p>

              <p className="text-sm text-zinc-400">
                {user?.email}
              </p>

              <p className="text-xs text-emerald-400 mt-1">
                {role}
              </p>

            </div>

          </div>

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
            py-4
            rounded-2xl
            bg-red-500
            hover:bg-red-600
            transition-all
            duration-300
            font-semibold
            shadow-lg
            shadow-red-500/20
          "
        >

          <LogOut size={18} />

          <span>
            Cerrar sesión
          </span>

        </button>

      </div>

    </div>
  )
}

export default Sidebar