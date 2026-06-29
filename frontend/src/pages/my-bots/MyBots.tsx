import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMarket } from "@/context/DashboardMarketContext";
import DashboardBreadcrumb from "@/layouts/Breadcrumb";
import {
  deleteBot,
  fetchBots,
  fetchTrades,
  updateBotStatus,
  type BotLifecycleStatus,
  type BotSummary,
  type TradeRecord,
} from "@/lib/api";
import { clearSession } from "@/lib/auth";
import { filterBotsByMarket } from "@/lib/market";
import {
  Activity,
  Bot,
  CircleDot,
  Clock3,
  Pause,
  Play,
  Search,
  Sparkles,
  Square,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type StatusFilter = "all" | BotLifecycleStatus;
type SortKey = "pnl" | "trades" | "symbol" | "winRate";

type BotWithStats = BotSummary & {
  tradeCount: number
  openTrades: number
  closedTrades: number
  netPnl: number
  wins: number
  losses: number
  winRate: number
  lotsUsed: number
  bestTrade: number
  worstTrade: number
  lastTradeAt?: string
}

function isManualExecutionTest(trade: TradeRecord) {
  return trade.source === "manual_oanda_test" || trade.source === "manual_binance_test"
}

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
  }).format(value)
}

function formatBotType(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value?: string) {
  if (!value) return "No trades yet"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "No trades yet"
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusTone(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    case "paused":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    case "stopped":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
    default:
      return "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
  }
}

function botTypeChip(botType: string) {
  const value = botType.toLowerCase()
  if (value.includes("high")) return "bg-rose-50 text-rose-700"
  if (value.includes("medium")) return "bg-amber-50 text-amber-700"
  return "bg-emerald-50 text-emerald-700"
}

function KpiCard({
  title,
  value,
  subtext,
  icon: Icon,
  valueClassName = "text-slate-900",
}: {
  title: string
  value: string
  subtext: string
  icon: React.ComponentType<{ className?: string }>
  valueClassName?: string
}) {
  return (
    <div className="flex min-h-[122px] flex-col rounded-2xl border-0 bg-card px-4 py-3 shadow-none">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-500">
        <Icon className="size-4 opacity-70" />
        <span>{title}</span>
      </div>
      <div className={`mt-auto text-[32px] font-bold leading-none tracking-tight ${valueClassName}`}>
        {value}
      </div>
      <p className="mt-3 text-sm text-slate-500">{subtext}</p>
    </div>
  )
}

function MyBotsLoadingSkeleton() {
  return (
    <div className="space-y-6 [&_[data-slot=skeleton]]:bg-neutral-200/80 dark:[&_[data-slot=skeleton]]:bg-slate-700">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[122px] flex-col rounded-2xl border border-neutral-200/70 bg-card px-4 py-3 shadow-sm dark:border-slate-700"
          >
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-auto h-9 w-24" />
            <Skeleton className="mt-3 h-4 w-44" />
          </div>
        ))}
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 w-full rounded-lg sm:max-w-xs" />
              <Skeleton className="h-10 w-full rounded-lg sm:w-[170px]" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Skeleton className="h-10 w-full rounded-lg sm:w-[170px]" />
              <Skeleton className="h-10 w-full rounded-lg sm:w-[132px]" />
              <Skeleton className="h-10 w-full rounded-lg sm:w-[118px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden rounded-[26px] border-0 bg-card shadow-sm">
            <CardHeader className="border-b border-neutral-200/80 pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-11 rounded-2xl" />
                    <div>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="mt-2 h-4 w-36" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 lg:max-w-[320px]">
                  <Skeleton className="h-9 w-20 rounded-lg" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, metricIndex) => (
                  <Skeleton key={metricIndex} className="h-20 rounded-2xl" />
                ))}
              </div>
              <div className="rounded-[22px] bg-white/80 p-4 dark:bg-slate-800/60">
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, pulseIndex) => (
                    <Skeleton key={pulseIndex} className="h-16 rounded-lg" />
                  ))}
                </div>
                <Skeleton className="mt-5 h-3 w-full rounded-full" />
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function MyBots() {
  const { activeMarket } = useDashboardMarket()
  const navigate = useNavigate()
  const [bots, setBots] = useState<BotSummary[]>([])
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<SortKey>("pnl")
  const [pendingStatus, setPendingStatus] = useState<Record<string, boolean>>({})
  const [pendingDelete, setPendingDelete] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([fetchBots(), fetchTrades({ limit: 500, page: 1 })])
      .then(([botsRes, tradesRes]) => {
        if (cancelled) return

        if (
          (!botsRes.ok && botsRes.status === 401) ||
          (!tradesRes.ok && tradesRes.status === 401)
        ) {
          clearSession()
          toast.error("Your session has expired. Please sign in again.")
          window.location.replace("/auth/login")
          return
        }

        if (botsRes.ok) setBots(botsRes.data.bots)
        else toast.error(botsRes.message)

        if (tradesRes.ok) setTrades(tradesRes.data.trades)
        else toast.error(tradesRes.message)
      })
      .catch(() => {
        if (!cancelled) toast.error("We could not load your bots. Please refresh the page.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const marketBots = useMemo(() => filterBotsByMarket(bots, activeMarket), [activeMarket, bots])
  const marketBotIds = useMemo(() => new Set(marketBots.map((bot) => bot.id)), [marketBots])

  const botTrades = useMemo(
    () =>
      trades.filter(
        (trade) => trade.botID && marketBotIds.has(trade.botID) && !isManualExecutionTest(trade)
      ),
    [marketBotIds, trades]
  )

  const botsWithStats = useMemo<BotWithStats[]>(() => {
    return marketBots.map((bot) => {
      const ownTrades = botTrades.filter((trade) => trade.botID === bot.id)
      const openTrades = ownTrades.filter(isOpenTrade)
      const closedTrades = ownTrades.filter(isClosedTrade)
      const netPnl = closedTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
      const wins = closedTrades.filter((trade) => (trade.pnl ?? 0) > 0).length
      const losses = closedTrades.filter((trade) => (trade.pnl ?? 0) < 0).length
      const lotsUsed = closedTrades.reduce((sum, trade) => sum + Math.abs(trade.lots ?? 0), 0)
      const bestTrade = closedTrades.reduce((best, trade) => Math.max(best, trade.pnl ?? 0), 0)
      const worstTrade = closedTrades.reduce((worst, trade) => Math.min(worst, trade.pnl ?? 0), 0)
      const lastTrade = [...ownTrades]
        .sort((a, b) => {
          const at = new Date(a.closed_at ?? a.timestamp ?? 0).getTime()
          const bt = new Date(b.closed_at ?? b.timestamp ?? 0).getTime()
          return bt - at
        })
        .at(0)

      return {
        ...bot,
        tradeCount: ownTrades.length,
        openTrades: openTrades.length,
        closedTrades: closedTrades.length,
        netPnl,
        wins,
        losses,
        winRate: closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0,
        lotsUsed,
        bestTrade,
        worstTrade,
        lastTradeAt: lastTrade?.closed_at ?? lastTrade?.timestamp,
      }
    })
  }, [botTrades, marketBots])

  const visibleBots = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = botsWithStats.filter((bot) => {
      const matchesSearch =
        !query ||
        bot.symbol.toLowerCase().includes(query) ||
        bot.bot_type.toLowerCase().includes(query) ||
        bot.timeframe.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "all" ? true : bot.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "trades":
          return b.tradeCount - a.tradeCount
        case "symbol":
          return a.symbol.localeCompare(b.symbol)
        case "winRate":
          return b.winRate - a.winRate
        case "pnl":
        default:
          return b.netPnl - a.netPnl
      }
    })
  }, [botsWithStats, search, sortBy, statusFilter])

  const summary = useMemo(() => {
    const totalPnl = botsWithStats.reduce((sum, bot) => sum + bot.netPnl, 0)
    const totalTrades = botsWithStats.reduce((sum, bot) => sum + bot.closedTrades, 0)
    const totalOpenTrades = botsWithStats.reduce((sum, bot) => sum + bot.openTrades, 0)
    const activeBots = botsWithStats.filter((bot) => bot.status === "active").length
    const pausedBots = botsWithStats.filter((bot) => bot.status === "paused").length
    const stoppedBots = botsWithStats.filter((bot) => bot.status === "stopped").length

    return { totalBots: botsWithStats.length, activeBots, pausedBots, stoppedBots, totalPnl, totalTrades, totalOpenTrades }
  }, [botsWithStats])

  async function handleStatusChange(botId: string, status: BotLifecycleStatus) {
    setPendingStatus((prev) => ({ ...prev, [botId]: true }))
    const result = await updateBotStatus(botId, status)
    if (!result.ok) {
      toast.error(result.message)
      setPendingStatus((prev) => ({ ...prev, [botId]: false }))
      return
    }

    setBots((prev) => prev.map((bot) => (bot.id === botId ? { ...bot, status } : bot)))
    setPendingStatus((prev) => ({ ...prev, [botId]: false }))
    toast.success(`Bot ${status === "active" ? "resumed" : status} successfully.`)
  }

  async function handleDeleteBot(bot: BotSummary) {
    const confirmed = window.confirm(
      `Delete ${bot.symbol} ${activeMarket === "crypto" ? "crypto" : "forex"} bot? This removes the bot from your account.`
    )
    if (!confirmed) return

    setPendingDelete((prev) => ({ ...prev, [bot.id]: true }))
    const result = await deleteBot(bot.id)
    if (!result.ok) {
      if (result.status === 401) {
        clearSession()
        toast.error("Your session has expired. Please sign in again.")
        window.location.replace("/auth/login")
        return
      }
      toast.error(result.message)
      setPendingDelete((prev) => ({ ...prev, [bot.id]: false }))
      return
    }

    setBots((prev) => prev.filter((item) => item.id !== bot.id))
    setPendingDelete((prev) => ({ ...prev, [bot.id]: false }))
    toast.success("Bot deleted successfully.")
  }

  return (
    <>
      <DashboardBreadcrumb
        title="My Bots"
        text={`${activeMarket === "crypto" ? "Crypto" : "Forex"} Bot Management`}
      />

      <div className="space-y-6">
        {loading ? (
          <MyBotsLoadingSkeleton />
        ) : (
          <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Total bots"
                value={String(summary.totalBots)}
                subtext={`${activeMarket === "crypto" ? "Crypto" : "Forex"} bots in this workspace`}
                icon={Bot}
              />
              <KpiCard
                title="Active bots"
                value={String(summary.activeBots)}
                subtext={`${summary.pausedBots} paused · ${summary.stoppedBots} stopped`}
                icon={Activity}
                valueClassName="text-emerald-600"
              />
              <KpiCard
                title="Bot trades"
                value={String(summary.totalTrades)}
                subtext={`${summary.totalOpenTrades} open positions · closed trades executed by bots only`}
                icon={TrendingUp}
              />
              <KpiCard
                title="Net bot P&L"
                value={formatCurrency(summary.totalPnl)}
                subtext="Total closed-trade result for your visible bots"
                icon={Wallet}
                valueClassName={summary.totalPnl >= 0 ? "text-emerald-600" : "text-rose-600"}
              />
        </div>

        <Card className="rounded-2xl border-0 shadow-none">
          <CardContent className="py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by symbol, strategy, or timeframe"
                    className="h-10 pl-9"
                  />
                </div>

                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="h-10 w-full sm:w-[170px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
                  <SelectTrigger className="h-10 w-full sm:w-[170px]">
                    <SelectValue placeholder="Sort bots" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pnl">Sort by P&L</SelectItem>
                    <SelectItem value="trades">Sort by trades</SelectItem>
                    <SelectItem value="winRate">Sort by win rate</SelectItem>
                    <SelectItem value="symbol">Sort by symbol</SelectItem>
                  </SelectContent>
                </Select>

                <Button asChild variant="outline" className="h-10 border-neutral-200/70">
                  <Link to="/backtest">
                    <Activity className="size-4" />
                    Backtest Lab
                  </Link>
                </Button>
                <Button asChild className="h-10">
                  <Link to="/prompt">
                    <Sparkles className="size-4" />
                    Create Bot
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {visibleBots.length === 0 ? (
          <Card className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 shadow-none">
            <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <Bot className="size-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                No {activeMarket === "crypto" ? "crypto" : "forex"} bots found
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter to see more bots."
                  : "Create your first bot for this market. It will appear here with simple controls and performance details."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/prompt">
                    <Sparkles className="size-4" />
                    Create Bot
                  </Link>
                </Button>
                {(search || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    className="border-neutral-200/70"
                    onClick={() => {
                      setSearch("")
                      setStatusFilter("all")
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {visibleBots.map((bot) => {
              const isBusy = Boolean(pendingStatus[bot.id])
              const isDeleting = Boolean(pendingDelete[bot.id])
              const chipTone = botTypeChip(bot.bot_type)

              return (
                <Card
                  key={bot.id}
                  className="group overflow-hidden rounded-[26px] border-0 bg-card shadow-none transition-all duration-300 hover:-translate-y-0.5"
                >
                  <CardHeader className="relative border-b border-neutral-200/80 pb-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${chipTone}`}>
                            {formatBotType(bot.bot_type)}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(bot.status)}`}>
                            {bot.status}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {bot.symbol}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                              <Bot className="size-5" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {bot.symbol} {activeMarket === "crypto" ? "Crypto Bot" : "Forex Bot"}
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm">
                                Last activity: {formatDate(bot.lastTradeAt)}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                              <Clock3 className="size-3.5" />
                              {bot.openTrades} open
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600">
                              <Clock3 className="size-3.5" />
                              {bot.closedTrades} closed
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 lg:max-w-[320px]">
                        {bot.status !== "active" && (
                          <Button size="sm" onClick={() => handleStatusChange(bot.id, "active")} disabled={isBusy}>
                            <Play className="size-4" />
                            {isBusy ? "Updating..." : "Resume"}
                          </Button>
                        )}
                        {bot.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-neutral-200/70"
                            onClick={() => handleStatusChange(bot.id, "paused")}
                            disabled={isBusy}
                          >
                            <Pause className="size-4" />
                            {isBusy ? "Updating..." : "Pause"}
                          </Button>
                        )}
                        {bot.status !== "stopped" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleStatusChange(bot.id, "stopped")}
                            disabled={isBusy}
                          >
                            <Square className="size-4" />
                            {isBusy ? "Updating..." : "Stop"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-neutral-200/70"
                          onClick={() => navigate("/backtest", { state: { selectedBotId: bot.id } })}
                          disabled={isBusy || isDeleting}
                        >
                          <Activity className="size-4" />
                          Backtest
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => void handleDeleteBot(bot)}
                          disabled={isBusy || isDeleting}
                        >
                          <Trash2 className="size-4" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-5 pt-5">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Open trades</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{bot.openTrades}</p>
                      </div>
                      <div className="rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Closed trades</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{bot.closedTrades}</p>
                      </div>
                      <div className="rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Win rate</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{bot.winRate.toFixed(2)}%</p>
                      </div>
                      <div className="rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lots used</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{bot.lotsUsed.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="rounded-[22px] bg-white/80 p-4 backdrop-blur-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Performance pulse</p>
                          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                            <CircleDot className="size-3.5" />
                            {bot.tradeCount} total trades
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Wins</p>
                            <p className="mt-2 text-lg font-semibold text-emerald-600">{bot.wins}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Losses</p>
                            <p className="mt-2 text-lg font-semibold text-rose-600">{bot.losses}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Best trade</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(bot.bestTrade)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Worst trade</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(bot.worstTrade)}</p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                            <span>Win momentum</span>
                            <span>{bot.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400"
                              style={{ width: `${Math.min(Math.max(bot.winRate, 6), 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{bot.wins} wins</span>
                            <span>{bot.losses} losses</span>
                          </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
          </>
        )}
      </div>
    </>
  )
}
