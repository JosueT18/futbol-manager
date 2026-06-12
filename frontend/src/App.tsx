import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Equipos from "./pages/Equipos"
import Jugadores from "./pages/Jugadores"
import Solicitudes from "./pages/Solicitudes"
import Formacion from "./pages/Formacion"
import Partidos from "./pages/Partidos"
import Estadisticas from "./pages/Estadisticas"
import Login from "./pages/Login"

import {
  useAuth,
} from "./auth/AuthContext"

import TablaPosiciones from "./pages/TablaPosiciones"
import Dashboard from "./pages/Dashboard"

function App() {

  const {
    user,
  } = useAuth()

  // =========================
  // NO LOGIN
  // =========================
  if (!user) {

    return <Login />
  }

  // =========================
  // ROLE
  // =========================
  const role =
    user.role || ""

  const isAdmin =
    role === "Administrador"

  const isDirector =
    role === "Director"

  const isCommission =
    role === "Comision"

  const isPlayer =
    role === "Jugador"

  // =========================
  // ACCESS
  // =========================
  const canViewSolicitudes =
    isAdmin ||
    isDirector ||
    isCommission

  const canViewFormacion =
    isAdmin ||
    isDirector||
    isCommission ||
    isPlayer

  const canViewEstadisticas =
    isAdmin ||
    isDirector ||
    isCommission ||
    isPlayer

  const canViewPartidos =
    true

  const canViewJugadores =
    true

  const canViewEquipos =
    true

  // =========================
  // APP
  // =========================
  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1">

        <Routes>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* EQUIPOS */}
          <Route
            path="/equipos"
            element={
              canViewEquipos
                ? <Equipos />
                : <Navigate to="/" />
            }
          />

          {/* JUGADORES */}
          <Route
            path="/jugadores"
            element={
              canViewJugadores
                ? <Jugadores />
                : <Navigate to="/" />
            }
          />

          {/* SOLICITUDES */}
          <Route
            path="/solicitudes"
            element={
              canViewSolicitudes
                ? <Solicitudes />
                : <Navigate to="/" />
            }
          />

          {/* FORMACION */}
          <Route
            path="/formacion"
            element={
              canViewFormacion
                ? <Formacion />
                : <Navigate to="/" />
            }
          />

          {/* PARTIDOS */}
          <Route
            path="/partidos"
            element={
              canViewPartidos
                ? <Partidos />
                : <Navigate to="/" />
            }
          />

          {/* ESTADISTICAS */}
          <Route
            path="/estadisticas"
            element={
              canViewEstadisticas
                ? <Estadisticas />
                : <Navigate to="/" />
            }
          />

          {/* REDIRECT */}
          <Route
            path="*"
            element={
              <Navigate to="/" />
            }
          />

          <Route
            path="/tabla-posiciones"
            element={<TablaPosiciones />          
          }

          />          

        </Routes>

      </div>

    </div>
  )
}

export default App