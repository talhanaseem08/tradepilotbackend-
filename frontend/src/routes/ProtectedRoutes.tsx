import { getSessionToken } from "@/lib/auth"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = () => {
  if (!getSessionToken()) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
