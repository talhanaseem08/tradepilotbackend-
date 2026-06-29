import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchAccountSummary, type AccountSummary, type TradeRecord } from "@/lib/api"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

function closedTrades(trades: TradeRecord[]) {
  return trades.filter((t) => t.status === "closed" && t.pnl != null)
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function toDayKey(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

function fmtMoney(n: number) {
  const abs = Math.abs(n)
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: abs >= 1000 ? 0 : 2,
    maximumFractionDigits: abs >= 1000 ? 0 : 2,
  }).format(n)
}

function fmtBrokerMoney(n: number | undefined, currency = "USD") {
  const value = Number.isFinite(n) ? Number(n) : 0
  const abs = Math.abs(value)
  if (currency.toUpperCase() === "USDT") {
    return `${value < 0 ? "-" : ""}${abs >= 1000 ? abs.toFixed(0) : abs.toFixed(2)} USDT`
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: abs >= 1000 ? 0 : 2,
    maximumFractionDigits: abs >= 1000 ? 0 : 2,
  }).format(value)
}

function fmtRatio(n: number) {
  if (!Number.isFinite(n)) return "0.00"
  return n.toFixed(2)
}

function fmtPercent(n: number) {
  if (!Number.isFinite(n)) return "0.00%"
  return `${n.toFixed(2)}%`
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

  const dayTotals = new Map<string, number>()
  for (const trade of closed) {
    const key = toDayKey(trade.closed_at ?? trade.timestamp)
    if (!key) continue
    dayTotals.set(key, (dayTotals.get(key) ?? 0) + (trade.pnl ?? 0))
  }

  let winningDays = 0
  let losingDays = 0
  let breakevenDays = 0

  for (const total of dayTotals.values()) {
    if (total > 0) winningDays += 1
    else if (total < 0) losingDays += 1
    else breakevenDays += 1
  }

  const tradingDays = winningDays + losingDays + breakevenDays
  const dayWinRate = tradingDays > 0 ? (winningDays / tradingDays) * 100 : 0

  return {
    closedCount: closed.length,
    netPnl,
    wins: wins.length,
    losses: losses.length,
    breakeven: breakeven.length,
    tradeWinRate,
    grossProfit,
    grossLossAbs,
    profitFactor,
    winningDays,
    losingDays,
    breakevenDays,
    dayWinRate,
    avgWin,
    avgLossAbs,
    avgWinLossRatio,
  }
}

function KpiCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-[142px] flex-col rounded-lg border-0 bg-card p-4 shadow-sm">
      {children}
    </div>
  )
}

function KpiTitle({
  title,
  badge,
  tooltip,
}: {
  title: string
  badge?: string
  tooltip: string
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-300">
      <span>{title}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex rounded-full text-slate-400 transition hover:text-[#FB8B4B] focus:outline-none focus:ring-2 focus:ring-[#FB8B4B]/30"
            aria-label={`${title} information`}
          >
            <Info className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className="max-w-[240px] text-xs leading-5">
          {tooltip}
        </TooltipContent>
      </Tooltip>
      {badge ? (
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-200">
          {badge}
        </span>
      ) : null}
    </div>
  )
}

function MiniDonut({
  segments,
  size = 68,
  strokeWidth = 6,
}: {
  segments: { value: number; color: string }[]
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0)

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
          className="text-slate-200 dark:text-slate-600"
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
        className="text-slate-100 dark:text-slate-700"
      />
      {segments.map((segment, index) => {
        const value = Math.max(segment.value, 0)
        const length = (value / total) * circumference
        const circle = (
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
        return circle
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
    <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold">
      {items.map((item, index) => (
        <div key={`${item.color}-${index}`} className="flex items-center gap-1.5 text-slate-400 dark:text-slate-300">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AccountStatsCards({
  trades,
  market,
  loading = false,
}: {
  trades: TradeRecord[]
  market: "forex" | "crypto"
  loading?: boolean
}) {
  const [account, setAccount] = useState<AccountSummary | null>(null)
  const [accountLoading, setAccountLoading] = useState(true)
  const [accountError, setAccountError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setAccountLoading(true)
    setAccountError(false)
    fetchAccountSummary(market)
      .then((res) => {
        if (cancelled) return
        if (res.ok) {
          setAccount(res.data)
        } else {
          setAccount(null)
          setAccountError(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAccount(null)
          setAccountError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setAccountLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [market])

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="col-span-1">
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ))}
      </>
    )
  }

  const metrics = computeMetrics(trades)
  const netPnlPositive = metrics.netPnl >= 0
  const brokerCurrency = account?.currency || (market === "crypto" ? "USDT" : "USD")
  const brokerPrimaryValue =
    market === "crypto" ? account?.margin_available : account?.balance
  const brokerSecondaryValue =
    market === "crypto" ? account?.balance : account?.nav
  const brokerUsedValue = account?.margin_used

  return (
    <>
      <div className="col-span-1">
        <KpiCard>
          <KpiTitle
            title="Net P&L"
            badge={String(metrics.closedCount)}
            tooltip="Your total profit or loss from trades that have already closed."
          />
          <div className="flex flex-1 items-start justify-between gap-3">
            <div>
              <div
                className={`text-[34px] font-bold leading-none tracking-tight ${
                  netPnlPositive ? "text-[#59C593]" : "text-[#E0526B]"
                }`}
              >
                {fmtMoney(metrics.netPnl)}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-300">
                Across all closed trades
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full border border-[#FFA66E]/45 bg-[#FFF3EA] text-[#FB8B4B] dark:border-[#FB8B4B]/45 dark:bg-[#2A1C16] dark:text-[#FFA66E]">
              <span className="text-sm font-bold">{netPnlPositive ? "↗" : "↘"}</span>
            </div>
          </div>
        </KpiCard>
      </div>

      <div className="col-span-1">
        <KpiCard>
          <KpiTitle
            title="Trade win %"
            tooltip="The percentage of closed trades that ended in profit."
          />
          <div className="flex flex-1 items-start justify-between gap-3">
            <div className="pt-1 text-[34px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
              {fmtPercent(metrics.tradeWinRate)}
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
      </div>

      <div className="col-span-1">
        <KpiCard>
          <KpiTitle
            title="Profit factor"
            tooltip="Shows how much profit your winning trades made compared with losing trades."
          />
          <div className="flex flex-1 items-start justify-between gap-3">
            <div>
              <div className="text-[34px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                {fmtRatio(metrics.profitFactor)}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-300">
                Gross profit vs gross loss
              </p>
            </div>
            <MiniDonut
              segments={[
                { value: metrics.grossProfit, color: "#58C58B" },
                { value: metrics.grossLossAbs, color: "#E0526B" },
              ]}
            />
          </div>
        </KpiCard>
      </div>

      <div className="col-span-1">
        <KpiCard>
          <KpiTitle
            title="Day win %"
            tooltip="The percentage of trading days that finished with a profit."
          />
          <div className="flex flex-1 items-start justify-between gap-3">
            <div className="pt-1 text-[34px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
              {fmtPercent(metrics.dayWinRate)}
            </div>
            <MiniDonut
              segments={[
                { value: metrics.winningDays, color: "#58C58B" },
                { value: metrics.breakevenDays, color: "#4F78FF" },
                { value: metrics.losingDays, color: "#E0526B" },
              ]}
            />
          </div>
          <CountLegend
            items={[
              { color: "#58C58B", value: metrics.winningDays },
              { color: "#4F78FF", value: metrics.breakevenDays },
              { color: "#E0526B", value: metrics.losingDays },
            ]}
          />
        </KpiCard>
      </div>

      <div className="col-span-1">
        <KpiCard>
          <KpiTitle
            title="Account balance"
            tooltip="Your connected broker balance or available trading balance."
          />
          {accountLoading ? (
            <div className="flex flex-1 flex-col justify-between">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ) : accountError ? (
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[26px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                    Not connected
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-300">
                    Connect your {market === "crypto" ? "Binance" : "OANDA"} account
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <div className="text-[34px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                    {fmtBrokerMoney(brokerPrimaryValue, brokerCurrency)}
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-300">
                    {market === "crypto" ? "Available to trade" : "Real broker balance"}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between text-xs font-semibold">
                <span className="text-[#45B369]">
                  {market === "crypto" ? "Total" : "Equity"} {fmtBrokerMoney(brokerSecondaryValue, brokerCurrency)}
                </span>
                <span className="text-slate-400 dark:text-slate-300">
                  Used {fmtBrokerMoney(brokerUsedValue, brokerCurrency)}
                </span>
              </div>
            </>
          )}
        </KpiCard>
      </div>
    </>
  )
}
