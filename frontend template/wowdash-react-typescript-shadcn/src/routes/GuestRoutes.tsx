import { getSessionToken } from "@/lib/auth"
import { Navigate, Outlet } from "react-router-dom"

/** Auth pages: redirect to app when a gateway JWT is already stored. */
const GuestRoutes = () => {
  if (getSessionToken()) {
    return <Navigate to="/app-entry" replace />
  }

  return <Outlet />
}

export default GuestRoutes
