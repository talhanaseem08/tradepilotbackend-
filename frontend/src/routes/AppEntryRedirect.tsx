import {
  clearSession,
  fetchAppEntryStatus,
  formatApiFailure,
} from "@/lib/auth"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function AppEntryRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const result = await fetchAppEntryStatus()
      if (cancelled) return

      if (!result.ok) {
        if (result.status === 401) {
          clearSession()
          navigate("/auth/login", { replace: true })
          return
        }

        toast.error(
          formatApiFailure(
            result.body,
            result.status,
            "Could not determine where to continue."
          )
        )
        navigate("/dashboard", { replace: true })
        return
      }

      navigate(result.data.nextPath, { replace: true })
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return <div className="min-h-screen bg-background" />
}

export default AppEntryRedirect
