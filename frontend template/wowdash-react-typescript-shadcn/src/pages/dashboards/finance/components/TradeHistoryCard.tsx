import { fetchTrades, type TradeRecord } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AreaChartBigChart from "@/components/charts/AreaChartBigChart"
import { cumulativePnlSeries } from "@/lib/dashboardSeries"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

function fmt(n: number | undefined) {
  if (n == null) return "—"
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function directionBadge(direction: string | undefined) {
  if (!direction) return null
  const d = direction.trim().toLowerCase()
  const isBuy = d === "buy" || d === "long"
  return (
    <Badge
      className={`text-xs font-semibold px-2 py-0.5 border-0 ${
        isBuy
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {isBuy ? "BUY" : "SELL"}
    </Badge>
  )
}

export default function TradeHistoryCard({
  trades: externalTrades,
  market,
}: {
  trades?: TradeRecord[]
  market?: "forex" | "crypto"
}) {
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (externalTrades) {
      setTrades(externalTrades)
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    fetchTrades({ limit: 100, page: 1 }).then((res) => {
      if (cancelled) return
      if (res.ok) setTrades(res.data.trades)
      else setError(res.message)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [externalTrades])

  useEffect(() => {
    if (!externalTrades) return
    setTrades(externalTrades)
  }, [externalTrades])

  const cum = useMemo(() => cumulativePnlSeries(trades), [trades])
  const tableRows = useMemo(() => {
    const sorted = [...trades].sort((a, b) => {
      const ta = new Date(a.closed_at ?? a.timestamp ?? a.opened_at ?? 0).getTime()
      const tb = new Date(b.closed_at ?? b.timestamp ?? b.opened_at ?? 0).getTime()
      return tb - ta
    })
    return sorted.slice(0, 8)
  }, [trades])

  return (
    <Card className="card h-full rounded-lg border-0 !p-0">
      <CardContent className="p-0 h-full">
        <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6 flex items-center justify-between gap-2">
          <h6 className="font-bold text-lg mb-0">
            {market === "crypto" ? "Crypto Trade History" : "Trade History"}
          </h6>
          <Link to="/trade-journal" className="text-sm text-primary underline-offset-4 hover:underline">
            View all
          </Link>
        </div>

        {/* P&L Curve */}
        <div className="px-2 pt-2 pb-0">
          <AreaChartBigChart
            chartHeight={160}
            chartColor="#45B369"
            seriesName="Cumulative P&L"
            data={cum.series}
            categories={cum.labels}
            datetimePoints={cum.datetimePoints}
            emptyMessage="No closed trades yet."
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-full rounded" />)}
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 p-4">{error}</p>
        ) : trades.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6 text-center">No trade history yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-slate-600">
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Symbol</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Side</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Entry</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Exit</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">P&L</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((t, rowIdx) => {
                  const pl = t.pnl ?? 0
                  return (
                    <tr
                      key={t._id ? `${t._id}-${rowIdx}` : `trade-${rowIdx}-${t.symbol}-${t.timestamp ?? ""}`}
                      className="border-b border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-semibold">{t.symbol ?? "—"}</td>
                      <td className="px-4 py-2.5">{directionBadge(t.direction)}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-xs">
                        {t.entry_price != null ? t.entry_price.toFixed(5) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-xs">
                        {t.exit_price != null ? t.exit_price.toFixed(5) : "—"}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-mono tabular-nums font-semibold ${
                          t.pnl == null ? "text-muted-foreground"
                          : pl >= 0 ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {fmt(t.pnl)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {fmtDate(t.closed_at ?? t.timestamp)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
