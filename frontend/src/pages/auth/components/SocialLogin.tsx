import GoogleIcon from "@/assets/images/icons/google-icon.png"
import { Button } from "@/components/ui/button"
import {
  fetchAppEntryStatus,
  getApiErrorMessage,
  loginWithGoogleIdToken,
  setAuthenticatedSession,
} from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (resp: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number | boolean>
          ) => void
        }
      }
    }
  }
}

const GIS_SCRIPT = "https://accounts.google.com/gsi/client"
let googleAuthInFlight = false
let lastGoogleCredential: string | null = null

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${GIS_SCRIPT}"]`)) {
      resolve()
      return
    }
    const s = document.createElement("script")
    s.src = GIS_SCRIPT
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("Failed to load Google Sign-In"))
    document.body.appendChild(s)
  })
}

const googleButtonShellClass =
  "h-[52px] w-full rounded-lg border border-neutral-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-800"

type SocialLoginProps = {
  /** "signup" adjusts button label and success toast for the register page. */
  mode?: "signin" | "signup"
}

const SocialLogin = ({ mode = "signin" }: SocialLoginProps) => {
  const navigate = useNavigate()
  const [buttonHost, setButtonHost] = useState<HTMLDivElement | null>(null)
  const [gsiReady, setGsiReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
  const googleEnabled = import.meta.env.VITE_GOOGLE_SIGNIN_ENABLED !== "false"
  const authInFlightRef = useRef(false)

  const handleCredential = useCallback(
    async (credential: string) => {
      const normalizedCredential = credential.trim()
      if (!normalizedCredential) return
      if (
        (authInFlightRef.current || googleAuthInFlight) &&
        lastGoogleCredential === normalizedCredential
      ) {
        return
      }

      authInFlightRef.current = true
      googleAuthInFlight = true
      lastGoogleCredential = normalizedCredential
      setBusy(true)
      try {
        const result = await loginWithGoogleIdToken(normalizedCredential)
        if (!result.ok) {
          toast.error(getApiErrorMessage(result.body, "Google sign-in failed."))
          return
        }
        setAuthenticatedSession(result.data.token, result.data.user)
        toast.success(
          mode === "signup"
            ? "Signed up with Google."
            : "Signed in with Google."
        )
        if (mode === "signup") {
          navigate("/welcome", { replace: true })
          return
        }
        const entry = await fetchAppEntryStatus()
        navigate(entry.ok ? entry.data.nextPath : "/dashboard", {
          replace: true,
        })
      } finally {
        authInFlightRef.current = false
        googleAuthInFlight = false
        setBusy(false)
      }
    },
    [mode, navigate]
  )

  useEffect(() => {
    if (!googleEnabled || !clientId || !buttonHost) return

    let cancelled = false

    ;(async () => {
      try {
        await loadGisScript()
        if (cancelled || !buttonHost.isConnected || !window.google?.accounts?.id)
          return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => {
            if (resp?.credential) void handleCredential(resp.credential)
          },
          auto_select: false,
        })

        buttonHost.innerHTML = ""
        window.google.accounts.id.renderButton(buttonHost, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          locale: "en",
        })
        if (!cancelled) setGsiReady(true)
      } catch {
        if (!cancelled) toast.error("Could not load Google Sign-In.")
      }
    })()

    return () => {
      cancelled = true
      setGsiReady(false)
    }
  }, [clientId, googleEnabled, buttonHost, handleCredential])

  if (!googleEnabled || !clientId) {
    return (
      <div className="mt-8">
        <p className="text-muted-foreground mb-2 text-center text-sm">
          Google sign-in is unavailable for this local origin.
        </p>
        <Button
          type="button"
          variant="outline"
          className={`${googleButtonShellClass} pointer-events-none`}
          disabled
        >
          <img src={GoogleIcon} alt="" width={18} className="mr-2" />
          Google sign-in unavailable
        </Button>
      </div>
    )
  }

  return (
    <div className="relative mt-8">
      {busy ? (
        <div className="bg-background/80 absolute inset-0 z-30 flex items-center justify-center rounded-lg">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : null}

      {/* Match Sign In row height; same borders/colors as email fields. Google’s real control sits on top (invisible) so behavior stays correct; decoration is our Button below. */}
      <div className="relative h-[52px] w-full">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-stretch justify-center">
          <Button
            type="button"
            variant="outline"
            tabIndex={-1}
            className={`${googleButtonShellClass} w-full font-medium shadow-none ring-0`}
            aria-hidden
          >
            <img src={GoogleIcon} alt="" width={18} className="mr-2" />
            {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </Button>
        </div>
        <div
          ref={setButtonHost}
          className={`absolute inset-0 z-10 flex cursor-pointer items-stretch justify-stretch opacity-0 [&>div]:!h-full [&>div]:!w-full ${gsiReady ? "" : "pointer-events-none"}`}
          aria-label={
            mode === "signup" ? "Sign up with Google" : "Sign in with Google"
          }
        />
      </div>
    </div>
  )
}

export default SocialLogin
