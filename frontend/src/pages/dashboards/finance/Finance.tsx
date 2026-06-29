import LazyWrapper from "@/components/LazyWrapper"
import Breadcrumb from "@/layouts/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import { clearSession } from "@/lib/auth"
import {
  fetchBots,
  fetchTrades,
  triggerBinanceTestExecution,
  triggerOandaTestExecution,
  type BotSummary,
  type TradeRecord,
} from "@/lib/api"
import { filterTradesByMarket } from "@/lib/market"
import { Loader2, Play } from "lucide-react"
import { lazy, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"

const AccountStatsCards = lazy(() => import("./components/AccountStatsCards"))
const PerformanceInsightRow = lazy(() => import("./components/PerformanceInsightRow"))
const TradeActivitySection = lazy(() => import("./components/TradeActivitySection"))

function DashboardLoadingSkeleton() {
  return (
    <div className="[&_[data-slot=skeleton]]:bg-neutral-200/80 dark:[&_[data-slot=skeleton]]:bg-slate-700">
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-neutral-200/70 bg-card p-4 shadow-sm dark:border-slate-700"
          >
            <div className="mb-5 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-9 w-28" />
            <Skeleton className="mt-4 h-3 w-36" />
            <Skeleton className="mt-5 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[430px] overflow-hidden rounded-lg border border-neutral-200/70 bg-card shadow-sm dark:border-slate-700"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-slate-500">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="p-6">
              <Skeleton className="h-[260px] w-full rounded-xl" />
              <Skeleton className="mt-7 h-3 w-full rounded-full" />
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="min-h-[360px] rounded-lg border border-neutral-200/70 bg-card p-5 shadow-sm dark:border-slate-700">
          <div className="mb-5 flex items-center gap-6">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-32" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[360px] rounded-lg border border-neutral-200/70 bg-card p-5 shadow-sm dark:border-slate-700">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-44" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Finance = () => {
  const { activeMarket } = useDashboardMarket()
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [bots, setBots] = useState<BotSummary[]>([])
  const [execLoading, setExecLoading] = useState(false)
  const [loading, setLoading] = useState(true)

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
        if (!cancelled) {
          toast.error("We couldn't load your dashboard. Please refresh the page.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredTrades = useMemo(
    () => filterTradesByMarket(trades, activeMarket, bots),
    [activeMarket, bots, trades]
  )

  async function runExecutionCycle() {
    setExecLoading(true)
    const res =
      activeMarket === "forex"
        ? await triggerOandaTestExecution()
        : await triggerBinanceTestExecution()
    setExecLoading(false)
    if (res.ok) {
      toast.success(
        `Test trade opened for ${res.data.symbol}. It will close automatically in ${Math.round(
          res.data.close_in_seconds / 60
        )} minutes.`
      )
      const t = await fetchTrades({ limit: 500, page: 1 })
      if (t.ok) setTrades(t.data.trades)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <>
      <Breadcrumb title="Dashboard" text="Trading overview" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-card px-5 py-4 shadow-sm ring-1 ring-primary/5 dark:bg-[#273142] dark:border-primary/30">
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          {activeMarket === "forex" ? (
            <>
              Open a small <strong className="text-slate-800 dark:text-white">OANDA practice</strong> trade to confirm your forex bot can connect and place orders.
              It will close automatically after 3 minutes.
            </>
          ) : (
            <>
              Open a small <strong className="text-slate-800 dark:text-white">Binance demo</strong> trade to confirm your crypto bot can connect and place orders.
              It will close automatically after 3 minutes.
            </>
          )}
        </p>
        <Button
          type="button"
          size="sm"
          disabled={execLoading}
          onClick={() => void runExecutionCycle()}
          className="border-0 bg-primary text-white shadow-sm hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
        >
          {execLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4" />
          )}
          Run test trade
        </Button>
      </div>

      {loading ? (
        <DashboardLoadingSkeleton />
      ) : (
        <LazyWrapper fallback={<DashboardLoadingSkeleton />}>
          {/* Row 1 — Account stat cards */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            <AccountStatsCards trades={filteredTrades} market={activeMarket} loading={false} />
          </div>

          <PerformanceInsightRow trades={filteredTrades} />

          <TradeActivitySection trades={filteredTrades} market={activeMarket} />
        </LazyWrapper>
      )}
    </>
  )
}

export default Finance
