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
  // ROLE
  // =========================
  const role =
    user?.role || ""

  // =========================
  // MENU
  // =========================
  const menu = [

    // =========================
    // HOME
    // =========================
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

    // =========================
    // EQUIPOS
    // =========================
    {
      label: "Equipos",
      icon: Shield,
      path: "/equipos",
      roles: [
        "Administrador",
        "Director",
      ],
    },

    // =========================
    // JUGADORES
    // =========================
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

    // =========================
    // SOLICITUDES
    // =========================
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

    // =========================
    // FORMACION
    // =========================
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

    // =========================
    // PARTIDOS
    // =========================
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

    // =========================
    // ESTADISTICAS
    // =========================
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
            {role || "Sin rol"}

          </p>

          {
            user?.team_id && (

              <p className="text-gray-500 text-xs mt-1">
                Equipo ID:
                {" "}
                {user.team_id}
              </p>
            )
          }

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
                            shadow-lg
                          `
                          : `
                            hover:bg-gray-800
                          `
                      }
                    `}
                  >

                    <Icon size={18} />

                    <span className="font-medium">
                      {item.label}
                    </span>

                  </Link>
                )
              })
          }

        </div>

      </div>

      {/* USER INFO + LOGOUT */}
      <div className="space-y-4">

        {/* USER */}
        <div
          className="
            bg-gray-900
            rounded-2xl
            p-4
            border
            border-gray-800
          "
        >

          <p className="font-semibold">
            {user?.name || "Usuario"}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {user?.email}
          </p>

        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            w-full
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

    </div>
  )
}

export default Sidebar