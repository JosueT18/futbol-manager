import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Home from "./pages/Home"
import Equipos from "./pages/Equipos"
import Jugadores from "./pages/Jugadores"
import Estadisticas from "./pages/Estadisticas"
import Login from "./pages/Login"
import Solicitudes from "./pages/Solicitudes"

import {
  AuthProvider,
  useAuth
} from "./auth/AuthContext"

import ProtectedRoute from "./auth/ProtectedRoute"


function AppContent() {

  const { isAuthenticated } = useAuth()

  return (

    <BrowserRouter>

      <div className="flex">

        {
          isAuthenticated && <Sidebar />
        }

        <div className="flex-1">

          <Routes>

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/equipos"
              element={
                <ProtectedRoute>
                  <Equipos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jugadores"
              element={
                <ProtectedRoute>
                  <Jugadores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/estadisticas"
              element={
                <ProtectedRoute>
                  <Estadisticas />
                </ProtectedRoute>
              }
            />

            <Route
              path="/solicitudes"
              element={
                <ProtectedRoute>
                  <Solicitudes />
                </ProtectedRoute>
              }
            />
            
          </Routes>

        </div>

      </div>

    </BrowserRouter>
  )
}


function App() {

  return (

    <AuthProvider>

      <AppContent />

    </AuthProvider>
  )
}

export default App