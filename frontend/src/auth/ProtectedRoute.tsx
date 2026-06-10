import { Navigate } from "react-router-dom"

import { useAuth } from "./AuthContext"

function ProtectedRoute({
children,
}: {
children: React.ReactNode
}) {

const { token } = useAuth()

// Si no hay token -> login
if (!token) {

return <Navigate to="/login" replace />

}

return <>{children}</>
}

export default ProtectedRoute