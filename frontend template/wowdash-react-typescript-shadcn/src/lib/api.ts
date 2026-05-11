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
  if (typeof raw.message === "string") return raw.message
  return undefined
}

/** Parse JSON body; on failure return empty object and optional raw text for diagnostics. */
async function readJsonOrEmpty(res: Response): Promise<{
  raw: Record<string, unknown>
  textFallback: string | undefined
}> {
  const text = await res.text()
  if (!text.trim()) return { raw: {}, textFallback: undefined }
  try {
    const parsed = JSON.parse(text) as unknown
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { raw: parsed as Record<string, unknown>, textFallback: undefined }
    }
  } catch {
    /* non-JSON body */
  }
  const snippet = text.length > 400 ? `${text.slice(0, 400)}…` : text
  return { raw: {}, textFallback: snippet }
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

export type BrokerPlatform = "oanda" | "binance"
export type BrokerAccountMode = "demo" | "live"
export type BrokerAccountSummary = {
  brokerName: BrokerPlatform
  isVerified: boolean
  lastVerified?: string
  accountId?: string
  environment?: string
  isTestnet?: boolean
}

export type BrokerAccountsMap = Partial<
  Record<BrokerPlatform, BrokerAccountSummary>
>

export async function fetchBrokerAccounts(): Promise<
  | { ok: true; data: BrokerAccountsMap }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/broker/accounts", { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message:
          extractHttpErrorMessage(raw) ?? "Could not load broker accounts.",
      }
    }

    const accounts =
      raw.accounts && typeof raw.accounts === "object" && !Array.isArray(raw.accounts)
        ? (raw.accounts as BrokerAccountsMap)
        : {}

    return { ok: true, data: accounts }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error while loading broker accounts.",
    }
  }
}

export async function connectBrokerAccount(body: {
  brokerName: BrokerPlatform
  accountMode: BrokerAccountMode
  apiKey: string
  secretKey?: string
  accountId?: string
}): Promise<
  | { ok: true; message: string }
  | { ok: false; status: number; message: string }
> {
  const path =
    body.brokerName === "oanda"
      ? "/api/broker/oanda/setup"
      : "/api/broker/binance/setup"

  const payload =
    body.brokerName === "oanda"
      ? {
          apiKey: body.apiKey,
          accountId: body.accountId,
          environment: body.accountMode === "live" ? "live" : "practice",
        }
      : {
          apiKey: body.apiKey,
          secretKey: body.secretKey,
          isTestnet: body.accountMode !== "live",
        }

  try {
    const res = await apiFetch(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      const details =
        typeof raw.details === "string"
          ? raw.details
          : extractHttpErrorMessage(raw)
      return {
        ok: false,
        status: res.status,
        message:
          details ??
          (typeof raw.error === "string"
            ? raw.error
            : "Could not connect broker account."),
      }
    }

    return {
      ok: true,
      message:
        typeof raw.message === "string"
          ? raw.message
          : "Broker account connected successfully.",
    }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error while connecting broker account.",
    }
  }
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

/** One simulated trade from `trading-service` `BacktestResult.trades`. */
export type BacktestTradeRow = {
  trade_no: number
  side: string
  entry_time: string
  exit_time: string
  entry_price: number
  exit_price: number
  stop_loss: number
  take_profit: number
  pnl_pct: number
  pnl_usd: number
  result: string
}

export type BacktestApiResult = {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_profit_pct: number
  total_pnl_usd: number
  gross_profit_usd: number
  gross_loss_usd: number
  max_drawdown_pct: number
  max_drawdown_usd: number
  sharpe_ratio: number
  profit_factor: number
  profit_factor_usd: number
  /** Present when the service returns full `BacktestResult` (e.g. script run). */
  trades?: BacktestTradeRow[]
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

export type AccountSummary = {
  currency: string
  balance: number
  nav: number
  unrealized_pl: number
  realized_pl: number
  margin_used: number
  margin_available: number
  open_trade_count: number
  open_position_count: number
  pending_order_count: number
}

/** Gateway → trading `GET /data/account`. */
export async function fetchAccountSummary(
  market: "forex" | "crypto" = "forex"
): Promise<
  | { ok: true; data: AccountSummary }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch(`/api/data/account?market=${market}`, {
      method: "GET",
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractHttpErrorMessage(raw) ?? "Could not load account data." }
    }
    return { ok: true, data: raw as unknown as AccountSummary }
  } catch {
    return { ok: false, status: 0, message: "Network error loading account summary." }
  }
}

export type OpenPosition = {
  id: string
  instrument: string
  price: number
  open_time: string
  current_units: number
  initial_units: number
  realized_pl: number
  unrealized_pl: number
  margin_used: number
  financing: number
  state: string
}

/** Gateway → trading `GET /data/open-positions`. */
export async function fetchOpenPositions(
  market: "forex" | "crypto" = "forex"
): Promise<
  | { ok: true; data: OpenPosition[] }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch(`/api/data/open-positions?market=${market}`, {
      method: "GET",
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractHttpErrorMessage(raw) ?? "Could not load open positions." }
    }
    return { ok: true, data: (raw.positions as OpenPosition[]) ?? [] }
  } catch {
    return { ok: false, status: 0, message: "Network error loading open positions." }
  }
}

/** Gateway → trading `POST /debug/execute` — runs one execution cycle for every active bot (real NLP + paper/live broker). */
export async function triggerExecutionCycle(): Promise<
  | { ok: true; data: { status: string } }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/trading/debug/execute", {
      method: "POST",
      body: JSON.stringify({}),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Execution cycle failed.",
      }
    }
    return { ok: true, data: raw as unknown as { status: string } }
  } catch {
    return { ok: false, status: 0, message: "Network error triggering execution cycle." }
  }
}

export async function triggerOandaTestExecution(): Promise<
  | {
      ok: true
      data: {
        status: string
        bot_id: string
        symbol: string
        order_id: string
        close_in_seconds: number
        volume: number
        broker: string
        environment: string
      }
    }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/trading/debug/test-oanda-execute", {
      method: "POST",
      body: JSON.stringify({}),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "OANDA test execution failed.",
      }
    }
    return {
      ok: true,
      data: raw as unknown as {
        status: string
        bot_id: string
        symbol: string
        order_id: string
        close_in_seconds: number
        volume: number
        broker: string
        environment: string
      },
    }
  } catch {
    return { ok: false, status: 0, message: "Network error triggering OANDA test execution." }
  }
}

export async function triggerBinanceTestExecution(): Promise<
  | {
      ok: true
      data: {
        status: string
        bot_id: string
        symbol: string
        order_id: string
        close_in_seconds: number
        quantity: number
        notional_usdt: number
        broker: string
        environment: string
      }
    }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/trading/debug/test-binance-execute", {
      method: "POST",
      body: JSON.stringify({}),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Binance test execution failed.",
      }
    }
    return {
      ok: true,
      data: raw as unknown as {
        status: string
        bot_id: string
        symbol: string
        order_id: string
        close_in_seconds: number
        quantity: number
        notional_usdt: number
        broker: string
        environment: string
      },
    }
  } catch {
    return { ok: false, status: 0, message: "Network error triggering Binance test execution." }
  }
}

export type TradeRecord = {
  _id: string
  botID?: string
  userID?: string
  source?: string
  symbol: string
  direction?: string
  entry_price?: number
  exit_price?: number
  pnl?: number
  status?: string
  /** Closed time (or last update) — ISO */
  timestamp?: string
  /** When the trade was opened — ISO (optional; gateway may omit) */
  opened_at?: string
  /** When the trade was closed — ISO (optional) */
  closed_at?: string
  take_profit?: number
  stop_loss?: number
  lots?: number
  commission?: number
}

export type TradesResponse = {
  trades: TradeRecord[]
  total: number
  page: number
  limit: number
  pages: number
}

function coerceNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : undefined
  }
  if (v && typeof v === "object" && "$numberDecimal" in v) {
    const n = parseFloat(String((v as { $numberDecimal: string }).$numberDecimal))
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

function pickNum(row: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const n = coerceNumber(row[k])
    if (n !== undefined) return n
  }
  return undefined
}

function normalizeMongoId(v: unknown): string {
  if (typeof v === "string") return v
  if (v && typeof v === "object" && "$oid" in v) {
    const oid = (v as { $oid: unknown }).$oid
    if (typeof oid === "string") return oid
  }
  if (v != null) return String(v)
  return ""
}

function toIsoString(v: unknown): string | undefined {
  if (v == null) return undefined
  if (typeof v === "string") return v
  if (typeof v === "number") {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
  }
  return undefined
}

/**
 * Mongo `trade_records` use camelCase (`entryPrice`, `closedAt`). Normalize to `TradeRecord`
 * snake_case for UI and chart code.
 */
export function normalizeTradeRecord(row: Record<string, unknown>): TradeRecord {
  const id = normalizeMongoId(row._id)
  return {
    _id: id,
    botID: typeof row.botID === "string" ? row.botID : undefined,
    userID: typeof row.userID === "string" ? row.userID : undefined,
    source: typeof row.source === "string" ? row.source : undefined,
    symbol: String(row.symbol ?? ""),
    direction:
      typeof row.action === "string"
        ? row.action
        : typeof row.direction === "string"
          ? row.direction
          : undefined,
    entry_price: pickNum(row, "entry_price", "entryPrice"),
    exit_price: pickNum(row, "exit_price", "exitPrice"),
    pnl: pickNum(row, "pnl"),
    status: typeof row.status === "string" ? row.status : undefined,
    timestamp: toIsoString(row.timestamp),
    opened_at: toIsoString(row.openedAt ?? row.opened_at),
    closed_at: toIsoString(row.closedAt ?? row.closed_at),
    take_profit: pickNum(row, "take_profit", "takeProfit"),
    stop_loss: pickNum(row, "stop_loss", "stopLoss"),
    lots: pickNum(row, "lots", "volume"),
    commission: pickNum(row, "commission"),
  }
}

/** Gateway → trading `GET /trades`. */
export async function fetchTrades(params?: {
  bot_id?: string
  symbol?: string
  status?: string
  limit?: number
  page?: number
}): Promise<
  | { ok: true; data: TradesResponse }
  | { ok: false; status: number; message: string }
> {
  const qs = new URLSearchParams()
  if (params?.bot_id) qs.set("bot_id", params.bot_id)
  if (params?.symbol) qs.set("symbol", params.symbol)
  if (params?.status) qs.set("status", params.status)
  if (params?.limit) qs.set("limit", String(params.limit))
  if (params?.page) qs.set("page", String(params.page))
  try {
    const res = await apiFetch(`/api/trades?${qs.toString()}`, { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractHttpErrorMessage(raw) ?? "Could not load trades." }
    }
    const nested = raw.data && typeof raw.data === "object" && !Array.isArray(raw.data)
      ? (raw.data as Record<string, unknown>)
      : null
    const rawTrades = raw.trades ?? nested?.trades
    const list = Array.isArray(rawTrades) ? rawTrades : []
    const trades = list.map((item) => normalizeTradeRecord(item as Record<string, unknown>))
    const total = typeof raw.total === "number" ? raw.total : trades.length
    const page = typeof raw.page === "number" ? raw.page : 1
    const limit = typeof raw.limit === "number" ? raw.limit : trades.length
    const pages = typeof raw.pages === "number" ? raw.pages : 1
    return { ok: true, data: { trades, total, page, limit, pages } }
  } catch {
    return { ok: false, status: 0, message: "Network error loading trades." }
  }
}

export type BotSummary = {
  id: string
  bot_type: string
  symbol: string
  market: string
  timeframe: string
  status: string
  parameters: Record<string, unknown>
}

export type BotsResponse = {
  bots: BotSummary[]
  total: number
}

/**
 * Trading-service `GET /bots` returns Mongo `bot_instances` docs (`botID`, `strategyType`,
 * `assetPair`). Map to the shape the dashboard expects so UI code never sees undefined ids/types.
 */
function normalizeBotSummary(row: Record<string, unknown>): BotSummary | null {
  const id =
    (typeof row.id === "string" && row.id) ||
    (typeof row.botID === "string" && row.botID) ||
    (typeof row._id === "string" && row._id) ||
    ""
  if (!id) return null

  const bot_type =
    (typeof row.bot_type === "string" && row.bot_type) ||
    (typeof row.strategyType === "string" && row.strategyType) ||
    "unknown"

  const symbol =
    (typeof row.symbol === "string" && row.symbol) ||
    (typeof row.assetPair === "string" && row.assetPair) ||
    "—"

  const market = typeof row.market === "string" ? row.market : ""
  const timeframe = typeof row.timeframe === "string" ? row.timeframe : ""
  const status = typeof row.status === "string" ? row.status : "inactive"

  const parameters =
    row.parameters && typeof row.parameters === "object" && row.parameters !== null
      ? (row.parameters as Record<string, unknown>)
      : {}

  return { id, bot_type, symbol, market, timeframe, status, parameters }
}

/** Gateway → trading `GET /bots`. */
export async function fetchBots(): Promise<
  | { ok: true; data: BotsResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/bots", { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractHttpErrorMessage(raw) ?? "Could not load bots." }
    }
    const rawBots = raw.bots
    const list = Array.isArray(rawBots) ? rawBots : []
    const bots = list
      .map((item) => normalizeBotSummary(item as Record<string, unknown>))
      .filter((b): b is BotSummary => b !== null)
    const totalRaw = raw.total ?? raw.count
    const total = typeof totalRaw === "number" ? totalRaw : bots.length

    return { ok: true, data: { bots, total } }
  } catch {
    return { ok: false, status: 0, message: "Network error loading bots." }
  }
}

/** Status values accepted by trading-service `PATCH /bots/{id}/status`. */
export type BotLifecycleStatus = "active" | "paused" | "stopped"

/** Gateway → trading `PATCH /bots/:id/status`. */
export async function updateBotStatus(
  botId: string,
  status: BotLifecycleStatus
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  try {
    const res = await apiFetch(`/api/bots/${encodeURIComponent(botId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Could not update bot status.",
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, status: 0, message: "Network error updating bot status." }
  }
}

/** Script-style backtest (same as trading-service/scripts/backtest_*). */
export async function runScriptBacktest(body: {
  bot_type:
    | "low_risk"
    | "medium_risk"
    | "high_risk"
    | "crypto_low"
    | "crypto_medium"
    | "crypto_high"
  days?: number
  symbol?: string
}): Promise<
  | { ok: true; data: BacktestApiResult }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/backtest-script-run", {
      method: "POST",
      body: JSON.stringify(body),
    })
    const { raw, textFallback } = await readJsonOrEmpty(res)
    if (!res.ok) {
      const fromJson =
        extractHttpErrorMessage(raw) ??
        (textFallback ? `HTTP ${res.status}: ${textFallback}` : undefined)
      return {
        ok: false,
        status: res.status,
        message:
          fromJson ??
          `Request failed (HTTP ${res.status}). Check gateway and trading-service logs.`,
      }
    }
    return { ok: true, data: raw as unknown as BacktestApiResult }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error during script backtest.",
    }
  }
}

/** NLP `NewsItem` (Forex Factory & CoinTelegraph scrapers). */
export type NlpNewsItem = {
  title: string
  source: string
  symbol?: string | null
  published_at?: string | null
  url?: string | null
  impact?: string | null
}

export type ForexCalendarResponse = {
  source: string
  items: NlpNewsItem[]
  count?: number
}

export type ForexGuardAssistant = {
  summary: string
  pause_explanation: string
  ambiguous_events: string[]
  suggested_action: "none" | "monitor" | "wider_pause"
  suggested_pause_minutes: number
  suggested_block_until?: string | null
  confidence: number
}

export type ForexGuardStatus = {
  allowed: boolean
  reason?: string | null
  blocked_until?: string | null
  matched_events: string[]
  assistant?: ForexGuardAssistant | null
}

export type CryptoNewsResponse = {
  source: string
  articles: NlpNewsItem[]
  count?: number
}

/** Gateway → NLP `ForexFactoryScraper` via `GET /news/forex-calendar`. */
export async function fetchForexCalendar(): Promise<
  | { ok: true; data: ForexCalendarResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/news/forex-calendar", { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Could not load forex calendar.",
      }
    }
    return { ok: true, data: raw as unknown as ForexCalendarResponse }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error loading forex calendar.",
    }
  }
}

export async function fetchForexGuardStatus(body: {
  symbol: string
  market?: "forex"
  current_time?: string
  include_ai?: boolean
}): Promise<
  | { ok: true; data: ForexGuardStatus }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/agent/guard/forex", {
      method: "POST",
      body: JSON.stringify({
        symbol: body.symbol,
        market: body.market ?? "forex",
        current_time: body.current_time,
        include_ai: body.include_ai ?? true,
      }),
    })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Could not load forex guard status.",
      }
    }
    return { ok: true, data: raw as unknown as ForexGuardStatus }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error loading forex guard status.",
    }
  }
}

/** Gateway → NLP `CoinTelegraphScraper` via `GET /news/crypto`. */
export async function fetchCryptoNews(): Promise<
  | { ok: true; data: CryptoNewsResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await apiFetch("/api/news/crypto", { method: "GET" })
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractHttpErrorMessage(raw) ?? "Could not load crypto news.",
      }
    }
    return { ok: true, data: raw as unknown as CryptoNewsResponse }
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error loading crypto news.",
    }
  }
}
