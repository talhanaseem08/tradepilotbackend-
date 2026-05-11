import { fetchOpenPositions, type OpenPosition } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatInstrument(raw: string) {
  return raw.replace("_", "/")
}

export default function OpenPositionsCard({
  market = "forex",
}: {
  market?: "forex" | "crypto"
}) {
  const [positions, setPositions] = useState<OpenPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    const res = await fetchOpenPositions(market)
    if (res.ok) {
      setPositions(res.data)
    } else {
      setError(res.message)
    }
    setLoading(false)
  }

  useEffect(() => { void load() }, [market])

  return (
    <Card className="card h-full rounded-lg border-0 !p-0">
      <CardContent className="p-0 h-full">
        <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6 flex items-center justify-between gap-2">
          <h6 className="font-bold text-lg mb-0">
            {market === "crypto" ? "Spot Positions" : "Open Positions"}
          </h6>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 p-4">{error}</p>
        ) : positions.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6 text-center">
            {market === "crypto"
              ? "No open spot positions to show. Switch to Forex to see OANDA trades."
              : "No open positions"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-slate-600">
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Pair</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Side</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Units</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Entry</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Unrealized P&L</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-500 dark:text-slate-400">Opened</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => {
                  const isBuy = p.current_units > 0
                  const pl = p.unrealized_pl
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold">{formatInstrument(p.instrument)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs font-semibold px-2 py-0.5 ${
                            isBuy
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          } border-0`}
                        >
                          {isBuy ? "BUY" : "SELL"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {Math.abs(p.current_units).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {p.price.toFixed(5)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono tabular-nums font-semibold ${
                          pl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {fmt(pl)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(p.open_time)}</td>
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
