const TOKEN_KEY = "tradepilot_token"
const USER_EMAIL_KEY = "tradepilot_user_email"
const USER_ID_KEY = "tradepilot_user_id"

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
  return "http://localhost:3001"
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

export type ApiErrorBody = {
  error?: { message?: string; correlationId?: string } | string
}

export function getApiErrorMessage(
  body: ApiErrorBody,
  fallback: string
): string {
  const e = body.error
  if (typeof e === "string") return e
  if (e && typeof e === "object" && typeof e.message === "string") {
    return e.message
  }
  return fallback
}

/** When the server returns no JSON message (e.g. 404 HTML), still show status or network hint. */
export function formatApiFailure(
  body: ApiErrorBody,
  status: number,
  fallback: string
): string {
  const msg = getApiErrorMessage(body, "")
  if (msg) return msg
  if (status === 0) {
    return "Network error — gateway unreachable. Start the gateway and ensure VITE_API_BASE_URL matches its port, or use the Vite /api proxy (see .env.example)."
  }
  return `${fallback} (HTTP ${status})`
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
        body: { error: { message: "Unexpected response from server" } },
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
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
        body: { error: { message: "Unexpected response from server" } },
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
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
        body: { error: { message: "Unexpected response from server" } },
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
        },
      },
    }
  }
}

export function setSessionToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function setSessionUserEmail(email: string): void {
  localStorage.setItem(USER_EMAIL_KEY, email)
}

export function setSessionUserId(id: string): void {
  localStorage.setItem(USER_ID_KEY, id)
}

export function getSessionToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSessionUserEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_KEY)
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY)
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
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
  localStorage.removeItem(USER_ID_KEY)
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
      body: { error: { message: "No session found." } },
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
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
      body: { error: { message: "No session found." } },
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
        },
      },
    }
  }
}

export async function forgotPasswordRequest(
  email: string
): Promise<
  | { ok: true; message: string; devHint?: string }
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
      devHint?: string
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

    const devHint =
      typeof raw.devHint === "string" ? raw.devHint : undefined

    return { ok: true, message, ...(devHint ? { devHint } : {}) }
  } catch {
    return {
      ok: false,
      status: 0,
      body: {
        error: {
          message:
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
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
            "Network error — check that the gateway is running and VITE_API_BASE_URL.",
        },
      },
    }
  }
}
