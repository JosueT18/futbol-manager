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
        "Comision",
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
        "Jugador",
      ],
    },

    {
      label: "Tabla",
      icon: Trophy,
      path: "/tabla-posiciones",
      roles: [
        "Administrador",
        "Director",
        "Comision",        
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
      ],
    },
  ]

  return (

    <div
      className="
        w-[290px]
        h-screen
        sticky
        top-0
        bg-gradient-to-b
        from-[#0f1720]
        via-[#131d2b]
        to-[#0a1018]
        border-r
        border-[#223043]
        text-white
        flex
        flex-col
        px-5
        py-6
        shadow-2xl
      "
    >

      {/* ========================= */}
      {/* LOGO */}
      {/* ========================= */}
      <div className="mb-8">

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-3xl
              bg-gradient-to-br
              from-emerald-400
              to-emerald-600
              flex
              items-center
              justify-center
              shadow-xl
              shadow-emerald-500/40
              text-2xl
            "
          >
            ⚽
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-black
                tracking-tight
              "
            >
              Futbol Manager
            </h1>

            <p
              className="
                text-sm
                text-zinc-400
                mt-1
              "
            >
              League Professional Suite
            </p>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* USER */}
      {/* ========================= */}
      <div
        className="
          bg-[#18222f]
          border
          border-[#253041]
          rounded-3xl
          p-4
          shadow-xl
          mb-6
        "
      >

        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-emerald-400
              to-emerald-600
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

          {/* INFO */}
          <div className="overflow-hidden flex-1">

            <p
              className="
                font-bold
                text-lg
                truncate
              "
            >
              {user?.name}
            </p>

            <p
              className="
                text-sm
                text-zinc-400
                truncate
              "
            >
              {user?.email}
            </p>

            <div
              className="
                mt-2
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                bg-emerald-500/20
                border
                border-emerald-500/30
                text-emerald-400
                text-xs
                font-bold
              "
            >
              {role}
            </div>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* MENU */}
      {/* ========================= */}
      <div
        className="
          flex-1
          overflow-y-auto
          pr-2
          space-y-2

          scrollbar-thin
          scrollbar-thumb-[#2d425d]
          scrollbar-track-transparent

          hover:scrollbar-thumb-[#3d5b80]
        "
      >

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
                    overflow-hidden

                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-emerald-500
                          to-emerald-600
                          text-white
                          shadow-lg
                          shadow-emerald-500/30
                          scale-[1.02]
                        `
                        : `
                          hover:bg-[#1b2635]
                          hover:text-white
                          text-zinc-300
                        `
                    }
                  `}
                >

                  {/* ACTIVE BAR */}
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

                  {/* ICON */}
                  <Icon
                    size={21}
                    className="
                      transition-all
                      duration-300
                      group-hover:scale-110
                    "
                  />

                  {/* LABEL */}
                  <span
                    className="
                      font-semibold
                      text-[15px]
                    "
                  >
                    {item.label}
                  </span>

                </Link>
              )
            })
        }

      </div>

      {/* ========================= */}
      {/* LOGOUT */}
      {/* ========================= */}
      <div className="pt-5">

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
            bg-gradient-to-r
            from-red-500
            to-red-600
            hover:from-red-600
            hover:to-red-700
            transition-all
            duration-300
            font-semibold
            shadow-lg
            shadow-red-500/20
            hover:scale-[1.02]
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