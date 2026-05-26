import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Home from "./pages/Home"
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
  // APP
  // =========================
  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/equipos"
            element={<Equipos />}
          />

          <Route
            path="/jugadores"
            element={<Jugadores />}
          />

          <Route
            path="/solicitudes"
            element={<Solicitudes />}
          />

          <Route
            path="/formacion"
            element={<Formacion />}
          />

          <Route
            path="/partidos"
            element={<Partidos />}
          />

          <Route
            path="/estadisticas"
            element={<Estadisticas />}
          />

          {/* REDIRECT */}
          <Route
            path="*"
            element={
              <Navigate to="/" />
            }
          />

        </Routes>

      </div>

    </div>
  )
}

export default App