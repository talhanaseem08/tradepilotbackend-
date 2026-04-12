import { getApiBaseUrl, getSessionToken } from "@/lib/auth"

/** NLP parse response (gateway → nlp-service `/parse`). */
export type ParseResult = {
  intent?: string | null
  risk_level?: string | null
  market?: string[]
  strategy_type?: string | null
  analysis_mode?: string | null
  symbol?: string | null
  timeframe?: string | null
  stop_loss_pips?: number | null
  take_profit_pips?: number | null
  confidence?: number | null
  raw_output?: string | null
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getSessionToken()
  const headers = new Headers(init.headers)
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }
  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json")
  }
  const base = getApiBaseUrl()
  return fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  })
}

/**
 * Sends the user prompt to the gateway → NLP service for structured extraction
 * (`POST /api/parse` → nlp `/parse`).
 */
function extractHttpErrorMessage(raw: Record<string, unknown>): string | undefined {
  const detail = raw.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0]
    if (first && typeof first === "object" && "msg" in first) {
      const m = (first as { msg?: unknown }).msg
      if (typeof m === "string") return m
    }
  }
  const err = raw.error
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === "string") return m
  }
  return undefined
}

export async function parsePrompt(
  prompt: string
): Promise<
  | { ok: true; data: ParseResult }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/parse", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const data = raw as ParseResult & Record<string, unknown>
    if (!res.ok) {
      const detail = extractHttpErrorMessage(raw)
      return {
        ok: false,
        status: res.status,
        message:
          detail ??
          (res.status === 401
            ? "Session expired — sign in again."
            : "Could not parse prompt."),
      }
    }
    return { ok: true, data }
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        "Network error — check that the gateway and NLP service are running.",
    }
  }
}

/** Strip heavy / redundant fields before `POST /api/bots/from-parse`. */
export function parseResultForBotApi(p: ParseResult): Record<string, unknown> {
  const o = { ...p } as Record<string, unknown>
  delete o.raw_output
  return o
}

export type BotFromParseResponse = {
  id: string
  bot_type: string
  symbol: string
  market: string
  timeframe: string
  parameters: Record<string, unknown>
  status: string
}

/** Gateway → trading `POST /bots/from-parse` (injects `user_id`). */
export async function createBotFromParse(
  parse: ParseResult
): Promise<
  | { ok: true; data: BotFromParseResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/bots/from-parse", {
      method: "POST",
      body: JSON.stringify(parseResultForBotApi(parse)),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message:
          extractHttpErrorMessage(raw) ?? "Could not create bot from parse.",
      }
    }
    const data = raw as unknown as BotFromParseResponse
    if (!data.id || !data.bot_type) {
      return {
        ok: false,
        status: res.status,
        message: "Unexpected response when creating bot.",
      }
    }
    return { ok: true, data }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error — check that the gateway and trading service are running.",
    }
  }
}

export type CandlesApiResponse = {
  symbol: string
  timeframe: string
  count: number
  candles: Array<{
    open: number
    high: number
    low: number
    close: number
    volume?: number
    timestamp?: string
  }>
}

/** Gateway → trading `GET /data/candles/:symbol`. */
export async function fetchCandles(
  symbol: string,
  options: { market: string; timeframe: string; count?: number }
): Promise<
  | { ok: true; data: CandlesApiResponse }
  | { ok: false; status: number; message: string }
> {
  const count = options.count ?? 200
  const qs = new URLSearchParams({
    market: options.market,
    timeframe: options.timeframe,
    count: String(count),
  }).toString()
  try {
    const path = `/api/data/candles/${encodeURIComponent(symbol)}?${qs}`
    const res = await apiFetch(path, { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message:
          extractHttpErrorMessage(raw) ?? "Could not load candle data for backtest.",
      }
    }
    return { ok: true, data: raw as unknown as CandlesApiResponse }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error loading candles.",
    }
  }
}

export type BacktestApiResult = {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_profit_pct: number
  max_drawdown_pct: number
  sharpe_ratio: number
  profit_factor: number
}

/** Gateway → trading `POST /backtest`. */
export async function runBacktest(body: {
  bot_type: string
  symbol: string
  market: string
  timeframe: string
  parameters: Record<string, unknown>
  candles: CandlesApiResponse["candles"]
}): Promise<
  | { ok: true; data: BacktestApiResult }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/backtest", {
      method: "POST",
      body: JSON.stringify(body),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Backtest failed.",
      }
    }
    return { ok: true, data: raw as unknown as BacktestApiResult }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error during backtest.",
    }
  }
}

export type BacktestRunResponse = {
  candles: CandlesApiResponse
  backtest: BacktestApiResult
}

/**
 * Gateway loads candles from the trading service, then runs `/backtest` server-side
 * (`POST /api/backtest/run`) — same results as fetchCandles + runBacktest, one request.
 */
export async function runBacktestWithServerCandles(body: {
  bot_type: string
  symbol: string
  market: string
  timeframe: string
  parameters: Record<string, unknown>
  count?: number
}): Promise<
  | { ok: true; data: BacktestRunResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/backtest/run", {
      method: "POST",
      body: JSON.stringify(body),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message:
          extractHttpErrorMessage(raw) ??
          "Could not load market data or run backtest.",
      }
    }
    const candles = raw.candles as CandlesApiResponse | undefined
    const backtest = raw.backtest as BacktestApiResult | undefined
    if (!candles?.candles || !backtest) {
      return {
        ok: false,
        status: res.status,
        message: "Unexpected response from backtest run.",
      }
    }
    return { ok: true, data: { candles, backtest } }
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        "Network error — ensure the gateway and trading service are running.",
    }
  }
}
