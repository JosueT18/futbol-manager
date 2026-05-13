import {
  Home,
  Users,
  Shield,
  BarChart3,
  LogIn,
  ClipboardList
} from "lucide-react"

import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

function Sidebar() {

  const { logout } = useAuth()

  return (

    <div className="w-64 h-screen bg-black text-white p-5">

      <h1 className="text-3xl font-bold mb-10">
        ⚽ Futbol Manager
      </h1>

      <nav className="flex flex-col gap-5 text-lg">

  <Link
    to="/"
    className="flex items-center gap-3 hover:text-green-400 transition"
  >
    <Home />
    Inicio
  </Link>

  <Link
    to="/jugadores"
    className="flex items-center gap-3 hover:text-green-400 transition"
  >
    <Users />
    Jugadores
  </Link>

  <Link
    to="/equipos"
    className="flex items-center gap-3 hover:text-green-400 transition"
  >
    <Shield />
    Equipos
  </Link>

  <Link
    to="/estadisticas"
    className="flex items-center gap-3 hover:text-green-400 transition"
  >
    <BarChart3 />
    Estadísticas
  </Link>

  <Link
    to="/solicitudes"
    className="flex items-center gap-3
    hover:text-green-400 transition"
  >
    <ClipboardList />
    Solicitudes
  </Link>

  <Link
    to="/login"
    className="flex items-center gap-3 hover:text-green-400 transition"
  >
    <LogIn />
    Login
  </Link>

  <button 
   onClick={logout}
   className="flex items-center gap-3 hover:text-red-400 transition">
     Salir
   </button>

</nav>

    </div>
  )
}

export default Sidebar