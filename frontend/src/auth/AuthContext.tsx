import {
  createContext,
  useContext,
  useState
} from "react"

type AuthContextType = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("auth") === "true")

  const login = () => {

    localStorage.setItem("auth","true")

    setIsAuthenticated(true)
  }

  const logout = () => {

    localStorage.removeItem("auth")
    
    setIsAuthenticated(false)
  }

  return (

    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }

  return context
}