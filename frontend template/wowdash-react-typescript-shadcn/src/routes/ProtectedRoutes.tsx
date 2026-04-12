import { getSessionToken } from "@/lib/auth"
import { Navigate, Outlet } from "react-router-dom"

/** App shell: require gateway JWT (same storage keys as TradePilot main app). */
const ProtectedRoutes = () => {
  if (!getSessionToken()) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
