import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from "./pages/Home"
import Equipos from "./pages/Equipos"
import Jugadores from "./pages/Jugadores"
import Estadisticas from "./pages/Estadisticas"
import Login from "./pages/Login"
import Solicitudes from "./pages/Solicitudes"
import Formacion from "./pages/Formacion"

import Layout from "./components/Layout"

import {
  AuthProvider,
  useAuth
} from "./auth/AuthContext"

import ProtectedRoute from "./auth/ProtectedRoute"


function AppContent() {

  const { isAuthenticated } = useAuth()

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>

              <Layout>
                <Home />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/equipos"
          element={
            <ProtectedRoute>

              <Layout>
                <Equipos />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/jugadores"
          element={
            <ProtectedRoute>

              <Layout>
                <Jugadores />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/formacion"
          element={
            <ProtectedRoute>

              <Layout>
                <Formacion />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute>

              <Layout>
                <Estadisticas />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute>

              <Layout>
                <Solicitudes />
              </Layout>

            </ProtectedRoute>
          }
        />

      </Routes>

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