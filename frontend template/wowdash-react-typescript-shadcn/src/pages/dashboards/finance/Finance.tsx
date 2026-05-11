import LazyWrapper from "@/components/LazyWrapper"
import Breadcrumb from "@/layouts/Breadcrumb"
import { Button } from "@/components/ui/button"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
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

const Finance = () => {
  const { activeMarket } = useDashboardMarket()
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [bots, setBots] = useState<BotSummary[]>([])
  const [execLoading, setExecLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchTrades({ limit: 500, page: 1 }), fetchBots()]).then(
      ([tradesRes, botsRes]) => {
        if (cancelled) return
        if (tradesRes.ok) setTrades(tradesRes.data.trades)
        if (botsRes.ok) setBots(botsRes.data.bots)
        setLoading(false)
      }
    )
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
        `${res.data.symbol} test BUY opened on ${res.data.broker.toUpperCase()} ${res.data.environment}. It will auto-close in ${Math.round(
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
      <Breadcrumb title="Dashboard" text="Trading Dashboard" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 dark:border-slate-600 bg-card/50 px-4 py-3">
        <p className="text-sm text-muted-foreground max-w-2xl">
          {activeMarket === "forex" ? (
            <>
              Open one real <strong>OANDA practice</strong> test trade for your active forex bot and auto-close it after 3 minutes.
              This is only for checking that real broker execution works.
            </>
          ) : (
            <>
              Open one real <strong>Binance demo</strong> test trade for your active crypto bot and auto-close it after 3 minutes.
              This is only for checking that real broker execution works.
            </>
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={execLoading}
          onClick={() => void runExecutionCycle()}
        >
          {execLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4" />
          )}
          Run execution now
        </Button>
      </div>

      {/* Row 1 — Account stat cards */}
      <LazyWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          <AccountStatsCards trades={filteredTrades} loading={loading} />
        </div>
      </LazyWrapper>

      <LazyWrapper>
        <PerformanceInsightRow trades={filteredTrades} />
      </LazyWrapper>

      <LazyWrapper>
        <TradeActivitySection trades={filteredTrades} market={activeMarket} />
      </LazyWrapper>
    </>
  )
}

export default Finance
