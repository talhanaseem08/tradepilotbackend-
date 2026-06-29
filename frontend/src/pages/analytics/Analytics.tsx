import Breadcrumb from "@/layouts/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import { clearSession } from "@/lib/auth"
import {
  fetchBots,
  fetchForexGuardStatus,
  fetchTrades,
  type BotSummary,
  type ForexGuardStatus,
  type TradeRecord,
} from "@/lib/api"
import { filterTradesByMarket } from "@/lib/market"
import {
  AlertTriangle,
  CalendarDays,
  ChartColumn,
  Hash,
  Loader2,
  MoveDownRight,
  MoveUpRight,
  ShieldCheck,
  ShieldOff,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type RangeKey = "7d" | "30d" | "90d" | "all"

type DurationBucket = {
  label: string
  values: number[]
}

type BoxPlotPoint = {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  total: number
}

type ScatterPoint = {
  x: number
  y: number
  color: string
}

type InstrumentPoint = {
  label: string
  value: number
  color: string
}

const INITIAL_BALANCE = 10000
const GRID_COLOR = "#E8EDF5"
const GREEN = "#59C593"
const RED = "#E0526B"
const BLUE = "#4F78FF"
const TEXT_MUTED = "#6B7280"

function fmtGuardTime(value: string | null | undefined) {
  if (!value) return "—"
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return dt.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getCloseDate(trade: TradeRecord) {
  const iso = trade.closed_at ?? trade.timestamp
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

function getOpenDate(trade: TradeRecord) {
  const iso = trade.opened_at ?? trade.timestamp
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

function normalizeDirection(direction?: string) {
  const value = direction?.trim().toLowerCase()
  if (value === "buy" || value === "long") return "long"
  if (value === "sell" || value === "short") return "short"
  return "other"
}

function formatCurrency(value: number, digits = 2) {
  const abs = Math.abs(value)
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits ?? (abs >= 1000 ? 0 : 2),
    maximumFractionDigits: digits ?? (abs >= 1000 ? 0 : 2),
  }).format(value)
}

function formatCompactCurrency(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1000) {
    return `${value < 0 ? "-" : ""}$${(abs / 1000).toFixed(2)}K`
  }
  return formatCurrency(value, abs >= 100 ? 0 : 2)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0.00%"
  return `${value.toFixed(2)}%`
}

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = (sorted.length - 1) * p
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  const weight = index - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

function buildRangeFilter(trade: TradeRecord, range: RangeKey) {
  if (range === "all") return true
  const closeDate = getCloseDate(trade)
  if (!closeDate) return false
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))
  return closeDate >= start
}

function KpiCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[118px] flex-col rounded-xl border-0 bg-card px-4 py-3 shadow-sm">
      {children}
    </div>
  )
}

function KpiTitle({
  title,
  icon: Icon,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-500">
      <Icon className="size-4 opacity-70" />
      <span>{title}</span>
    </div>
  )
}

function GaugeCard({
  title,
  centerLabel,
  centerValue,
  goodValue,
  badValue,
  footer,
}: {
  title: string
  centerLabel: string
  centerValue: string
  goodValue: number
  badValue: number
  footer: React.ReactNode
}) {
  const total = Math.max(goodValue + badValue, 1)
  const data = [
    { name: "good", value: Math.max(goodValue, 0), color: GREEN },
    { name: "bad", value: Math.max(badValue, 0), color: RED },
  ]

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="px-4 pt-3">
          <div className="relative h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={78}
                  outerRadius={100}
                  stroke="none"
                  paddingAngle={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
              <p className="text-sm font-medium text-slate-500">{centerLabel}</p>
              <p className="mt-1 text-[20px] font-bold text-slate-900">{centerValue}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {total > 0 ? `${Math.round((goodValue / total) * 100)} / ${Math.round((badValue / total) * 100)}` : "—"}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 px-5 py-4">{footer}</div>
      </CardContent>
    </Card>
  )
}

function MiniStat({
  label,
  value,
  subValue,
  align = "left",
}: {
  label: string
  value: string
  subValue?: string
  align?: "left" | "center" | "right"
}) {
  return (
    <div className={align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      {subValue ? <p className="mt-1 text-sm text-slate-500">{subValue}</p> : null}
    </div>
  )
}

function DurationBoxPlot({
  data,
}: {
  data: BoxPlotPoint[]
}) {
  const width = 640
  const height = 250
  const left = 52
  const right = 16
  const top = 18
  const bottom = 40
  const innerWidth = width - left - right
  const innerHeight = height - top - bottom
  const points = data.flatMap((item) => [item.min, item.q1, item.median, item.q3, item.max, 0])
  const min = Math.min(...points, 0)
  const max = Math.max(...points, 0)
  const padding = Math.max((max - min) * 0.1, 20)
  const domainMin = min - padding
  const domainMax = max + padding
  const y = (value: number) => top + ((domainMax - value) / (domainMax - domainMin || 1)) * innerHeight
  const xStep = innerWidth / Math.max(data.length, 1)
  const zeroY = y(0)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[250px] w-full">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = domainMin + ((domainMax - domainMin) / 4) * index
        const cy = y(value)
        return (
          <g key={index}>
            <line x1={left} x2={width - right} y1={cy} y2={cy} stroke={GRID_COLOR} strokeDasharray="3 4" />
            <text x={8} y={cy + 4} fontSize="11" fill={TEXT_MUTED}>
              {formatCompactCurrency(value)}
            </text>
          </g>
        )
      })}
      <line x1={left} x2={width - right} y1={zeroY} y2={zeroY} stroke="#9CA3AF" strokeDasharray="4 4" />

      {data.map((item, index) => {
        const cx = left + xStep * index + xStep / 2
        const boxWidth = Math.min(38, xStep * 0.32)
        const positive = item.total >= 0
        return (
          <g key={item.label}>
            <line x1={cx} x2={cx} y1={y(item.max)} y2={y(item.min)} stroke="#9CA3AF" strokeWidth="2" />
            <line x1={cx - 10} x2={cx + 10} y1={y(item.max)} y2={y(item.max)} stroke="#9CA3AF" strokeWidth="2" />
            <line x1={cx - 10} x2={cx + 10} y1={y(item.min)} y2={y(item.min)} stroke="#9CA3AF" strokeWidth="2" />
            <rect
              x={cx - boxWidth / 2}
              y={y(item.q3)}
              width={boxWidth}
              height={Math.max(8, y(item.q1) - y(item.q3))}
              rx="6"
              fill={positive ? GREEN : RED}
              fillOpacity="0.2"
              stroke={positive ? GREEN : RED}
              strokeWidth="2"
            />
            <line
              x1={cx - boxWidth / 2}
              x2={cx + boxWidth / 2}
              y1={y(item.median)}
              y2={y(item.median)}
              stroke={positive ? GREEN : RED}
              strokeWidth="2"
            />
            <text x={cx} y={height - 10} fontSize="11" fill={TEXT_MUTED} textAnchor="middle">
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function tooltipNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const chartTooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6 [&_[data-slot=skeleton]]:bg-neutral-200/80 dark:[&_[data-slot=skeleton]]:bg-slate-700">
      <div className="mb-4 flex justify-end">
        <Skeleton className="h-10 w-[180px] rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[126px] flex-col rounded-xl border border-neutral-200/70 bg-card px-4 py-3 shadow-sm dark:border-slate-700"
          >
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mt-auto h-9 w-28" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="px-4 py-5">
                <Skeleton className="mx-auto h-[210px] w-[210px] rounded-full" />
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div>
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-2 h-4 w-72" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <div className="px-4 py-5">
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <Skeleton className="h-6 w-56" />
              </div>
              <div className="px-4 py-4">
                <Skeleton className="h-[290px] w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function isManualExecutionTest(trade: TradeRecord) {
  return trade.source === "manual_oanda_test" || trade.source === "manual_binance_test"
}

export default function Analytics() {
  const { activeMarket } = useDashboardMarket()
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [bots, setBots] = useState<BotSummary[]>([])
  const [guardStatusBySymbol, setGuardStatusBySymbol] = useState<
    Array<{ symbol: string; status: ForexGuardStatus }>
  >([])
  const [guardError, setGuardError] = useState<string | null>(null)
  const [guardLoading, setGuardLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<RangeKey>("all")

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchTrades({ limit: 500, page: 1 }), fetchBots()])
      .then(([tradesRes, botsRes]) => {
        if (cancelled) return
        if (
          (!tradesRes.ok && tradesRes.status === 401) ||
          (!botsRes.ok && botsRes.status === 401)
        ) {
          clearSession()
          toast.error("Your session has expired. Please sign in again.")
          window.location.replace("/auth/login")
          return
        }
        if (tradesRes.ok) setTrades(tradesRes.data.trades)
        if (botsRes.ok) setBots(botsRes.data.bots)
      })
      .catch(() => {
        if (!cancelled) toast.error("We could not load analytics. Please refresh the page.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const botTrades = useMemo(() => {
    return filterTradesByMarket(trades, activeMarket, bots).filter(
      (trade) => Boolean(trade.botID) && !isManualExecutionTest(trade)
    )
  }, [activeMarket, bots, trades])

  const activeForexSymbols = useMemo(() => {
    const symbols = bots
      .filter(
        (bot) =>
          bot.market.toLowerCase() === "forex" &&
          bot.status.toLowerCase() === "active" &&
          bot.symbol
      )
      .map((bot) => bot.symbol.toUpperCase())
    return Array.from(new Set(symbols))
  }, [bots])

  useEffect(() => {
    let cancelled = false

    async function loadGuardStatus() {
      if (activeMarket !== "forex" || activeForexSymbols.length === 0) {
        setGuardStatusBySymbol([])
        setGuardError(null)
        return
      }

      setGuardLoading(true)
      setGuardError(null)
      const results = await Promise.all(
        activeForexSymbols.map(async (symbol) => {
          const res = await fetchForexGuardStatus({ symbol, include_ai: true })
          return res.ok
            ? { symbol, status: res.data }
            : { symbol, error: res.message }
        })
      )

      if (cancelled) return
      const failures = results.filter(
        (item): item is { symbol: string; error: string } =>
          Boolean(item && "error" in item)
      )
      setGuardStatusBySymbol(
        results.filter(
          (item): item is { symbol: string; status: ForexGuardStatus } =>
            Boolean(item && "status" in item)
        )
      )
      setGuardError(
        failures.length > 0
          ? "Forex safety status is temporarily unavailable."
          : null
      )
      setGuardLoading(false)
    }

    void loadGuardStatus()

    return () => {
      cancelled = true
    }
  }, [activeForexSymbols, activeMarket])

  const rangedTrades = useMemo(
    () => botTrades.filter((trade) => buildRangeFilter(trade, range)),
    [botTrades, range]
  )

  const closedBotTrades = useMemo(
    () => rangedTrades.filter((trade) => trade.status === "closed" && trade.pnl != null),
    [rangedTrades]
  )

  const analytics = useMemo(() => {
    const uniqueDays = new Set<string>()
    let totalLots = 0
    let biggestWin = 0
    let biggestLoss = 0
    let wins = 0
    let losses = 0
    let totalProfit = 0
    let totalLossAbs = 0
    let totalPnL = 0
    const longTrades: TradeRecord[] = []
    const shortTrades: TradeRecord[] = []
    const durations: Array<{ minutes: number; pnl: number; color: string }> = []
    const balanceSeries: { date: string; balance: number; equity: number }[] = []
    const instrumentProfit = new Map<string, number>()
    const instrumentVolume = new Map<string, number>()

    const sortedClosed = [...closedBotTrades].sort((a, b) => {
      const ta = getCloseDate(a)?.getTime() ?? 0
      const tb = getCloseDate(b)?.getTime() ?? 0
      return ta - tb
    })

    let runningBalance = INITIAL_BALANCE
    for (const trade of sortedClosed) {
      const closeDate = getCloseDate(trade)
      const pnl = trade.pnl ?? 0
      const lots = Math.abs(trade.lots ?? 0)
      const side = normalizeDirection(trade.direction)

      if (closeDate) uniqueDays.add(closeDate.toDateString())
      totalLots += lots
      totalPnL += pnl
      if (pnl > biggestWin) biggestWin = pnl
      if (pnl < biggestLoss) biggestLoss = pnl
      if (pnl > 0) {
        wins += 1
        totalProfit += pnl
      } else if (pnl < 0) {
        losses += 1
        totalLossAbs += Math.abs(pnl)
      }

      if (side === "long") longTrades.push(trade)
      if (side === "short") shortTrades.push(trade)

      const openDate = getOpenDate(trade)
      if (openDate && closeDate) {
        const minutes = Math.max((closeDate.getTime() - openDate.getTime()) / 60000, 0)
        durations.push({
          minutes,
          pnl,
          color: pnl >= 0 ? GREEN : RED,
        })
      }

      instrumentProfit.set(trade.symbol, (instrumentProfit.get(trade.symbol) ?? 0) + pnl)
      instrumentVolume.set(trade.symbol, (instrumentVolume.get(trade.symbol) ?? 0) + lots)

      runningBalance += pnl
      if (closeDate) {
        balanceSeries.push({
          date: closeDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          balance: Number(runningBalance.toFixed(2)),
          equity: Number(runningBalance.toFixed(2)),
        })
      }
    }

    const totalClosed = sortedClosed.length
    const winRate = totalClosed > 0 ? (wins / totalClosed) * 100 : 0
    const profitabilityWinRate = totalClosed > 0 ? (wins / totalClosed) * 100 : 0
    const lossRate = totalClosed > 0 ? (losses / totalClosed) * 100 : 0

    const buildSideAnalysis = (source: TradeRecord[]) => {
      const closed = source.filter((trade) => trade.status === "closed" && trade.pnl != null)
      const positive = closed.filter((trade) => (trade.pnl ?? 0) > 0)
      const negative = closed.filter((trade) => (trade.pnl ?? 0) < 0)
      const grossProfit = positive.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
      const grossLossAbs = Math.abs(negative.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0))
      const net = closed.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
      const rate = closed.length > 0 ? (positive.length / closed.length) * 100 : 0
      return {
        net,
        wins: positive.length,
        losses: negative.length,
        grossProfit,
        grossLossAbs,
        winRate: rate,
      }
    }

    const shortAnalysis = buildSideAnalysis(shortTrades)
    const longAnalysis = buildSideAnalysis(longTrades)

    const durationBuckets: DurationBucket[] = [
      { label: "<5m", values: [] },
      { label: "5-15m", values: [] },
      { label: "15-30m", values: [] },
      { label: "30-60m", values: [] },
      { label: "60m+", values: [] },
    ]

    for (const point of durations) {
      if (point.minutes < 5) durationBuckets[0].values.push(point.pnl)
      else if (point.minutes < 15) durationBuckets[1].values.push(point.pnl)
      else if (point.minutes < 30) durationBuckets[2].values.push(point.pnl)
      else if (point.minutes < 60) durationBuckets[3].values.push(point.pnl)
      else durationBuckets[4].values.push(point.pnl)
    }

    const boxPlotData: BoxPlotPoint[] = durationBuckets.map((bucket) => {
      if (bucket.values.length === 0) {
        return { label: bucket.label, min: 0, q1: 0, median: 0, q3: 0, max: 0, total: 0 }
      }
      return {
        label: bucket.label,
        min: Math.min(...bucket.values),
        q1: percentile(bucket.values, 0.25),
        median: percentile(bucket.values, 0.5),
        q3: percentile(bucket.values, 0.75),
        max: Math.max(...bucket.values),
        total: bucket.values.reduce((sum, value) => sum + value, 0),
      }
    })

    const scatterData: ScatterPoint[] = durations.map((item) => ({
      x: Number(item.minutes.toFixed(2)),
      y: Number(item.pnl.toFixed(2)),
      color: item.color,
    }))

    const profitByInstrument: InstrumentPoint[] = [...instrumentProfit.entries()]
      .map(([label, value]) => ({
        label,
        value: Number(value.toFixed(2)),
        color: value >= 0 ? GREEN : RED,
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 6)

    const volumeByInstrument: InstrumentPoint[] = [...instrumentVolume.entries()]
      .map(([label, value]) => ({
        label,
        value: Number(value.toFixed(2)),
        color: GREEN,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    return {
      days: uniqueDays.size,
      totalTrades: totalClosed,
      totalLots,
      biggestWin,
      biggestLoss,
      totalPnL,
      totalProfit,
      totalLossAbs,
      wins,
      losses,
      winRate,
      lossRate,
      shortAnalysis,
      longAnalysis,
      profitabilityWinRate,
      balanceSeries:
        balanceSeries.length > 0
          ? balanceSeries
          : [{ date: "—", balance: INITIAL_BALANCE, equity: INITIAL_BALANCE }],
      boxPlotData,
      scatterData,
      profitByInstrument,
      volumeByInstrument,
    }
  }, [closedBotTrades, rangedTrades])

  const activeRangeLabel =
    range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : range === "90d" ? "Last 90 days" : "All time"

  return (
    <>
      <Breadcrumb
        title="Bot Analytics"
        text={`${activeMarket === "crypto" ? "Crypto" : "Forex"} bot execution analytics`}
      />

      {loading ? (
        <AnalyticsLoadingSkeleton />
      ) : (
        <>

      <div className="mb-4 flex justify-end">
        <Select value={range} onValueChange={(value) => setRange(value as RangeKey)}>
          <SelectTrigger className="w-[180px] rounded-lg border-neutral-200 bg-card">
            <SelectValue placeholder="Pick date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeMarket === "forex" ? (
        <div className="mb-5 rounded-xl bg-card px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="size-4 text-primary" />
            Forex safety check
          </div>
          <p className="mt-1 text-sm text-slate-500">
            We check news and market holidays before your forex bots trade.
          </p>

          {guardLoading ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Checking whether forex trading is safe right now...
            </div>
          ) : guardError ? (
            <div className="mt-3 rounded-md bg-amber-50 px-3 py-3 text-sm text-amber-700">
              We cannot check forex safety right now. Please try again in a moment.
            </div>
          ) : guardStatusBySymbol.length === 0 ? (
            <div className="mt-3 rounded-md bg-neutral-50 px-3 py-3 text-sm text-slate-500">
              No active forex bots are available to check right now.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
              {guardStatusBySymbol.map(({ symbol, status }) => (
                <div
                  key={symbol}
                  className={`rounded-lg px-4 py-4 ${
                    status.allowed ? "bg-emerald-50/70" : "bg-amber-50/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{symbol}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {status.allowed
                          ? "Trading is currently allowed for this forex pair."
                          : status.reason ?? "Trading is temporarily paused."}
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        status.allowed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {status.allowed ? (
                        <ShieldCheck className="size-3.5" />
                      ) : (
                        <ShieldOff className="size-3.5" />
                      )}
                      {status.allowed ? "Allowed" : "Paused"}
                    </div>
                  </div>

                  {!status.allowed && status.blocked_until ? (
                    <div className="mt-3 text-sm text-slate-600">
                      Trading may resume: <span className="font-medium">{fmtGuardTime(status.blocked_until)}</span>
                    </div>
                  ) : null}

                  {status.assistant ? (
                    <div className="mt-3 rounded-md bg-white/70 px-3 py-3">
                      <div className="text-sm font-medium text-slate-900">
                        {status.assistant.summary}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {status.assistant.pause_explanation}
                      </p>
                      {status.assistant.suggested_action !== "none" ? (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                          <AlertTriangle className="size-3.5 text-amber-600" />
                          AI suggests{" "}
                          {status.assistant.suggested_action === "wider_pause"
                            ? `an extra ${status.assistant.suggested_pause_minutes} minute caution window`
                            : "closer monitoring"}
                          {" "}({Math.round(status.assistant.confidence * 100)}% confidence)
                        </div>
                      ) : (
                        <div className="mt-2 text-xs font-medium text-slate-500">
                          AI confidence: {Math.round(status.assistant.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  ) : null}

                  {status.matched_events.length > 0 ? (
                    <div className="mt-3 text-xs text-slate-500">
                      Matched events: {status.matched_events.slice(0, 2).join(" | ")}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <>
              <KpiCard>
                <KpiTitle title="Number of days" icon={CalendarDays} />
                <div className="mt-auto text-[32px] font-bold leading-none tracking-tight text-slate-900">
                  {analytics.days}
                </div>
              </KpiCard>

              <KpiCard>
                <KpiTitle title="Total Trades Taken" icon={Hash} />
                <div className="mt-auto text-[32px] font-bold leading-none tracking-tight text-slate-900">
                  {analytics.totalTrades}
                </div>
              </KpiCard>

              <KpiCard>
                <KpiTitle title="Total Lots Used" icon={ChartColumn} />
                <div className="mt-auto text-[32px] font-bold leading-none tracking-tight text-slate-900">
                  {analytics.totalLots.toFixed(2)}
                </div>
              </KpiCard>

              <KpiCard>
                <KpiTitle title="Biggest Win" icon={MoveUpRight} />
                <div className="mt-auto text-[32px] font-bold leading-none tracking-tight text-[#59C593]">
                  {formatCurrency(analytics.biggestWin)}
                </div>
              </KpiCard>

              <KpiCard>
                <KpiTitle title="Biggest Loss" icon={MoveDownRight} />
                <div className="mt-auto text-[32px] font-bold leading-none tracking-tight text-[#E0526B]">
                  {formatCurrency(analytics.biggestLoss)}
                </div>
              </KpiCard>

              <div className="hidden xl:block" />
          </>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <GaugeCard
            title="Short Analysis"
            centerLabel="Profit"
            centerValue={formatCurrency(analytics.shortAnalysis.net)}
            goodValue={analytics.shortAnalysis.grossProfit}
            badValue={analytics.shortAnalysis.grossLossAbs}
            footer={
              <div className="grid grid-cols-3 gap-4">
                <MiniStat
                  label={`Wins (${analytics.shortAnalysis.wins})`}
                  value={formatCompactCurrency(analytics.shortAnalysis.grossProfit)}
                />
                <MiniStat
                  label="Win Rate"
                  value={formatPercent(analytics.shortAnalysis.winRate)}
                  align="center"
                />
                <MiniStat
                  label={`Losses (${analytics.shortAnalysis.losses})`}
                  value={formatCompactCurrency(analytics.shortAnalysis.grossLossAbs)}
                  align="right"
                />
              </div>
            }
          />

          <GaugeCard
            title="Profitability"
            centerLabel="Total Trades"
            centerValue={String(analytics.totalTrades)}
            goodValue={analytics.wins}
            badValue={analytics.losses}
            footer={
              <div className="grid grid-cols-2 gap-4">
                <MiniStat
                  label="Wins"
                  value={formatPercent(analytics.profitabilityWinRate)}
                  subValue={`Wins: ${analytics.wins}`}
                />
                <MiniStat
                  label="Losses"
                  value={formatPercent(analytics.lossRate)}
                  subValue={`Losses: ${analytics.losses}`}
                  align="right"
                />
              </div>
            }
          />

          <GaugeCard
            title="Long Analysis"
            centerLabel="Profit"
            centerValue={formatCurrency(analytics.longAnalysis.net)}
            goodValue={analytics.longAnalysis.grossProfit}
            badValue={analytics.longAnalysis.grossLossAbs}
            footer={
              <div className="grid grid-cols-3 gap-4">
                <MiniStat
                  label={`Wins (${analytics.longAnalysis.wins})`}
                  value={formatCompactCurrency(analytics.longAnalysis.grossProfit)}
                />
                <MiniStat
                  label="Win Rate"
                  value={formatPercent(analytics.longAnalysis.winRate)}
                  align="center"
                />
                <MiniStat
                  label={`Losses (${analytics.longAnalysis.losses})`}
                  value={formatCompactCurrency(analytics.longAnalysis.grossLossAbs)}
                  align="right"
                />
              </div>
            }
          />
        </div>

        <Card className="rounded-xl border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Account Balance</h3>
                <p className="mt-1 text-sm text-slate-500">Closed-trade balance trend for {activeRangeLabel.toLowerCase()}.</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="border-neutral-200">
                {activeRangeLabel}
              </Button>
            </div>
            <div className="h-[360px] px-4 py-5">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analytics.balanceSeries} margin={{ left: 8, right: 8, top: 12, bottom: 6 }}>
                  <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: TEXT_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(value) => formatCompactCurrency(Number(value))}
                    tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name) => [
                      formatCurrency(tooltipNumber(value)),
                      name === "balance" ? "Balance" : "Equity",
                    ]}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#C0CADB" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="balance" stroke={BLUE} strokeWidth={3} dot={{ r: 3, fill: BLUE }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <h3 className="text-xl font-semibold text-slate-900">P&L by trade length</h3>
              </div>
              <div className="px-4 py-4">
                <DurationBoxPlot data={analytics.boxPlotData} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <h3 className="text-xl font-semibold text-slate-900">P&L by trade duration</h3>
              </div>
              <div className="h-[290px] px-4 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                    <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 4" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Duration"
                      unit="m"
                      tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="PnL"
                      tickFormatter={(value) => formatCompactCurrency(Number(value))}
                      tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 4" }}
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) =>
                        name === "y"
                          ? [formatCurrency(tooltipNumber(value)), "P&L"]
                          : [`${tooltipNumber(value).toFixed(2)}m`, "Duration"]
                      }
                    />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />
                    <Scatter data={analytics.scatterData}>
                      {analytics.scatterData.map((point, index) => (
                        <Cell key={index} fill={point.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <h3 className="text-xl font-semibold text-slate-900">Profit by market</h3>
              </div>
              <div className="h-[300px] px-4 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.profitByInstrument} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 4" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: TEXT_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(value) => formatCompactCurrency(Number(value))} tick={{ fill: TEXT_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => [formatCurrency(tooltipNumber(value)), "Net P&L"]}
                    />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                      {analytics.profitByInstrument.map((item) => (
                        <Cell key={item.label} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 px-5 py-4">
                <h3 className="text-xl font-semibold text-slate-900">Trading volume by market</h3>
              </div>
              <div className="h-[300px] px-4 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.volumeByInstrument} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 4" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: TEXT_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: TEXT_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => [tooltipNumber(value).toFixed(2), "Lots used"]}
                    />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />
                    <Bar dataKey="value" fill={GREEN} radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
    </>
  )
}
