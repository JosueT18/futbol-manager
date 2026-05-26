import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

const AuthContext =
  createContext<any>(null)

export function AuthProvider({
  children,
}: any) {

  const [user, setUser] =
    useState<any>(null)

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

        logout()
      }
    }

  }, [])

  // =========================
  // LOGIN
  // =========================
  function login(
    data: any
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

    setToken(
      data.access_token
    )

    setUser(data.user)
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {

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

    setToken("")

    setUser(null)
  }

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

export function useAuth() {

  return useContext(
    AuthContext
  )
}