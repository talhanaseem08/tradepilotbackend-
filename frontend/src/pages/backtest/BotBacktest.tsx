import Breadcrumb from "@/layouts/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fetchBots,
  runScriptBacktest,
  type BacktestApiResult,
  type BacktestTradeRow,
  type BotSummary,
} from "@/lib/api"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import { filterBotsByMarket } from "@/lib/market"
import {
  getBacktestHistoryStorageKey,
  getSessionUserEmail,
  getSessionUserId,
} from "@/lib/auth"
import { ChevronDown, Download, Loader2, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const MAX_RUNS = 80
const DEFAULT_SCRIPT_DAYS = 30

export type SavedBacktestRun = {
  id: string
  at: string
  botId: string
  botType: string
  symbol: string
  mode: "server_candles" | "script_range"
  candleCount?: number
  scriptDays?: number
  result: BacktestApiResult
}

function loadRuns(): SavedBacktestRun[] {
  try {
    const raw = localStorage.getItem(getBacktestHistoryStorageKey())
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is SavedBacktestRun =>
        r &&
        typeof r === "object" &&
        typeof (r as SavedBacktestRun).id === "string" &&
        (r as SavedBacktestRun).result != null
    )
  } catch {
    return []
  }
}

function saveRuns(runs: SavedBacktestRun[]) {
  try {
    localStorage.setItem(
      getBacktestHistoryStorageKey(),
      JSON.stringify(runs.slice(0, MAX_RUNS))
    )
  } catch {
    /* quota */
  }
}

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `run-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isScriptBotType(
  t: string
): t is
  | "low_risk"
  | "medium_risk"
  | "high_risk"
  | "crypto_low"
  | "crypto_medium"
  | "crypto_high" {
  return (
    t === "low_risk" ||
    t === "medium_risk" ||
    t === "high_risk" ||
    t === "crypto_low" ||
    t === "crypto_medium" ||
    t === "crypto_high"
  )
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n)
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`
}

function fmtWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function fmtIsoShort(iso: string | undefined) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function fmtPrice(n: number | undefined) {
  if (n == null || Number.isNaN(n)) return "—"
  return n.toFixed(5)
}

function num(n: number | undefined, fallback = 0) {
  if (n == null || Number.isNaN(n)) return fallback
  return n
}

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function csvRow(values: unknown[]) {
  return values.map(csvCell).join(",")
}

function safeFilePart(value: string) {
  return value
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function buildBacktestCsv(run: SavedBacktestRun) {
  const r = run.result
  const lines: string[] = [
    csvRow(["TradePilot Backtest Report"]),
    csvRow(["Downloaded at", new Date().toISOString()]),
    csvRow([]),
    csvRow(["Run details"]),
    csvRow(["Run time", run.at]),
    csvRow(["Bot ID", run.botId]),
    csvRow(["Bot type", run.botType]),
    csvRow(["Symbol", run.symbol]),
    csvRow(["Mode", run.mode]),
    csvRow(["Script days", run.scriptDays ?? ""]),
    csvRow(["Candle count", run.candleCount ?? ""]),
    csvRow([]),
    csvRow(["Performance summary"]),
    csvRow(["Metric", "Value"]),
    csvRow(["Total return %", num(r.total_profit_pct)]),
    csvRow(["Total P&L USD", num(r.total_pnl_usd)]),
    csvRow(["Gross profit USD", num(r.gross_profit_usd)]),
    csvRow(["Gross loss USD", num(r.gross_loss_usd)]),
    csvRow(["Win rate %", num(r.win_rate)]),
    csvRow(["Winning trades", num(r.winning_trades)]),
    csvRow(["Losing trades", num(r.losing_trades)]),
    csvRow(["Total trades", num(r.total_trades)]),
    csvRow(["Profit factor USD", num(r.profit_factor_usd)]),
    csvRow(["Profit factor", num(r.profit_factor)]),
    csvRow(["Sharpe ratio", num(r.sharpe_ratio)]),
    csvRow(["Max drawdown %", num(r.max_drawdown_pct)]),
    csvRow(["Max drawdown USD", num(r.max_drawdown_usd)]),
    csvRow([]),
    csvRow(["Trades"]),
    csvRow([
      "#",
      "Side",
      "Entry time",
      "Exit time",
      "Entry price",
      "Exit price",
      "Stop loss",
      "Take profit",
      "P&L %",
      "P&L USD",
      "Outcome",
    ]),
  ]

  for (const trade of Array.isArray(r.trades) ? r.trades : []) {
    lines.push(
      csvRow([
        trade.trade_no,
        trade.side,
        trade.entry_time,
        trade.exit_time,
        trade.entry_price,
        trade.exit_price,
        trade.stop_loss,
        trade.take_profit,
        trade.pnl_pct,
        trade.pnl_usd,
        trade.result,
      ])
    )
  }

  return lines.join("\r\n")
}

function downloadBacktestRun(run: SavedBacktestRun) {
  const csv = buildBacktestCsv(run)
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const stamp = new Date(run.at).toISOString().slice(0, 19).replace(/[:T]/g, "-")
  link.href = url
  link.download = `tradepilot-backtest-${safeFilePart(run.symbol)}-${safeFilePart(run.botType)}-${stamp}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function BacktestSummaryGrid({ r }: { r: BacktestApiResult }) {
  const cells: { label: string; value: string }[] = [
    { label: "Total return", value: fmtPct(num(r.total_profit_pct)) },
    { label: "Total P&L (USD)", value: fmtMoney(num(r.total_pnl_usd)) },
    { label: "Gross profit", value: fmtMoney(num(r.gross_profit_usd)) },
    { label: "Gross loss", value: fmtMoney(num(r.gross_loss_usd)) },
    { label: "Win rate", value: fmtPct(num(r.win_rate)) },
    { label: "Wins / losses", value: `${num(r.winning_trades)} / ${num(r.losing_trades)}` },
    { label: "Total trades", value: String(num(r.total_trades)) },
    { label: "Profit factor (USD)", value: num(r.profit_factor_usd).toFixed(2) },
    { label: "Profit factor", value: num(r.profit_factor).toFixed(2) },
    { label: "Sharpe ratio", value: num(r.sharpe_ratio).toFixed(2) },
    { label: "Max drawdown", value: fmtPct(num(r.max_drawdown_pct)) },
    { label: "Max drawdown (USD)", value: fmtMoney(num(r.max_drawdown_usd)) },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-md border border-border/60 bg-muted/20 px-3 py-2"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {c.label}
          </p>
          <p className="mt-0.5 font-semibold tabular-nums text-foreground">{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function BacktestTradesTable({ trades }: { trades: BacktestTradeRow[] | undefined }) {
  const rows = Array.isArray(trades) ? trades : []
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No trade details are available for this result. Run a new backtest to see each simulated trade.
      </p>
    )
  }
  return (
    <div className="max-h-[min(420px,60vh)] overflow-auto rounded-md border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead className="text-right">Entry px</TableHead>
            <TableHead className="text-right">Exit px</TableHead>
            <TableHead className="text-right">SL</TableHead>
            <TableHead className="text-right">TP</TableHead>
            <TableHead className="text-right">P&amp;L %</TableHead>
            <TableHead className="text-right">P&amp;L $</TableHead>
            <TableHead>Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((t) => {
            const win = t.result?.toUpperCase() === "WIN"
            return (
              <TableRow key={`${t.trade_no}-${t.entry_time}`}>
                <TableCell className="text-xs tabular-nums">{t.trade_no}</TableCell>
                <TableCell className="text-xs font-medium uppercase">{t.side}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {fmtIsoShort(t.entry_time)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {fmtIsoShort(t.exit_time)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {fmtPrice(t.entry_price)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {fmtPrice(t.exit_price)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {fmtPrice(t.stop_loss)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {fmtPrice(t.take_profit)}
                </TableCell>
                <TableCell
                  className={`text-right text-xs font-medium tabular-nums ${
                    num(t.pnl_pct) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {fmtPct(num(t.pnl_pct))}
                </TableCell>
                <TableCell
                  className={`text-right text-xs font-semibold tabular-nums ${
                    num(t.pnl_usd) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {fmtMoney(num(t.pnl_usd))}
                </TableCell>
                <TableCell className="text-xs">
                  <span
                    className={
                      win
                        ? "rounded bg-green-500/15 px-1.5 py-0.5 font-semibold text-green-700 dark:text-green-400"
                        : "rounded bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-700 dark:text-red-400"
                    }
                  >
                    {t.result ?? "—"}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default function BotBacktest() {
  const { activeMarket } = useDashboardMarket()
  const location = useLocation()
  const navigate = useNavigate()
  /** Changes when a different user signs in so we reload the correct localStorage slice. */
  const accountScope = `${getSessionUserId() ?? ""}|${getSessionUserEmail() ?? ""}`
  const [bots, setBots] = useState<BotSummary[]>([])
  const [botsLoading, setBotsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string>("")
  const [scriptDays, setScriptDays] = useState(String(DEFAULT_SCRIPT_DAYS))
  const [history, setHistory] = useState<SavedBacktestRun[]>(() => loadRuns())
  const [scriptBusy, setScriptBusy] = useState(false)
  const preselectedBotId =
    (
      location.state as
        | {
            selectedBotId?: string
          }
        | null
    )?.selectedBotId ?? ""

  useEffect(() => {
    setHistory(loadRuns())
  }, [accountScope])

  const selected = useMemo(
    () => bots.find((b) => b.id === selectedId),
    [bots, selectedId]
  )
  const marketBots = useMemo(() => filterBotsByMarket(bots, activeMarket), [activeMarket, bots])

  useEffect(() => {
    let c = false
    ;(async () => {
      const res = await fetchBots()
      if (c) return
      setBotsLoading(false)
      if (!res.ok) {
        if (res.status === 401) {
          toast.error(res.message)
          navigate("/auth/login", { replace: true })
          return
        }
        toast.error(res.message)
        return
      }
      setBots(res.data.bots)
      const nextBots = filterBotsByMarket(res.data.bots, activeMarket)
      if (nextBots.length > 0) {
        setSelectedId((prev) =>
          preselectedBotId && nextBots.some((b) => b.id === preselectedBotId)
            ? preselectedBotId
            : prev && nextBots.some((b) => b.id === prev)
            ? prev
            : nextBots[0].id
        )
      } else {
        setSelectedId("")
      }
    })()
    return () => {
      c = true
    }
  }, [activeMarket, navigate, preselectedBotId])

  useEffect(() => {
    if (marketBots.length === 0) {
      setSelectedId("")
      return
    }
    setSelectedId((prev) =>
      prev && marketBots.some((bot) => bot.id === prev) ? prev : marketBots[0].id
    )
  }, [marketBots])

  const pushRun = useCallback((run: SavedBacktestRun) => {
    setHistory((prev) => {
      const next = [run, ...prev].slice(0, MAX_RUNS)
      saveRuns(next)
      return next
    })
  }, [])

  const runScriptStyle = useCallback(async () => {
    if (!selected || !isScriptBotType(selected.bot_type)) {
      toast.error(
        "This bot can be tested from the Backtest Lab."
      )
      return
    }
    const d = parseInt(scriptDays, 10)
    const days = Number.isFinite(d) && d >= 5 && d <= 365 ? d : DEFAULT_SCRIPT_DAYS

    setScriptBusy(true)
    try {
      const res = await runScriptBacktest({
        bot_type: selected.bot_type,
        days,
      })
      if (!res.ok) {
        toast.error(res.message)
        return
      }
      const run: SavedBacktestRun = {
        id: newId(),
        at: new Date().toISOString(),
        botId: selected.id,
        botType: selected.bot_type,
        symbol: selected.symbol,
        mode: "script_range",
        scriptDays: days,
        result: res.data,
      }
      pushRun(run)
      toast.success("Backtest finished. Result saved to history.")
    } finally {
      setScriptBusy(false)
    }
  }, [selected, scriptDays, pushRun])

  const clearHistory = useCallback(() => {
    if (!confirm("Clear all saved backtest results for this account?")) return
    setHistory([])
    saveRuns([])
    toast.info("History cleared.")
  }, [])

  return (
    <>
      <Breadcrumb title="Backtest lab" text="Test your bot's past performance" />

      <div className="grid gap-6">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Run a backtest</CardTitle>
            <CardDescription>
              Choose a bot, select your test settings, and view its past performance.
              Your recent results stay available so you can compare different runs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {botsLoading ? (
              <p className="text-sm text-muted-foreground">Loading bots…</p>
            ) : marketBots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {activeMarket} bots yet.{" "}
                <Link to="/prompt" className="text-primary underline underline-offset-4">
                  Create a bot
                </Link>{" "}
                first.
              </p>
            ) : (
              <>
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="bot">Bot</Label>
                  <Select value={selectedId} onValueChange={setSelectedId}>
                    <SelectTrigger id="bot" className="w-full max-w-md">
                      <SelectValue placeholder="Select a bot" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketBots.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.symbol} · {b.bot_type} · {b.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selected && (
                  <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Market</span>{" "}
                    {selected.market || "—"} · <span className="font-medium text-foreground">Timeframe</span>{" "}
                    {selected.timeframe || "—"} ·{" "}
                    <span className="font-medium text-foreground">Bot ID</span> {selected.id}
                  </div>
                )}

                {selected && !isScriptBotType(selected.bot_type) && (
                  <p className="text-sm text-amber-700 dark:text-amber-400/90">
                    Backtesting is available for{" "}
                    <span className="font-medium">low_risk</span>,{" "}
                    <span className="font-medium">medium_risk</span>,{" "}
                    <span className="font-medium">high_risk</span>,{" "}
                    <span className="font-medium">crypto_low</span>,{" "}
                    <span className="font-medium">crypto_medium</span>, and{" "}
                    <span className="font-medium">crypto_high</span> bots.
                  </p>
                )}

                {selected && isScriptBotType(selected.bot_type) && (
                  <div className="flex min-h-[140px] flex-col">
                    <div className="grid max-w-xs gap-2">
                      <Label htmlFor="days">Test period (days)</Label>
                      <Input
                        id="days"
                        type="number"
                        min={5}
                        max={365}
                        value={scriptDays}
                        onChange={(e) => setScriptDays(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Choose how much recent market history to test. Some strategies use their own
                        recommended test period.
                      </p>
                    </div>
                    <div className="mt-auto flex justify-end pt-6">
                      <Button
                        type="button"
                        onClick={() => void runScriptStyle()}
                        disabled={scriptBusy}
                      >
                        {scriptBusy ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Testing…
                          </>
                        ) : (
                          "Run a backtest"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Backtest history</CardTitle>
              <CardDescription>
                Recent results for this account ({history.length} run
                {history.length === 1 ? "" : "s"}).
              </CardDescription>
            </div>
            {history.length > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="size-4" />
                Clear all
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No results yet. Run a backtest to see performance here.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Open a result to review performance and simulated trades (side, prices,
                  P&amp;L, win/loss).
                </p>
                {history.map((h) => {
                  const r = h.result
                  const tradeCount = Array.isArray(r.trades) ? r.trades.length : 0
                  return (
                    <Collapsible key={h.id} className="group rounded-lg border border-border/60">
                      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40">
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-sm font-semibold">{fmtWhen(h.at)}</span>
                            <span className="text-xs text-muted-foreground">
                              {h.mode === "server_candles"
                                ? `Market data (${h.candleCount ?? "—"})`
                                : `Backtest (${h.scriptDays ?? "—"}d)`}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{h.symbol}</span> ·{" "}
                            {h.botType}
                          </div>
                        </div>
                        <div className="hidden shrink-0 gap-4 text-right text-xs sm:flex sm:flex-col">
                          <span className="tabular-nums">
                            <span className="text-muted-foreground">Win rate </span>
                            <span className="font-semibold">{fmtPct(num(r.win_rate))}</span>
                          </span>
                          <span className="tabular-nums">
                            <span className="text-muted-foreground">P&amp;L </span>
                            <span
                              className={`font-semibold ${
                                num(r.total_pnl_usd) >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {fmtMoney(num(r.total_pnl_usd))}
                            </span>
                          </span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-4 border-t border-border/60 bg-muted/10 px-4 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold">Backtest report</h4>
                              <p className="text-xs text-muted-foreground">
                                Download this result with summary metrics and trade details.
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                downloadBacktestRun(h)
                                toast.success("Backtest report downloaded.")
                              }}
                            >
                              <Download className="size-4" />
                              Download CSV
                            </Button>
                          </div>
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Performance summary</h4>
                            <BacktestSummaryGrid r={r} />
                          </div>
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">
                              Trade details ({tradeCount})
                            </h4>
                            <BacktestTradesTable trades={r.trades} />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
