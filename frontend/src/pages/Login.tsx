import { useState } from "react"

import {
  loginUser,
} from "../api/auth"

import {
  useAuth,
} from "../auth/AuthContext"

function Login() {

  // =========================
  // STATES
  // =========================
  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  // =========================
  // AUTH
  // =========================
  const { login } =
    useAuth()

  // =========================
  // LOGIN
  // =========================
  async function handleLogin() {

    if (!email || !password) {

      setError(
        "Completa email y contraseña"
      )

      return
    }

    try {

      setLoading(true)

      setError("")

      const data =
        await loginUser({

          email,
          password,
        })

      // =========================
      // AUTH CONTEXT
      // =========================
      login(data)

      // =========================
      // REDIRECT
      // =========================
      window.location.href = "/"

    } catch (error: any) {

      console.error(error)

      setError(
        "Credenciales inválidas"
      )

    } finally {

      setLoading(false)
    }
  }

  // =========================
  // ENTER KEY
  // =========================
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {

    if (e.key === "Enter") {

      handleLogin()
    }
  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        px-4
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-3xl
          shadow-xl
          w-full
          max-w-md
        "
      >

        {/* TITLE */}
        <h1
          className="
            text-3xl
            font-bold
            mb-2
            text-center
          "
        >
          Login
        </h1>

        <p
          className="
            text-gray-500
            text-center
            mb-6
          "
        >
          Ingresá al sistema
        </p>

        {/* ERROR */}
        {
          error && (

            <div
              className="
                mb-4
                bg-red-100
                text-red-700
                p-3
                rounded-xl
                text-sm
              "
            >
              ❌ {error}
            </div>
          )
        }

        {/* FORM */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            onKeyDown={handleKeyDown}
            className="
              w-full
              border
              p-3
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            onKeyDown={handleKeyDown}
            className="
              w-full
              border
              p-3
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            mt-6
            bg-black
            hover:bg-gray-800
            disabled:bg-gray-400
            text-white
            py-3
            rounded-xl
            transition
            font-semibold
          "
        >

          {
            loading
              ? "Ingresando..."
              : "Ingresar"
          }

        </button>

      </div>

    </div>
  )
}

export default Login