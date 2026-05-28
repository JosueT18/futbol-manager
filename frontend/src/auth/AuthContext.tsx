import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import type {
  ReactNode,
} from "react"

// =========================
// TYPES
// =========================
interface User {

  id: number

  name: string

  email: string

  role: string

  team_id?: number | null
}

interface LoginData {

  access_token: string

  user: User
}

interface AuthContextType {

  user: User | null

  token: string

  login: (
    data: LoginData
  ) => void

  logout: () => void
}

// =========================
// CONTEXT
// =========================
const AuthContext =
  createContext<AuthContextType | null>(
    null
  )

// =========================
// PROVIDER
// =========================
export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  // =========================
  // STATES
  // =========================
  const [user, setUser] =
    useState<User | null>(null)

  const [token, setToken] =
    useState("")

  // =========================
  // LOAD STORAGE
  // =========================
  useEffect(() => {

    const storedToken =
      localStorage.getItem(
        "token"
      )

    const storedUser =
      localStorage.getItem(
        "user"
      )

    if (
      storedToken &&
      storedUser
    ) {

      try {

        const parsedUser =
          JSON.parse(storedUser)

        setToken(storedToken)

        setUser(parsedUser)

      } catch (error) {

        console.error(
          "Error parsing user:",
          error
        )

        clearStorage()
      }
    }

  }, [])

  // =========================
  // CLEAR STORAGE
  // =========================
  function clearStorage() {

    localStorage.removeItem(
      "token"
    )

    localStorage.removeItem(
      "user"
    )

    localStorage.removeItem(
      "role"
    )

    localStorage.removeItem(
      "user_name"
    )

    localStorage.removeItem(
      "user_email"
    )

    localStorage.removeItem(
      "user_id"
    )

    localStorage.removeItem(
      "team_id"
    )
  }

  // =========================
  // LOGIN
  // =========================
  function login(
    data: LoginData
  ) {

    // =========================
    // TOKEN
    // =========================
    localStorage.setItem(
      "token",
      data.access_token
    )

    // =========================
    // USER
    // =========================
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    )

    // =========================
    // ROLE
    // =========================
    localStorage.setItem(
      "role",
      data.user.role
    )

    // =========================
    // USER NAME
    // =========================
    localStorage.setItem(
      "user_name",
      data.user.name
    )

    // =========================
    // USER EMAIL
    // =========================
    localStorage.setItem(
      "user_email",
      data.user.email
    )

    // =========================
    // USER ID
    // =========================
    localStorage.setItem(
      "user_id",
      data.user.id.toString()
    )

    // =========================
    // TEAM ID
    // =========================
    if (
      data.user.team_id !== null &&
      data.user.team_id !== undefined
    ) {

      localStorage.setItem(
        "team_id",
        data.user.team_id.toString()
      )

    } else {

      localStorage.removeItem(
        "team_id"
      )
    }

    // =========================
    // STATES
    // =========================
    setToken(
      data.access_token
    )

    setUser(data.user)
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {

    clearStorage()

    setToken("")

    setUser(null)

    // =========================
    // REDIRECT
    // =========================
    window.location.href = "/"
  }

  // =========================
  // PROVIDER
  // =========================
  return (

    <AuthContext.Provider
      value={{

        user,

        token,

        login,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

// =========================
// HOOK
// =========================
export function useAuth() {

  const context =
    useContext(AuthContext)

  if (!context) {

    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    )
  }

  return context
}