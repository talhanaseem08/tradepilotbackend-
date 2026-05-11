import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchOpenPositions, type OpenPosition, type TradeRecord } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"

type Props = {
  trades: TradeRecord[]
  market: "forex" | "crypto"
}

type DayStats = {
  dateMs: number
  pnl: number
  trades: number
  wins: number
}

type DayTradeDetail = {
  dateMs: number
  trades: TradeRecord[]
  pnl: number
  grossProfit: number
  grossLossAbs: number
  wins: number
  losses: number
  commissions: number
  volume: number
  profitFactor: number
  winRate: number
}

function formatCurrency(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function formatCompactCurrency(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1000) {
    return `${value < 0 ? "-" : ""}$${(abs / 1000).toFixed(2)}K`
  }
  return `${value < 0 ? "-" : ""}$${abs.toFixed(0)}`
}

function formatAxisCurrency(value: number) {
  const normalized = Math.abs(value) < 0.005 ? 0 : value
  const abs = Math.abs(normalized)

  if (abs >= 1000) return formatCompactCurrency(normalized)
  if (abs >= 100) return formatCurrency(normalized, 0)
  return formatCurrency(normalized, 2)
}

function formatDateShort(iso?: string) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
}

function directionBadge(direction?: string) {
  if (!direction) return null
  const normalized = direction.trim().toLowerCase()
  const isBuy = normalized === "buy" || normalized === "long"
  return (
    <Badge
      className={`border-0 px-2 py-0.5 text-[11px] font-semibold ${
        isBuy
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {isBuy ? "BUY" : "SELL"}
    </Badge>
  )
}

function sortTradesDesc(trades: TradeRecord[]) {
  return [...trades].sort((a, b) => {
    const ta = new Date(a.closed_at ?? a.timestamp ?? a.opened_at ?? 0).getTime()
    const tb = new Date(b.closed_at ?? b.timestamp ?? b.opened_at ?? 0).getTime()
    return tb - ta
  })
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function buildMonthOptions(trades: TradeRecord[]) {
  const map = new Map<string, Date>()
  const now = startOfMonth(new Date())
  map.set(monthKey(now), now)

  for (const trade of trades) {
    const source = trade.closed_at ?? trade.timestamp
    if (!source) continue
    const date = new Date(source)
    if (Number.isNaN(date.getTime())) continue
    const month = startOfMonth(date)
    map.set(monthKey(month), month)
  }

  return [...map.values()].sort((a, b) => a.getTime() - b.getTime())
}

function monthName(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })
}

function buildDayStats(trades: TradeRecord[], month: Date) {
  const grouped = new Map<number, DayStats>()

  for (const trade of trades) {
    if (trade.status !== "closed" || trade.pnl == null) continue
    const source = trade.closed_at ?? trade.timestamp
    if (!source) continue
    const date = new Date(source)
    if (Number.isNaN(date.getTime()) || !sameMonth(date, month)) continue

    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const current = grouped.get(dayStart) ?? {
      dateMs: dayStart,
      pnl: 0,
      trades: 0,
      wins: 0,
    }
    current.pnl += trade.pnl
    current.trades += 1
    if (trade.pnl > 0) current.wins += 1
    grouped.set(dayStart, current)
  }

  return grouped
}

function buildDayTradeDetails(trades: TradeRecord[], month: Date) {
  const grouped = new Map<number, TradeRecord[]>()

  for (const trade of trades) {
    if (trade.status !== "closed" || trade.pnl == null) continue
    const source = trade.closed_at ?? trade.timestamp
    if (!source) continue
    const date = new Date(source)
    if (Number.isNaN(date.getTime()) || !sameMonth(date, month)) continue

    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const current = grouped.get(dayStart) ?? []
    current.push(trade)
    grouped.set(dayStart, current)
  }

  const details = new Map<number, DayTradeDetail>()
  for (const [dateMs, dayTrades] of grouped.entries()) {
    const wins = dayTrades.filter((trade) => (trade.pnl ?? 0) > 0)
    const losses = dayTrades.filter((trade) => (trade.pnl ?? 0) < 0)
    const grossProfit = wins.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
    const grossLossAbs = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0))
    const pnl = dayTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
    const commissions = dayTrades.reduce((sum, trade) => sum + (trade.commission ?? 0), 0)
    const volume = dayTrades.reduce((sum, trade) => sum + Math.abs(trade.lots ?? 0), 0)

    details.set(dateMs, {
      dateMs,
      trades: sortTradesDesc(dayTrades),
      pnl,
      grossProfit,
      grossLossAbs,
      wins: wins.length,
      losses: losses.length,
      commissions,
      volume,
      profitFactor: grossLossAbs > 0 ? grossProfit / grossLossAbs : grossProfit > 0 ? grossProfit : 0,
      winRate: dayTrades.length > 0 ? (wins.length / dayTrades.length) * 100 : 0,
    })
  }

  return details
}

function buildCalendarWeeks(month: Date, dayStats: Map<number, DayStats>) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())
  const gridEnd = new Date(lastDay)
  gridEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

  const days: Array<{
    date: Date
    inMonth: boolean
    stats?: DayStats
  }> = []

  for (
    let cursor = new Date(gridStart);
    cursor <= gridEnd;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  ) {
    const dayStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()).getTime()
    days.push({
      date: new Date(cursor),
      inMonth: cursor.getMonth() === month.getMonth(),
      stats: dayStats.get(dayStart),
    })
  }

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    const cells = days.slice(i, i + 7)
    const active = cells.filter((cell) => cell.inMonth && cell.stats)
    const pnl = active.reduce((sum, cell) => sum + (cell.stats?.pnl ?? 0), 0)
    weeks.push({
      cells,
      pnl,
      activeDays: active.length,
    })
  }
  return weeks
}

const CALENDAR_HEADER_HEIGHT = "h-[36px]"
const CALENDAR_ROW_HEIGHT = "h-[92px]"

function formatTimeOnly(iso?: string) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function formatLongDate(dateMs: number) {
  return new Date(dateMs).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function DayDetailDialog({
  detail,
  open,
  onOpenChange,
}: {
  detail: DayTradeDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const chartData = useMemo(() => {
    if (!detail) return []
    const orderedTrades = detail.trades
      .slice()
      .reverse()
    let running = 0
    const series = orderedTrades.map((trade, index) => {
        running += trade.pnl ?? 0
        return {
          idx: index,
          value: Number(running.toFixed(2)),
        }
      })
    if (series.length === 1) {
      return [
        { idx: 0, value: 0 },
        { idx: 1, value: series[0].value },
      ]
    }
    return series
  }, [detail])

  const chartDomain = useMemo(() => {
    if (chartData.length === 0) return [-100, 100] as const
    const values = chartData.map((point) => point.value)
    const min = Math.min(...values, 0)
    const max = Math.max(...values, 0)
    const spread = max - min
    const padding = Math.max(spread * 0.18, Math.max(Math.abs(max), Math.abs(min), 1) * 0.12, 5)
    return [Number((min - padding).toFixed(2)), Number((max + padding).toFixed(2))] as const
  }, [chartData])

  const statItems = detail
    ? [
        { label: "Total Trades", value: detail.trades.length },
        { label: "Winners", value: detail.wins },
        { label: "Gross P&L", value: formatCurrency(detail.grossProfit) },
        { label: "Commissions", value: formatCurrency(detail.commissions) },
        { label: "Winrate", value: `${detail.winRate.toFixed(2)}%` },
        { label: "Losers", value: detail.losses },
        { label: "Volume", value: detail.volume ? detail.volume.toFixed(2) : "0.00" },
        { label: "Profit Factor", value: detail.profitFactor ? detail.profitFactor.toFixed(2) : "0.00" },
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(1100px,calc(100vw-2rem))] gap-0 overflow-hidden p-0 sm:max-w-[1100px]">
        {detail ? (
          <>
            <DialogHeader className="border-b border-neutral-200 px-5 py-4 text-left">
              <div className="flex flex-wrap items-start gap-3 pr-10">
                <div className="flex flex-wrap items-center gap-4">
                  <DialogTitle className="text-xl font-semibold">{formatLongDate(detail.dateMs)}</DialogTitle>
                  <DialogDescription className={`text-base font-semibold ${detail.pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    Net P&amp;L {formatCurrency(detail.pnl)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-5 py-5">
              <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="h-[190px] rounded-xl border border-neutral-200 bg-background p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="dayPnlFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#86EFAC" stopOpacity={0.65} />
                          <stop offset="100%" stopColor="#86EFAC" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="idx" hide />
                      <YAxis
                        domain={chartDomain as unknown as [number, number]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 11 }}
                        tickFormatter={(value) => formatAxisCurrency(Number(value))}
                        tickCount={5}
                        width={72}
                      />
                      <RechartsTooltip
                        labelFormatter={() => ""}
                        formatter={(value) =>
                          formatCurrency(typeof value === "number" ? value : Number(value ?? 0))
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#45B369"
                        strokeWidth={2}
                        fill="url(#dayPnlFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {statItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-neutral-200 bg-muted/15 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
                <div className="max-h-[360px] overflow-auto">
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-muted/35">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ticker</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Side</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instrument</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Net P&amp;L</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Net ROI</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Realized R-Multiple</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Playbook</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.trades.map((trade) => {
                      const pnl = trade.pnl ?? 0
                      const roiBase = trade.entry_price && trade.lots ? Math.abs(trade.entry_price * trade.lots) : 0
                      const roi = roiBase > 0 ? (pnl / roiBase) * 100 : null
                      return (
                        <tr key={trade._id} className="border-t border-neutral-100">
                          <td className="px-4 py-3">{formatTimeOnly(trade.opened_at ?? trade.timestamp)}</td>
                          <td className="px-4 py-3">{trade.symbol}</td>
                          <td className="px-4 py-3">{directionBadge(trade.direction)}</td>
                          <td className="px-4 py-3">{trade.symbol}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {formatCurrency(pnl)}
                          </td>
                          <td className="px-4 py-3 text-right">{roi != null ? `${roi.toFixed(2)}%` : "—"}</td>
                          <td className="px-4 py-3 text-right">—</td>
                          <td className="px-4 py-3 text-right">—</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button asChild type="button">
                <Link to="/trade-journal">View Details</Link>
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function OpenPositionsTable({
  positions,
  loading,
  error,
}: {
  positions: OpenPosition[]
  loading: boolean
  error: string | null
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="px-4 py-5 text-sm text-red-500">{error}</p>
  }

  if (positions.length === 0) {
    return (
      <div className="flex min-h-[410px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
        No open positions yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-4 pb-3 pt-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-4 last:pr-4" colSpan={4}>
              <div className="grid grid-cols-[1.15fr_0.85fr_1fr_1.1fr] rounded-xl border border-[#F2D6C2] bg-[#FFF7F2] px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
                <span>Symbol</span>
                <span>Side</span>
                <span className="text-right">Open Date</span>
                <span className="text-right">Unrealized P&amp;L</span>
              </div>
            </th>
          </tr>
          <tr className="hidden">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Symbol
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Side
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Open Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Unrealized P&amp;L
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.slice(0, 10).map((position) => {
            const isBuy = position.current_units > 0
            return (
              <tr
                key={position.id}
                className="border-b border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-medium">{position.instrument.replace("_", "/")}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={`border-0 px-2 py-0.5 text-[11px] font-semibold ${
                      isBuy
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {isBuy ? "BUY" : "SELL"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatDateShort(position.open_time)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    position.unrealized_pl >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(position.unrealized_pl)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function RecentTradesTable({ trades }: { trades: TradeRecord[] }) {
  if (trades.length === 0) {
    return (
      <div className="flex min-h-[410px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
        No recent trades yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-4 pb-3 pt-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-4 last:pr-4" colSpan={4}>
              <div className="grid grid-cols-[1.05fr_1fr_0.9fr_0.95fr] rounded-xl border border-[#F2D6C2] bg-[#FFF7F2] px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
                <span>Close Date</span>
                <span>Symbol</span>
                <span>Side</span>
                <span className="text-right">Net P&amp;L</span>
              </div>
            </th>
          </tr>
          <tr className="hidden">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Close Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Symbol
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Side
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Net P&amp;L
            </th>
          </tr>
        </thead>
        <tbody>
          {sortTradesDesc(trades)
            .filter((trade) => trade.status === "closed")
            .slice(0, 10)
            .map((trade, index) => {
              const pnl = trade.pnl ?? 0
              return (
                <tr
                  key={`${trade._id}-${index}`}
                  className="border-b border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 font-medium">{formatDateShort(trade.closed_at ?? trade.timestamp)}</td>
                  <td className="px-4 py-3 font-medium">{trade.symbol}</td>
                  <td className="px-4 py-3">{directionBadge(trade.direction)}</td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(pnl)}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

function ActivityCard({
  trades,
  market,
}: {
  trades: TradeRecord[]
  market: "forex" | "crypto"
}) {
  const [positions, setPositions] = useState<OpenPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchOpenPositions(market).then((res) => {
      if (cancelled) return
      if (res.ok) setPositions(res.data)
      else setError(res.message)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [market])

  return (
    <Card className="rounded-lg border-0 !p-0 h-full">
      <CardContent className="p-0 h-full">
        <Tabs defaultValue="recent" className="gap-0 h-full">
          <div className="border-b border-neutral-200 dark:border-slate-500 px-4 py-3.5">
            <div className="flex min-h-[40px] items-center justify-between gap-3">
              <TabsList className="h-10 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="recent"
                  className="rounded-none border-x-0 border-t-0 border-b-[2.5px] border-transparent px-4 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground data-[state=active]:rounded-t-md data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Recent Trades
                </TabsTrigger>
                <TabsTrigger
                  value="open"
                  className="rounded-none border-x-0 border-t-0 border-b-[2.5px] border-transparent px-4 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground data-[state=active]:rounded-t-md data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Open Positions
                </TabsTrigger>
              </TabsList>

              <Link to="/trade-journal" className="text-sm text-primary hover:underline">
                View More
              </Link>
            </div>
          </div>

          <TabsContent value="recent" className="mt-0">
            <RecentTradesTable trades={trades} />
          </TabsContent>
          <TabsContent value="open" className="mt-0">
            <OpenPositionsTable positions={positions} loading={loading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function PerformanceCalendar({
  trades,
}: {
  trades: TradeRecord[]
}) {
  const monthOptions = useMemo(() => buildMonthOptions(trades), [trades])
  const [selectedMonthKey, setSelectedMonthKey] = useState(() => monthKey(monthOptions[monthOptions.length - 1]))

  useEffect(() => {
    if (!monthOptions.some((month) => monthKey(month) === selectedMonthKey)) {
      setSelectedMonthKey(monthKey(monthOptions[monthOptions.length - 1]))
    }
  }, [monthOptions, selectedMonthKey])

  const selectedMonth =
    monthOptions.find((month) => monthKey(month) === selectedMonthKey) ??
    monthOptions[monthOptions.length - 1]

  const currentMonth = startOfMonth(new Date())
  const dayStats = useMemo(() => buildDayStats(trades, selectedMonth), [selectedMonth, trades])
  const dayDetails = useMemo(() => buildDayTradeDetails(trades, selectedMonth), [selectedMonth, trades])
  const weeks = useMemo(() => buildCalendarWeeks(selectedMonth, dayStats), [dayStats, selectedMonth])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const monthlyPnl = [...dayStats.values()].reduce((sum, day) => sum + day.pnl, 0)
  const monthlyActiveDays = [...dayStats.values()].length

  const selectedIndex = monthOptions.findIndex((month) => monthKey(month) === selectedMonthKey)
  const canGoPrev = selectedIndex > 0
  const canGoNext = selectedIndex < monthOptions.length - 1
  const selectedDayDetail = selectedDay != null ? dayDetails.get(selectedDay) ?? null : null

  return (
    <Card className="rounded-lg border-0 !p-0 h-full">
      <CardContent className="p-0 h-full">
        <div className="border-b border-neutral-200 dark:border-slate-500 px-4 py-3.5">
          <div className="flex min-h-[40px] flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-full"
                disabled={!canGoPrev}
                onClick={() => canGoPrev && setSelectedMonthKey(monthKey(monthOptions[selectedIndex - 1]))}
              >
                <ChevronLeft />
              </Button>
              <p className="text-base font-semibold leading-none">{monthName(selectedMonth)}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-full"
                disabled={!canGoNext}
                onClick={() => canGoNext && setSelectedMonthKey(monthKey(monthOptions[selectedIndex + 1]))}
              >
                <ChevronRight />
              </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setSelectedMonthKey(monthKey(currentMonth))}
              >
                This month
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="text-muted-foreground">
                Monthly stats:{" "}
                <span className={monthlyPnl >= 0 ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                  {formatCompactCurrency(monthlyPnl)}
                </span>
              </div>
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">{monthlyActiveDays}</span> active days
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-1 gap-2 xl:grid-cols-[repeat(7,minmax(0,1fr))_132px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
              <div
                key={label}
                className={`${CALENDAR_HEADER_HEIGHT} rounded-md border border-neutral-200 bg-muted/25 px-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center justify-center`}
              >
                {label}
              </div>
            ))}
            <div className={`${CALENDAR_HEADER_HEIGHT} hidden xl:block`} />

            {weeks.flatMap((week, weekIndex) => {
              const dayCells = week.cells.map((cell, cellIndex) => {
                const stats = cell.stats
                const inMonth = cell.inMonth
                const winRate = stats && stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0
                const tone =
                  !stats || !inMonth
                    ? "border-neutral-200 bg-background"
                    : stats.pnl >= 0
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"

                return (
                  <button
                    key={`${weekIndex}-${cellIndex}`}
                    type="button"
                    disabled={!stats || !inMonth}
                    onClick={() => stats && inMonth && setSelectedDay(stats.dateMs)}
                    className={`${CALENDAR_ROW_HEIGHT} relative rounded-lg border px-2.5 py-2 text-left transition-colors ${tone} ${
                      stats && inMonth ? "cursor-pointer hover:border-primary/35" : "cursor-default"
                    }`}
                  >
                    <div className="absolute right-3 top-2 text-right text-[11px] font-medium text-muted-foreground">
                      {inMonth ? cell.date.getDate() : ""}
                    </div>
                    {stats && inMonth ? (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                        <p
                          className={`text-sm font-semibold ${
                            stats.pnl >= 0 ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {formatCompactCurrency(stats.pnl)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {stats.trades} {stats.trades === 1 ? "trade" : "trades"}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {winRate.toFixed(2)}%
                        </p>
                      </div>
                    ) : null}
                  </button>
                )
              })

              const weekCard = (
                <div
                  key={`week-${weekIndex}`}
                  className={`flex ${CALENDAR_ROW_HEIGHT} flex-col justify-center rounded-lg border border-neutral-200 bg-background px-3 py-3`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Week {weekIndex + 1}
                  </p>
                  <p
                    className={`mt-1 text-lg font-semibold ${
                      week.pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {formatCompactCurrency(week.pnl)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {week.activeDays} {week.activeDays === 1 ? "day" : "days"}
                  </p>
                </div>
              )

              return [...dayCells, weekCard]
            })}
          </div>
        </div>
        <DayDetailDialog
          detail={selectedDayDetail}
          open={selectedDayDetail != null}
          onOpenChange={(open) => {
            if (!open) setSelectedDay(null)
          }}
        />
      </CardContent>
    </Card>
  )
}

export default function TradeActivitySection({ trades, market }: Props) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-4">
        <ActivityCard trades={trades} market={market} />
      </div>
      <div className="xl:col-span-8">
        <PerformanceCalendar trades={trades} />
      </div>
    </div>
  )
}
