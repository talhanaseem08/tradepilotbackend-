import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import SmallAreaChart from "@/components/charts/SmallAreaChart"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import { clearSession } from "@/lib/auth"
import {
  explainCryptoTrade,
  fetchBots,
  fetchTrades,
  type BotSummary,
  type TradeExplanation,
  type TradeRecord,
} from "@/lib/api"
import { filterTradesByMarket } from "@/lib/market"
import {
  ChevronDown,
  Copy,
  Filter,
  Info,
  ListFilter,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react"

type OutcomeFilter = "all" | "win" | "loss" | "even"
type SideFilter = "all" | "buy" | "sell"

function isClosedTrade(trade: TradeRecord) {
  return trade.status === "closed" && trade.pnl != null
}

function isOpenTrade(trade: TradeRecord) {
  const status = trade.status?.trim().toLowerCase()
  return (
    status === "open" ||
    status === "filled" ||
    status === "active" ||
    status === "pending" ||
    status === "partially_filled"
  )
}

function closedTrades(trades: TradeRecord[]) {
  return trades.filter(isClosedTrade)
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function toDayKey(iso?: string) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`
}

function formatMoney(value: number, digits?: number) {
  const abs = Math.abs(value)
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits ?? (abs >= 1000 ? 0 : 2),
    maximumFractionDigits: digits ?? (abs >= 1000 ? 0 : 2),
  }).format(value)
}

function formatRatio(value: number) {
  if (!Number.isFinite(value)) return "0.00"
  return value.toFixed(2)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0.00%"
  return `${value.toFixed(2)}%`
}

function formatDate(value?: string) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function normalizeSide(direction?: string): "buy" | "sell" | "other" {
  const side = direction?.trim().toLowerCase()
  if (side === "buy" || side === "long") return "buy"
  if (side === "sell" || side === "short") return "sell"
  return "other"
}

function formatTradeStatus(status?: string) {
  if (!status) return "Unknown"
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function tradeStatusTone(status?: string) {
  const value = status?.trim().toLowerCase()
  if (value === "closed") return "bg-slate-100 text-slate-700"
  if (value === "filled" || value === "open" || value === "active") return "bg-emerald-100 text-emerald-700"
  if (value === "pending" || value === "partially_filled") return "bg-amber-100 text-amber-700"
  return "bg-slate-100 text-slate-600"
}

function computeMetrics(trades: TradeRecord[]) {
  const closed = closedTrades(trades)
  const pnlValues = closed.map((trade) => trade.pnl ?? 0)
  const netPnl = sum(pnlValues)

  const wins = closed.filter((trade) => (trade.pnl ?? 0) > 0)
  const losses = closed.filter((trade) => (trade.pnl ?? 0) < 0)
  const breakeven = closed.filter((trade) => (trade.pnl ?? 0) === 0)

  const grossProfit = sum(wins.map((trade) => trade.pnl ?? 0))
  const grossLossAbs = Math.abs(sum(losses.map((trade) => trade.pnl ?? 0)))
  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0
  const avgLossAbs = losses.length > 0 ? grossLossAbs / losses.length : 0

  const tradeWinRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0
  const profitFactor =
    grossLossAbs > 0 ? grossProfit / grossLossAbs : grossProfit > 0 ? grossProfit : 0
  const avgWinLossRatio =
    avgLossAbs > 0 ? avgWin / avgLossAbs : avgWin > 0 ? avgWin : 0

  const cumulativeSeries: number[] = []
  let running = 0
  for (const trade of closed
    .slice()
    .sort(
      (a, b) =>
        new Date(a.closed_at ?? a.timestamp ?? 0).getTime() -
        new Date(b.closed_at ?? b.timestamp ?? 0).getTime()
    )) {
    running += trade.pnl ?? 0
    cumulativeSeries.push(Number(running.toFixed(2)))
  }

  const closedPerDay = new Map<string, number>()
  for (const trade of closed) {
    const key = toDayKey(trade.closed_at ?? trade.timestamp)
    if (!key) continue
    closedPerDay.set(key, (closedPerDay.get(key) ?? 0) + 1)
  }

  return {
    closedCount: closed.length,
    netPnl,
    tradeWinRate,
    profitFactor,
    avgWinLossRatio,
    wins: wins.length,
    losses: losses.length,
    breakeven: breakeven.length,
    avgWin,
    avgLossAbs,
    cumulativeSeries,
    activeDays: closedPerDay.size,
  }
}

function deriveTradeInsight(trade: TradeRecord) {
  const pnl = trade.pnl ?? 0
  if (pnl > 200) return "Strong execution"
  if (pnl > 0) return "Controlled win"
  if (pnl < -200) return "High impact loss"
  if (pnl < 0) return "Controlled loss"
  return "Breakeven management"
}

function deriveTradeScale(trade: TradeRecord) {
  const pnl = trade.pnl ?? 0
  const magnitude = Math.min(Math.abs(pnl) / 400, 1)
  return {
    width: `${Math.max(magnitude * 100, 6)}%`,
    color: pnl >= 0 ? "#59C593" : "#E0526B",
  }
}

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  return Promise.reject(new Error("Clipboard API unavailable"))
}

function KpiCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[124px] flex-col rounded-lg border-0 bg-card px-4 py-3 shadow-sm">
      {children}
    </div>
  )
}

function KpiTitle({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-slate-500">
      <span>{title}</span>
      <Info className="size-3.5 opacity-60" />
      {badge ? (
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          {badge}
        </span>
      ) : null}
    </div>
  )
}

function MiniDonut({
  segments,
  size = 70,
  strokeWidth = 6,
}: {
  segments: { value: number; color: string }[]
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((acc, segment) => acc + Math.max(segment.value, 0), 0)

  if (total <= 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
      </svg>
    )
  }

  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-100"
      />
      {segments.map((segment, index) => {
        const value = Math.max(segment.value, 0)
        const length = (value / total) * circumference
        const node = (
          <circle
            key={`${segment.color}-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(length - 2, 0)} ${circumference}`}
            strokeDashoffset={-offset}
          />
        )
        offset += length
        return node
      })}
    </svg>
  )
}

function CountLegend({
  items,
}: {
  items: { color: string; value: number }[]
}) {
  return (
    <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold">
      {items.map((item, index) => (
        <div key={`${item.color}-${index}`} className="flex items-center gap-1.5 text-slate-400">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function AvgWinLossBar({
  avgWin,
  avgLossAbs,
}: {
  avgWin: number
  avgLossAbs: number
}) {
  const total = avgWin + avgLossAbs
  const winWidth = total > 0 ? (avgWin / total) * 100 : 50
  const lossWidth = total > 0 ? (avgLossAbs / total) * 100 : 50

  return (
    <div className="mt-auto pt-3">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="flex h-full">
          <div className="bg-[#6DD3A0]" style={{ width: `${winWidth}%` }} />
          <div className="bg-[#EA5D73]" style={{ width: `${lossWidth}%` }} />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-[#45B369]">{formatMoney(avgWin)}</span>
        <span className="text-[#E0526B]">-{formatMoney(avgLossAbs).replace("-", "")}</span>
      </div>
    </div>
  )
}

function TradeJournalLoadingSkeleton({ activeMarket }: { activeMarket: string }) {
  return (
    <div className="space-y-6 [&_[data-slot=skeleton]]:bg-neutral-200/80 dark:[&_[data-slot=skeleton]]:bg-slate-700">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[124px] flex-col rounded-xl border border-neutral-200/70 bg-card p-4 shadow-sm dark:border-slate-700"
          >
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-9 w-28" />
            <Skeleton className="mt-auto h-3 w-36" />
          </div>
        ))}
      </div>

      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-5">
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-96 max-w-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="px-5 py-4">
            <div className="overflow-hidden rounded-xl">
              <div className="grid grid-cols-7 gap-4 border-b border-[#D8E7F7] bg-[#F5FAFF] px-4 py-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="h-3 w-full" />
                ))}
              </div>
              <div className="space-y-3 px-4 py-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-5">
            <div>
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-2 h-4 w-[520px] max-w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>
          <div className="px-5 py-4">
            <Skeleton className="mb-3 h-4 w-44" />
            <div className="overflow-hidden rounded-xl">
              <div className="grid grid-cols-[44px_1.05fr_1fr_0.9fr_1.05fr_0.95fr_0.95fr_0.9fr_0.75fr_1.25fr_0.9fr] gap-4 border-b border-[#F2D6C2] bg-[#FFF7F2] px-4 py-3">
                {Array.from({ length: 11 }).map((_, index) => (
                  <Skeleton key={index} className="h-3 w-full" />
                ))}
              </div>
              <div className="space-y-3 px-4 py-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Loading {activeMarket === "crypto" ? "crypto" : "forex"} trades...
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default function TradeJournal() {
  const { activeMarket } = useDashboardMarket()
  const [allTrades, setAllTrades] = useState<TradeRecord[]>([])
  const [allBots, setAllBots] = useState<BotSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all")
  const [sideFilter, setSideFilter] = useState<SideFilter>("all")
  const [symbolFilter, setSymbolFilter] = useState<string>("all")
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [explanationTrade, setExplanationTrade] = useState<TradeRecord | null>(null)
  const [explanation, setExplanation] = useState<TradeExplanation | null>(null)
  const [explanationLoading, setExplanationLoading] = useState(false)
  const [explanationError, setExplanationError] = useState<string | null>(null)
  const [explanationCache, setExplanationCache] = useState<Record<string, TradeExplanation>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchTrades({ limit: 500, page: 1 }),
      fetchBots(),
    ])
      .then(([tradesResult, botsResult]) => {
        if (cancelled) return
        if (
          (!tradesResult.ok && tradesResult.status === 401) ||
          (!botsResult.ok && botsResult.status === 401)
        ) {
          clearSession()
          window.location.replace("/auth/login")
          return
        }
        if (tradesResult.ok) {
          setAllTrades(tradesResult.data.trades)
        } else {
          setError(tradesResult.message)
        }

        if (botsResult.ok) {
          setAllBots(botsResult.data.bots)
        }
      })
      .catch(() => {
        if (!cancelled) setError("We could not load your trades. Please refresh the page.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const marketTrades = useMemo(
    () => filterTradesByMarket(allTrades, activeMarket, allBots),
    [activeMarket, allBots, allTrades]
  )

  const botById = useMemo(
    () => new Map(allBots.map((bot) => [bot.id, bot])),
    [allBots]
  )

  const marketClosedTrades = useMemo(
    () => marketTrades.filter(isClosedTrade),
    [marketTrades]
  )

  const marketOpenTrades = useMemo(
    () => marketTrades.filter(isOpenTrade),
    [marketTrades]
  )

  const monthOptions = useMemo(() => {
    const months = new Map<string, string>()
    for (const trade of marketClosedTrades) {
      const source = trade.closed_at ?? trade.timestamp
      if (!source) continue
      const date = new Date(source)
      if (Number.isNaN(date.getTime())) continue
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
      months.set(key, label)
    }
    return [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [marketClosedTrades])

  const symbolOptions = useMemo(() => {
    return [...new Set(marketClosedTrades.map((trade) => trade.symbol).filter(Boolean))].sort()
  }, [marketClosedTrades])

  const filteredTrades = useMemo(() => {
    return marketClosedTrades.filter((trade) => {
      const source = trade.closed_at ?? trade.timestamp
      const pnl = trade.pnl ?? 0
      const tradeSide = normalizeSide(trade.direction)

      if (monthFilter !== "all") {
        if (!source) return false
        const date = new Date(source)
        if (Number.isNaN(date.getTime())) return false
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (key !== monthFilter) return false
      }

      if (outcomeFilter === "win" && pnl <= 0) return false
      if (outcomeFilter === "loss" && pnl >= 0) return false
      if (outcomeFilter === "even" && pnl !== 0) return false

      if (sideFilter !== "all" && tradeSide !== sideFilter) return false
      if (symbolFilter !== "all" && trade.symbol !== symbolFilter) return false

      return true
    })
  }, [marketClosedTrades, monthFilter, outcomeFilter, sideFilter, symbolFilter])

  const metrics = useMemo(() => computeMetrics(filteredTrades), [filteredTrades])

  const selectedTrades = useMemo(
    () => filteredTrades.filter((trade) => selectedIds.includes(trade._id)),
    [filteredTrades, selectedIds]
  )

  const allVisibleSelected =
    filteredTrades.length > 0 && filteredTrades.every((trade) => selectedIds.includes(trade._id))

  const someVisibleSelected =
    filteredTrades.some((trade) => selectedIds.includes(trade._id)) && !allVisibleSelected

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => filteredTrades.some((trade) => trade._id === id)))
  }, [filteredTrades])

  const handleToggleAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds(filteredTrades.map((trade) => trade._id))
      return
    }
    setSelectedIds([])
  }

  const handleToggleRow = (tradeId: string, checked: boolean | "indeterminate") => {
    setSelectedIds((current) => {
      if (checked === true) return [...new Set([...current, tradeId])]
      return current.filter((id) => id !== tradeId)
    })
  }

  const resetFilters = () => {
    setMonthFilter("all")
    setOutcomeFilter("all")
    setSideFilter("all")
    setSymbolFilter("all")
  }

  const activeFilterCount = [monthFilter, outcomeFilter, sideFilter, symbolFilter].filter(
    (value) => value !== "all"
  ).length

  const handleCopySymbols = async () => {
    const symbols = [...new Set(selectedTrades.map((trade) => trade.symbol))].join(", ")
    if (!symbols) return
    await copyToClipboard(symbols)
  }

  const handleCopySummary = async () => {
    const summary = selectedTrades
      .map(
        (trade) =>
          `${formatDate(trade.closed_at ?? trade.timestamp)} | ${trade.symbol} | ${normalizeSide(
            trade.direction
          ).toUpperCase()} | ${formatMoney(trade.pnl ?? 0)}`
      )
      .join("\n")
    if (!summary) return
    await copyToClipboard(summary)
  }

  const handleExplainTrade = async (trade: TradeRecord) => {
    setExplanationTrade(trade)
    setExplanationOpen(true)
    setExplanationError(null)

    const cached = explanationCache[trade._id]
    if (cached) {
      setExplanation(cached)
      setExplanationLoading(false)
      return
    }

    setExplanation(null)
    setExplanationLoading(true)
    const bot = trade.botID ? botById.get(trade.botID) : null
    const result = await explainCryptoTrade(trade, bot)
    if (result.ok) {
      setExplanation(result.data)
      setExplanationCache((current) => ({ ...current, [trade._id]: result.data }))
    } else {
      setExplanationError(result.message)
    }
    setExplanationLoading(false)
  }

  if (loading) {
    return <TradeJournalLoadingSkeleton activeMarket={activeMarket} />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[124px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard>
              <KpiTitle title="Net cumulative P&L" badge={String(metrics.closedCount)} />
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <div
                    className={`text-[32px] font-bold leading-none tracking-tight ${
                      metrics.netPnl >= 0 ? "text-[#59C593]" : "text-[#E0526B]"
                    }`}
                  >
                    {formatMoney(metrics.netPnl)}
                  </div>
                </div>
                <div className="flex size-9 items-center justify-center rounded-full bg-[#f4ecff] text-[#9E77ED]">
                  <span className="text-sm font-bold">{metrics.netPnl >= 0 ? "↗" : "↘"}</span>
                </div>
              </div>
              <div className="mt-auto pt-2">
                <SmallAreaChart
                  data={metrics.cumulativeSeries.length > 0 ? metrics.cumulativeSeries : [0, 0]}
                  chartColor="#59C593"
                  chartWidth={180}
                  chartHeight={44}
                />
              </div>
            </KpiCard>

            <KpiCard>
              <KpiTitle title="Profit factor" />
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <div className="text-[32px] font-bold leading-none tracking-tight text-slate-900">
                    {formatRatio(metrics.profitFactor)}
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Gross profit vs gross loss
                  </p>
                </div>
                <MiniDonut
                  segments={[
                    { value: metrics.avgWin * metrics.wins, color: "#58C58B" },
                    { value: metrics.avgLossAbs * metrics.losses, color: "#E0526B" },
                  ]}
                />
              </div>
            </KpiCard>

            <KpiCard>
              <KpiTitle title="Trade win %" />
              <div className="flex flex-1 items-start justify-between gap-3">
                <div className="pt-1 text-[32px] font-bold leading-none tracking-tight text-slate-900">
                  {formatPercent(metrics.tradeWinRate)}
                </div>
                <MiniDonut
                  segments={[
                    { value: metrics.wins, color: "#58C58B" },
                    { value: metrics.breakeven, color: "#6B7A99" },
                    { value: metrics.losses, color: "#E0526B" },
                  ]}
                />
              </div>
              <CountLegend
                items={[
                  { color: "#58C58B", value: metrics.wins },
                  { color: "#6B7A99", value: metrics.breakeven },
                  { color: "#E0526B", value: metrics.losses },
                ]}
              />
            </KpiCard>

            <KpiCard>
              <KpiTitle title="Avg win/loss trade" />
              <div className="flex flex-1 items-start justify-between gap-3">
                <div className="pt-1 text-[32px] font-bold leading-none tracking-tight text-slate-900">
                  {formatRatio(metrics.avgWinLossRatio)}
                </div>
                <div className="pt-1 text-right text-xs font-medium leading-5 text-slate-400">
                  <div>{metrics.wins} winners</div>
                  <div>{metrics.losses} losers</div>
                </div>
              </div>
              <AvgWinLossBar avgWin={metrics.avgWin} avgLossAbs={metrics.avgLossAbs} />
            </KpiCard>
          </>
        )}
      </div>

      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-5">
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">
                {activeMarket === "crypto" ? "Spot positions" : "Open positions"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Open trades appear here until they close and move into your trade history.
              </p>
            </div>
            <Badge className="border-0 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {marketOpenTrades.length} live
            </Badge>
          </div>

          <div className="px-5 py-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : marketOpenTrades.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-200 px-6 py-10 text-center">
                <p className="text-base font-semibold text-slate-900">No open positions right now</p>
                <p className="mt-2 text-sm text-slate-500">
                  New filled trades will appear here until they are closed and moved into trade history.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl">
                <div className="grid grid-cols-[1.1fr_0.95fr_0.8fr_0.95fr_0.95fr_0.95fr_0.95fr] items-center gap-4 border-b border-[#D8E7F7] bg-[#F5FAFF] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5E7290]">
                  <span>Open date</span>
                  <span>Symbol</span>
                  <span>Side</span>
                  <span>Status</span>
                  <span className="text-right">Entry</span>
                  <span className="text-right">Stop loss</span>
                  <span className="text-right">Take profit</span>
                </div>

                <div className="max-h-[320px] overflow-auto">
                  {marketOpenTrades.map((trade, index) => {
                    const side = normalizeSide(trade.direction)
                    return (
                      <div
                        key={`${trade._id}-${index}`}
                        className="grid grid-cols-[1.1fr_0.95fr_0.8fr_0.95fr_0.95fr_0.95fr_0.95fr] items-center gap-4 border-b border-neutral-100 px-4 py-3 text-sm hover:bg-neutral-50"
                      >
                        <span className="font-medium text-slate-700">
                          {formatDate(trade.opened_at ?? trade.timestamp)}
                        </span>
                        <span className="font-semibold text-slate-900">{trade.symbol}</span>
                        <span className="font-medium uppercase text-slate-600">
                          {side === "other" ? "—" : side}
                        </span>
                        <span>
                          <Badge className={`border-0 px-2.5 py-1 text-[11px] font-semibold ${tradeStatusTone(trade.status)}`}>
                            {formatTradeStatus(trade.status)}
                          </Badge>
                        </span>
                        <span className="text-right font-medium text-slate-900">
                          {trade.entry_price != null ? formatMoney(trade.entry_price) : "—"}
                        </span>
                        <span className="text-right font-medium text-slate-900">
                          {trade.stop_loss != null ? formatMoney(trade.stop_loss) : "—"}
                        </span>
                        <span className="text-right font-medium text-slate-900">
                          {trade.take_profit != null ? formatMoney(trade.take_profit) : "—"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-5">
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">Trade history</h2>
              <p className="mt-1 text-sm text-slate-500">
                Closed-trade analytics live here. Open or freshly filled positions stay in the live positions panel above.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-[#F2D6C2] bg-[#FFF7F2] text-[#C97741] hover:bg-[#FCEBDE] hover:text-[#B96832]"
                  >
                    <Filter className="size-4" />
                    Filters
                    {activeFilterCount > 0 ? (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[320px] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Filter trades</p>
                      <p className="text-xs text-slate-500">Choose what you want to review in your trade history.</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
                      <RotateCcw className="size-3.5" />
                      Reset
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Month</label>
                      <Select value={monthFilter} onValueChange={setMonthFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All months" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All months</SelectItem>
                          {monthOptions.map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Outcome</label>
                      <Select value={outcomeFilter} onValueChange={(value) => setOutcomeFilter(value as OutcomeFilter)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All outcomes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All outcomes</SelectItem>
                          <SelectItem value="win">Wins only</SelectItem>
                          <SelectItem value="loss">Losses only</SelectItem>
                          <SelectItem value="even">Breakeven only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Side</label>
                      <Select value={sideFilter} onValueChange={(value) => setSideFilter(value as SideFilter)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All sides" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All sides</SelectItem>
                          <SelectItem value="buy">Buy only</SelectItem>
                          <SelectItem value="sell">Sell only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Symbol</label>
                      <Select value={symbolFilter} onValueChange={setSymbolFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All symbols" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All symbols</SelectItem>
                          {symbolOptions.map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/40 bg-background hover:bg-primary/5"
                  >
                    <ListFilter className="size-4" />
                    Bulk actions
                    <ChevronDown className="size-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSelectedIds(filteredTrades.map((trade) => trade._id))}>
                    Select visible rows
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedIds([])}>Clear selection</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={selectedTrades.length === 0} onClick={() => void handleCopySymbols()}>
                    <Copy className="size-4" />
                    Copy selected symbols
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedTrades.length === 0} onClick={() => void handleCopySummary()}>
                    <Copy className="size-4" />
                    Copy selected summary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <div className="text-slate-500">
                {selectedTrades.length > 0 ? (
                  <span>
                    <span className="font-semibold text-slate-900">{selectedTrades.length}</span> selected for bulk actions
                  </span>
                ) : (
                  <span>
                    Showing <span className="font-semibold text-slate-900">{filteredTrades.length}</span> closed trades
                  </span>
                )}
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredTrades.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-200 px-6 py-16 text-center">
                <p className="text-base font-semibold text-slate-900">No trades match your filters</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try another month, symbol, side, or result.
                </p>
                <Button type="button" variant="outline" className="mt-4" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl">
                <div className="grid grid-cols-[44px_1.05fr_1fr_0.9fr_1.05fr_0.95fr_0.95fr_0.9fr_0.75fr_1.25fr_0.9fr] items-center gap-4 border-b border-[#F2D6C2] bg-[#FFF7F2] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8B6A54]">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                      onCheckedChange={handleToggleAll}
                      aria-label="Select all visible trades"
                    />
                  </div>
                  <span>Open date</span>
                  <span>Symbol</span>
                  <span>Status</span>
                  <span>Close date</span>
                  <span className="text-right">Entry price</span>
                  <span className="text-right">Exit price</span>
                  <span className="text-right">Net P&amp;L</span>
                  <span className="text-right">Net ROI</span>
                  <span>Pilot insights</span>
                  <span>Pilot scale</span>
                </div>

                <div className="max-h-[740px] overflow-auto">
                  {filteredTrades.map((trade, index) => {
                    const pnl = trade.pnl ?? 0
                    const entryValue = trade.entry_price ?? 0
                    const exitValue = trade.exit_price ?? trade.entry_price ?? 0
                    const roiBase = entryValue > 0 ? entryValue : 0
                    const roi = roiBase > 0 ? (pnl / roiBase) * 100 : null
                    const scale = deriveTradeScale(trade)
                    const selected = selectedIds.includes(trade._id)

                    return (
                      <div
                        key={`${trade._id}-${index}`}
                        className={`grid grid-cols-[44px_1.05fr_1fr_0.9fr_1.05fr_0.95fr_0.95fr_0.9fr_0.75fr_1.25fr_0.9fr] items-center gap-4 border-b border-neutral-100 px-4 py-3 text-sm transition-colors hover:bg-neutral-50 ${
                          selected ? "bg-primary/5" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={selected}
                            onCheckedChange={(checked) => handleToggleRow(trade._id, checked)}
                            aria-label={`Select trade ${trade._id}`}
                          />
                        </div>
                        <span className="font-medium text-slate-700">{formatDate(trade.opened_at ?? trade.timestamp)}</span>
                        <span className="font-semibold text-slate-900">{trade.symbol}</span>
                        <span>
                          <Badge
                            className={`border-0 px-2.5 py-1 text-[11px] font-semibold ${
                              pnl > 0
                                ? "bg-green-100 text-green-700"
                                : pnl < 0
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {pnl > 0 ? "WIN" : pnl < 0 ? "LOSS" : "EVEN"}
                          </Badge>
                        </span>
                        <span className="font-medium text-slate-700">{formatDate(trade.closed_at ?? trade.timestamp)}</span>
                        <span className="text-right font-medium text-slate-900">
                          {entryValue ? formatMoney(entryValue) : "—"}
                        </span>
                        <span className="text-right font-medium text-slate-900">
                          {trade.exit_price != null ? formatMoney(exitValue) : "—"}
                        </span>
                        <span className={`text-right font-semibold ${pnl >= 0 ? "text-[#45B369]" : "text-[#E0526B]"}`}>
                          {formatMoney(pnl)}
                        </span>
                        <span className={`text-right font-semibold ${roi != null && roi >= 0 ? "text-[#45B369]" : "text-[#E0526B]"}`}>
                          {roi != null ? formatPercent(roi) : "—"}
                        </span>
                        <span className="flex flex-wrap items-center gap-2 text-slate-600">
                          <span>{deriveTradeInsight(trade)}</span>
                          {activeMarket === "crypto" ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 rounded-full border-primary/30 px-2 text-[11px] font-semibold text-primary hover:bg-primary/10"
                              onClick={() => void handleExplainTrade(trade)}
                            >
                              <Sparkles className="size-3" />
                              Explain
                            </Button>
                          ) : null}
                        </span>
                        <span>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: scale.width,
                                backgroundColor: scale.color,
                              }}
                            />
                          </div>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={explanationOpen} onOpenChange={setExplanationOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Trade explanation</DialogTitle>
          </DialogHeader>

          {explanationTrade ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{explanationTrade.symbol}</p>
                  <p className="text-slate-500">
                    {formatDate(explanationTrade.closed_at ?? explanationTrade.timestamp)} ·{" "}
                    {(explanationTrade.direction ?? "trade").toUpperCase()}
                  </p>
                </div>
                <Badge
                  className={`border-0 px-2.5 py-1 text-[11px] font-semibold ${
                    (explanationTrade.pnl ?? 0) >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formatMoney(explanationTrade.pnl ?? 0)}
                </Badge>
              </div>
            </div>
          ) : null}

          {explanationLoading ? (
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-5 text-sm text-slate-600">
              <Loader2 className="size-4 animate-spin text-primary" />
              Reviewing this trade...
            </div>
          ) : explanationError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {explanationError}
            </div>
          ) : explanation ? (
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Summary</p>
                <p className="mt-1 font-medium text-slate-900">{explanation.summary}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">What happened</p>
                <p className="mt-1 leading-6 text-slate-700">{explanation.why_it_happened}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">What to learn</p>
                <p className="mt-1 leading-6 text-slate-700">{explanation.lesson}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-700">Risk reminder</p>
                <p className="mt-1 leading-6 text-amber-800">{explanation.risk_note}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
