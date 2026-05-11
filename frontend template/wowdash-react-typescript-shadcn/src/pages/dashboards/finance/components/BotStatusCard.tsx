import { fetchBots, updateBotStatus, type BotSummary } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BotStatusDonutChart from "./BotStatusDonutChart"
import { useCallback, useEffect, useState } from "react"
import { Bot, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const BOT_COLORS: Record<string, string> = {
  low_risk:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium_risk: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high_risk:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_COLORS: Record<string, string> = {
  active:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-neutral-100 text-neutral-600 dark:bg-slate-700 dark:text-slate-300",
  paused:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  stopped:  "bg-neutral-100 text-neutral-600 dark:bg-slate-700 dark:text-slate-300",
}

function botTypeLabel(t: string | undefined) {
  const s = String(t ?? "unknown")
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function BotStatusCard({
  bots: externalBots,
  market,
}: {
  bots?: BotSummary[]
  market?: "forex" | "crypto"
}) {
  const [bots, setBots] = useState<BotSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const refetchBots = useCallback(async () => {
    const res = await fetchBots()
    if (res.ok) setBots(res.data.bots ?? [])
    else setError(res.message)
  }, [])

  useEffect(() => {
    if (externalBots) {
      setBots(externalBots)
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchBots().then((res) => {
      if (cancelled) return
      if (res.ok) setBots(res.data.bots ?? [])
      else setError(res.message)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [externalBots])

  useEffect(() => {
    if (!externalBots) return
    setBots(externalBots)
  }, [externalBots])

  const notRunning = (s: string) =>
    s === "inactive" || s === "stopped"

  const activeBots = bots.filter((b) => b.status === "active").length
  const inactiveBots = bots.filter((b) => notRunning(b.status)).length
  const pausedBots = bots.filter((b) => b.status === "paused").length

  async function setStatus(botId: string, status: "active" | "paused") {
    setUpdatingId(botId)
    const res = await updateBotStatus(botId, status)
    setUpdatingId(null)
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    toast.success(status === "paused" ? "Bot paused." : "Bot resumed.")
    await refetchBots()
  }
  const totalBots = bots.length

  return (
    <Card className="card h-full rounded-lg border-0 !p-0">
      <CardContent className="p-0 h-full">
        <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-primary" />
            <h6 className="font-bold text-lg mb-0">
              {market === "crypto" ? "Crypto Bot Overview" : "Forex Bot Overview"}
            </h6>
          </div>
          <Link to="/prompt" className="text-sm text-primary underline-offset-4 hover:underline">
            + New
          </Link>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-40 w-full rounded" />
            {[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 p-4">{error}</p>
        ) : (
          <>
            {totalBots > 0 ? (
              <div className="px-4 pt-3 pb-1">
                <BotStatusDonutChart
                  active={activeBots}
                  paused={pausedBots}
                  inactive={inactiveBots}
                  size={180}
                />
                <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#45B369] inline-block" />
                    Active ({activeBots})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF9F29] inline-block" />
                    Paused ({pausedBots})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#487FFF] inline-block" />
                    Stopped / inactive ({inactiveBots})
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">No bots yet</p>
                <Link to="/prompt" className="text-sm text-primary underline-offset-4 hover:underline">
                  Create your first bot →
                </Link>
              </div>
            )}

            {bots.length > 0 && (
              <ul className="divide-y divide-neutral-100 dark:divide-slate-700 mt-1 max-h-72 overflow-y-auto">
                {bots.map((bot) => {
                  const busy = updatingId === bot.id
                  const canPause = bot.status === "active"
                  const canResume =
                    bot.status === "paused" ||
                    bot.status === "stopped" ||
                    bot.status === "inactive"
                  return (
                    <li key={bot.id} className="px-5 py-2.5 flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">{bot.symbol}</span>
                          <Badge
                            className={`text-xs px-1.5 py-0.5 border-0 ${BOT_COLORS[bot.bot_type] ?? "bg-neutral-100 text-neutral-600"}`}
                          >
                            {botTypeLabel(bot.bot_type)}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{bot.timeframe} · {bot.market}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {canPause && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            disabled={busy}
                            onClick={() => void setStatus(bot.id, "paused")}
                          >
                            {busy ? <Loader2 className="size-3.5 animate-spin" /> : "Pause"}
                          </Button>
                        )}
                        {canResume && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            disabled={busy}
                            onClick={() => void setStatus(bot.id, "active")}
                          >
                            {busy ? <Loader2 className="size-3.5 animate-spin" /> : "Resume"}
                          </Button>
                        )}
                        <Badge
                          className={`text-xs px-2 py-0.5 border-0 ${STATUS_COLORS[bot.status] ?? "bg-neutral-100 text-neutral-600"}`}
                        >
                          {bot.status}
                        </Badge>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
