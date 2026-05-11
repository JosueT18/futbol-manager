import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  const [message, setMessage] = useState("")


  async function handleLogin() {

    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {

      login()

      setMessage("✅ Login correcto")

      setTimeout(() => {

        navigate("/")

      }, 1000)

    } else {

      setMessage("❌ Usuario o contraseña incorrectos")
    }
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800"
        >

          Ingresar

        </button>

        {
          message && (

            <p className="mt-5 text-center font-semibold">
              {message}
            </p>
          )
        }

      </div>

    </div>
  )
}

export default Login