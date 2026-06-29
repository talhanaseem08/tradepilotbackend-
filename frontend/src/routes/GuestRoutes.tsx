import { getSessionToken } from "@/lib/auth"
import { Navigate, Outlet } from "react-router-dom"

const GuestRoutes = () => {
  if (getSessionToken()) {
    return <Navigate to="/app-entry" replace />
  }

  return <Outlet />
}

export default GuestRoutes
