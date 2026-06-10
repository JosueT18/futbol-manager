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

    // =========================
    // VALIDATION
    // =========================
    if (!email || !password) {

      setError(
        "Completa email y contraseña"
      )

      return
    }

    try {

      setLoading(true)

      setError("")

      // =========================
      // API LOGIN
      // =========================
      const data =
        await loginUser({

          email,
          password,
        })

      // =========================
      // USER
      // =========================
      const user =
        data.user || {}

      // =========================
      // SAVE AUTH CONTEXT
      // =========================
      login(data)

      // =========================
      // LOCAL STORAGE
      // =========================
      localStorage.setItem(
        "token",
        data.access_token || ""
      )

      localStorage.setItem(
        "role",
        data.user.role?.trim()
      )

      // =========================
      // TEAM ID
      // FUNDAMENTAL PARA ROLES
      // =========================
      localStorage.setItem(
        "team_id",
        String(
          user.team_id || ""
        )
      )

      localStorage.setItem(
        "user_name",
        user.name || ""
      )

      localStorage.setItem(
        "user_email",
        user.email || ""
      )

      localStorage.setItem(
        "user_id",
        String(
          user.id || ""
        )
      )

      // =========================
      // REDIRECT
      // =========================
      window.location.href = "/"

    } catch (error: any) {

      console.error(error)

      setError(

        error?.response?.data?.detail
        ||
        error?.message
        ||
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
        bg-gradient-to-br
        from-[#f3f4f6]
        via-[#e5e7eb]
        to-[#d1d5db]
        px-4
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-3xl
          shadow-2xl
          w-full
          max-w-md
          border
          border-gray-200
        "
      >

        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}
        <div className="text-center mb-8">

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-gradient-to-br
              from-emerald-400
              to-emerald-600
              flex
              items-center
              justify-center
              text-4xl
              shadow-xl
              shadow-emerald-500/30
              mb-5
            "
          >

            ⚽

          </div>

          <h1
            className="
              text-4xl
              font-black
              text-black
            "
          >
            Futbol Manager
          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Sistema profesional de gestión deportiva
          </p>

        </div>

        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}
        {
          error && (

            <div
              className="
                mb-5
                bg-red-100
                border
                border-red-200
                text-red-700
                p-4
                rounded-2xl
                text-sm
              "
            >
              ❌ {error}
            </div>
          )
        }

        {/* ========================= */}
        {/* FORM */}
        {/* ========================= */}
        <div className="space-y-5">

          {/* EMAIL */}
          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                mb-2
                text-gray-700
              "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="ejemplo@email.com"
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
                border-gray-300
                p-3
                rounded-xl
                outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                mb-2
                text-gray-700
              "
            >
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
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
                border-gray-300
                p-3
                rounded-xl
                outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />

          </div>

        </div>

        {/* ========================= */}
        {/* BUTTON */}
        {/* ========================= */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            mt-8
            bg-gradient-to-r
            from-black
            to-gray-900
            hover:from-gray-900
            hover:to-black
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            text-white
            py-3
            rounded-xl
            transition
            font-bold
            text-lg
            shadow-lg
          "
        >

          {
            loading
              ? "Ingresando..."
              : "Ingresar"
          }

        </button>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}
        <div className="mt-8 text-center">

          <p className="text-xs text-gray-400">
            Futbol Manager © 2026
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login