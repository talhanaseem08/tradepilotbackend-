const TOKEN_KEY = "tradepilot_token"
const USER_EMAIL_KEY = "tradepilot_user_email"
const USER_ID_KEY = "tradepilot_user_id"
const SESSION_CHANGE_EVENT = "tradepilot-session-change"

/** Prefix for per-account backtest history in localStorage (see `getBacktestHistoryStorageKey`). */
export const BACKTEST_HISTORY_PREFIX = "tradepilot_backtest_history_v1"

/**
 * Base URL for gateway API. In dev, prefer same-origin + Vite proxy (see vite.config)
 * so `/api` hits the gateway without CORS/port mismatches.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw === "string" && raw.length > 0) {
    return raw.replace(/\/$/, "")
  }
  if (import.meta.env.DEV) {
    return ""
  }
  return ""
}

export type LoginSuccess = {
  token: string
  user: { id: string; email: string; role?: string }
}

export type RegisterSuccess = LoginSuccess & {
  apiKey?: string
}

export type AppEntryStatus = {
  onboardingCompleted: boolean
  onboardingCompletedAt?: string | null
  botCount: number
  nextPath: "/welcome" | "/prompt" | "/dashboard"
}

export type SessionUser = {
  id: string
  email: string
  role?: string
}

export type ApiErrorBody = {
  error?: { message?: string; correlationId?: string } | string
}

const DEFAULT_FRIENDLY_ERROR = "Something went wrong. Please try again."
const NETWORK_FRIENDLY_ERROR = "TradePilot is not reachable right now. Please try again."

function statusFriendlyMessage(status: number, fallback: string): string {
  if (status === 0) return NETWORK_FRIENDLY_ERROR
  if (status === 400 || status === 422) return "Some information is missing or invalid. Please check and try again."
  if (status === 401) return "Please sign in again."
  if (status === 403) return "You do not have permission to do that."
  if (status === 404) return "We could not find that page or item."
  if (status === 429) return "Too many attempts. Please wait a moment and try again."
  if (status >= 500) return "TradePilot is temporarily unavailable. Please try again in a moment."
  return fallback || DEFAULT_FRIENDLY_ERROR
}

export function sanitizeApiErrorMessage(
  message: string | undefined,
  status = 0,
  fallback = DEFAULT_FRIENDLY_ERROR
): string {
  const trimmed = (message || "").trim()
  if (!trimmed) return statusFriendlyMessage(status, fallback)
  const looksTechnical =
    /(traceback|stack|mongo|mongodb|mongoose|sql|select |insert |update |delete |ecconnrefused|enotfound|vite_|localhost|127\.0\.0\.1|http:\/\/|https:\/\/|node_modules|\.py|\.js|typeerror|referenceerror|validationerror|pydantic|ccxt|oanda request|binance verification|api key|secret|token|encryption_key|smtp_)/i.test(trimmed)
  if (looksTechnical) return statusFriendlyMessage(status, fallback)
  return trimmed
}

export function getApiErrorMessage(
  body: ApiErrorBody,
  fallback: string,
  status = 0
): string {
  const e = body.error
  if (typeof e === "string") return sanitizeApiErrorMessage(e, status, fallback)
  if (e && typeof e === "object" && typeof e.message === "string") {
    return sanitizeApiErrorMessage(e.message, status, fallback)
  }
  return fallback
}

/** When the server returns no JSON message (e.g. 404 HTML), still show status or network hint. */
export function formatApiFailure(
  body: ApiErrorBody,
  status: number,
  fallback: string
): string {
  const msg = getApiErrorMessage(body, "", status)
  if (msg) return msg
  return statusFriendlyMessage(status, fallback)
}

/** Normalize gateway / express-rate-limit error shapes so toast always gets a message. */
function normalizeApiErrorBody(raw: Record<string, unknown>): ApiErrorBody {
  const err = raw.error
  if (typeof err === "string") {
    return { error: { message: err } }
  }
  if (err && typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === "string") return { error: { message: m } }
  }
  if (typeof raw.message === "string") {
    return { error: { message: raw.message } }
  }
  return {}
}

async function readJsonBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function loginWithGoogleIdToken(
  idToken: string
): Promise<
  | { ok: true; data: LoginSuccess }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: idToken.trim() }),
    })

    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const body = raw as LoginSuccess & ApiErrorBody

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    if (!body.token || !body.user) {
      return {
        ok: false,
        status: res.status,
        body: { error: { message: "We could not complete that request. Please try again." } },
      }
    }

    return { ok: true, data: { token: body.token, user: body.user } }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function loginRequest(
  email: string,
  password: string
): Promise<
  | { ok: true; data: LoginSuccess }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const body = raw as LoginSuccess & ApiErrorBody

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    if (!body.token || !body.user) {
      return {
        ok: false,
        status: res.status,
        body: { error: { message: "We could not complete that request. Please try again." } },
      }
    }

    return { ok: true, data: { token: body.token, user: body.user } }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function registerRequest(
  email: string,
  password: string
): Promise<
  | { ok: true; data: RegisterSuccess }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    })

    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const body = raw as RegisterSuccess & ApiErrorBody

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    if (!body.token || !body.user) {
      return {
        ok: false,
        status: res.status,
        body: { error: { message: "We could not complete that request. Please try again." } },
      }
    }

    const apiKey =
      typeof raw.apiKey === "string" ? raw.apiKey : undefined

    return {
      ok: true,
      data: {
        token: body.token,
        user: body.user,
        apiKey,
      },
    }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export function setSessionToken(token: string): void {
  const normalized = token.trim()
  if (sessionStorage.getItem(TOKEN_KEY) === normalized) return
  sessionStorage.setItem(TOKEN_KEY, normalized)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function setSessionUserEmail(email: string): void {
  const normalized = email.trim().toLowerCase()
  if (sessionStorage.getItem(USER_EMAIL_KEY) === normalized) return
  sessionStorage.setItem(USER_EMAIL_KEY, normalized)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function setSessionUserId(id: string): void {
  const normalized = id.trim()
  if (sessionStorage.getItem(USER_ID_KEY) === normalized) return
  sessionStorage.setItem(USER_ID_KEY, normalized)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function setSessionUser(user: SessionUser): void {
  const normalizedId = user.id.trim()
  const normalizedEmail = user.email.trim().toLowerCase()
  const changed =
    sessionStorage.getItem(USER_ID_KEY) !== normalizedId ||
    sessionStorage.getItem(USER_EMAIL_KEY) !== normalizedEmail

  if (!changed) return

  sessionStorage.setItem(USER_ID_KEY, normalizedId)
  sessionStorage.setItem(USER_EMAIL_KEY, normalizedEmail)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function setAuthenticatedSession(token: string, user: SessionUser): void {
  const normalizedToken = token.trim()
  const normalizedId = user.id.trim()
  const normalizedEmail = user.email.trim().toLowerCase()
  const changed =
    sessionStorage.getItem(TOKEN_KEY) !== normalizedToken ||
    sessionStorage.getItem(USER_ID_KEY) !== normalizedId ||
    sessionStorage.getItem(USER_EMAIL_KEY) !== normalizedEmail

  if (!changed) return

  sessionStorage.setItem(TOKEN_KEY, normalizedToken)
  sessionStorage.setItem(USER_ID_KEY, normalizedId)
  sessionStorage.setItem(USER_EMAIL_KEY, normalizedEmail)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function getSessionToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getSessionUserEmail(): string | null {
  return sessionStorage.getItem(USER_EMAIL_KEY)
}

export function getSessionUserId(): string | null {
  return sessionStorage.getItem(USER_ID_KEY)
}

/**
 * localStorage key for backtest lab history — scoped to the logged-in user so
 * switching accounts on the same browser does not show another user's runs.
 */
export function getBacktestHistoryStorageKey(): string {
  const id = getSessionUserId()?.trim()
  const email = getSessionUserEmail()?.trim().toLowerCase()
  const scope = id || email
  if (!scope) return BACKTEST_HISTORY_PREFIX
  const safe = scope.replace(/[^a-zA-Z0-9@._-]/g, "_")
  return `${BACKTEST_HISTORY_PREFIX}__${safe}`
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_EMAIL_KEY)
  sessionStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
  localStorage.removeItem(USER_ID_KEY)
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function subscribeToSessionChanges(callback: () => void): () => void {
  const listener = () => callback()
  window.addEventListener("storage", listener)
  window.addEventListener(SESSION_CHANGE_EVENT, listener)
  return () => {
    window.removeEventListener("storage", listener)
    window.removeEventListener(SESSION_CHANGE_EVENT, listener)
  }
}

export async function fetchAppEntryStatus(): Promise<
  | { ok: true; data: AppEntryStatus }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const token = getSessionToken()
  if (!token) {
    return {
      ok: false,
      status: 401,
      body: { error: { message: "Please sign in to continue." } },
    }
  }

  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/app-entry`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const raw = (await readJsonBody(res)) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    return {
      ok: true,
      data: raw as unknown as AppEntryStatus,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function fetchSessionUser(): Promise<
  | { ok: true; data: SessionUser }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const token = getSessionToken()
  if (!token) {
    return {
      ok: false,
      status: 401,
      body: { error: { message: "Please sign in to continue." } },
    }
  }

  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const raw = (await readJsonBody(res)) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    const userRaw =
      raw.user && typeof raw.user === "object" && !Array.isArray(raw.user)
        ? (raw.user as Record<string, unknown>)
        : null

    const id = typeof userRaw?.id === "string" ? userRaw.id : ""
    const email = typeof userRaw?.email === "string" ? userRaw.email : ""
    const role = typeof userRaw?.role === "string" ? userRaw.role : undefined

    if (!id || !email) {
      return {
        ok: false,
        status: res.status,
        body: { error: { message: "We could not complete that request. Please try again." } },
      }
    }

    return {
      ok: true,
      data: {
        id,
        email,
        ...(role ? { role } : {}),
      },
    }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function completeOnboardingRequest(): Promise<
  | { ok: true; data: AppEntryStatus }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const token = getSessionToken()
  if (!token) {
    return {
      ok: false,
      status: 401,
      body: { error: { message: "Please sign in to continue." } },
    }
  }

  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/onboarding/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    const raw = (await readJsonBody(res)) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    return {
      ok: true,
      data: raw as unknown as AppEntryStatus,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function logoutRequest(): Promise<
  | { ok: true; message: string }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const token = getSessionToken()
  if (!token) {
    return { ok: true, message: "You are already signed out." }
  }

  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const raw = (await readJsonBody(res)) as Record<string, unknown> & {
      message?: string
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    return {
      ok: true,
      message:
        typeof raw.message === "string" ? raw.message : "Signed out successfully.",
    }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function forgotPasswordRequest(
  email: string
): Promise<
  | { ok: true; message: string }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
    const raw = (await readJsonBody(res)) as Record<string, unknown> & {
      message?: string
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    const message =
      typeof raw.message === "string"
        ? raw.message
        : "If an account exists for that email, a reset link has been sent."

    return { ok: true, message }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

export async function resetPasswordRequest(
  token: string,
  password: string
): Promise<
  | { ok: true; message: string }
  | { ok: false; status: number; body: ApiErrorBody }
> {
  const base = getApiBaseUrl()
  try {
    const res = await fetch(`${base}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim(), password }),
    })
    const raw = (await readJsonBody(res)) as Record<string, unknown> & {
      message?: string
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        body: normalizeApiErrorBody(raw),
      }
    }

    const message =
      typeof raw.message === "string"
        ? raw.message
        : "Password updated. You can sign in now."

    return { ok: true, message }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "TradePilot is not reachable right now. Please try again.",
        },
      },
    }
  }
}

