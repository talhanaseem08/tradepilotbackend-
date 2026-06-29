import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { TradeRecord } from "@/lib/api"
import { dailyNetCumulativePnlSeries, dailyNetPnlSeries } from "@/lib/dashboardSeries"
import { Info } from "lucide-react"
import {
  AreaSeries,
  BaselineSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts"

type Props = {
  trades: TradeRecord[]
}

type MetricAxis = {
  label: string
  value: number
}

type TimePoint = {
  x: number
  y: number
}

type CumulativeChartType = "area" | "line" | "baseline"
type NetChartType = "histogram" | "line" | "baseline"

function closedTrades(trades: TradeRecord[]) {
  return trades.filter((trade) => trade.status === "closed" && trade.pnl != null)
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function dayKeyFromIso(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

function fmtScore(n: number) {
  return n.toFixed(2)
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value)
}

function formatShortNumericDateFromSeconds(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  })
}

function computePerformance(trades: TradeRecord[]) {
  const closed = closedTrades(trades)
  const wins = closed.filter((trade) => (trade.pnl ?? 0) > 0)
  const losses = closed.filter((trade) => (trade.pnl ?? 0) < 0)

  const grossProfit = wins.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
  const grossLossAbs = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0))
  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0
  const avgLoss = losses.length > 0 ? grossLossAbs / losses.length : 0
  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0
  const profitFactor =
    grossLossAbs > 0 ? grossProfit / grossLossAbs : grossProfit > 0 ? grossProfit : 0
  const avgWinLoss = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? avgWin : 0
  const netPnl = closed.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)

  let running = 0
  let peak = 0
  let maxDrawdownAbs = 0
  for (const trade of closed) {
    running += trade.pnl ?? 0
    peak = Math.max(peak, running)
    maxDrawdownAbs = Math.max(maxDrawdownAbs, peak - running)
  }

  const recoveryFactor =
    maxDrawdownAbs > 0 ? netPnl / maxDrawdownAbs : netPnl > 0 ? netPnl : 0

  const dailyMap = new Map<string, { pnl: number }>()
  for (const trade of closed) {
    const key = dayKeyFromIso(trade.closed_at ?? trade.timestamp)
    if (!key) continue
    const current = dailyMap.get(key) ?? { pnl: 0 }
    current.pnl += trade.pnl ?? 0
    dailyMap.set(key, current)
  }
  const activeDays = [...dailyMap.values()]
  const winningDays = activeDays.filter((day) => day.pnl > 0).length
  const dayWinRate = activeDays.length > 0 ? (winningDays / activeDays.length) * 100 : 0

  const activityFactor = clamp((activeDays.length / 12) * 100)
  const consistencyScore = clamp(dayWinRate * 0.7 + activityFactor * 0.3)
  const profitFactorScore = clamp((profitFactor / 3) * 100)
  const avgWinLossScore = clamp((avgWinLoss / 4) * 100)
  const recoveryFactorScore = clamp((recoveryFactor / 4) * 100)
  const maxDrawdownScore =
    grossProfit > 0 ? clamp(100 - (maxDrawdownAbs / grossProfit) * 100) : 0

  const pilotAxes = [
    { label: "Win %", value: clamp(winRate) },
    { label: "Profit factor", value: profitFactorScore },
    { label: "Avg win/loss", value: avgWinLossScore },
    { label: "Recovery factor", value: recoveryFactorScore },
    { label: "Max drawdown", value: maxDrawdownScore },
    { label: "Consistency", value: consistencyScore },
  ]

  const pilotScore =
    pilotAxes.reduce((sum, axis) => sum + axis.value, 0) / Math.max(pilotAxes.length, 1)

  return {
    pilotAxes,
    pilotScore,
    dailyCumulative: dailyNetCumulativePnlSeries(trades),
    dailyNet: dailyNetPnlSeries(trades),
  }
}

function SectionTitle({
  title,
  tooltip,
  action,
}: {
  title: string
  tooltip?: string
  action?: React.ReactNode
}) {
  return (
    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h6 className="font-bold text-lg mb-0">{title}</h6>
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="max-w-[260px] text-sm leading-5">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}

function useLightweightChart<T extends CumulativeChartType | NetChartType>({
  containerRef,
  points,
  type,
  lineColor,
  topFill,
  bottomFill,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  points: TimePoint[]
  type: T
  lineColor: string
  topFill?: string
  bottomFill?: string
}) {
  const chartApiRef = useRef<{ fitContent: () => void } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || points.length === 0) {
      chartApiRef.current = null
      return
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#98A2B3",
        fontFamily: "inherit",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(238,242,246,0.65)" },
        horzLines: { color: "rgba(238,242,246,1)" },
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.06 },
      },
      timeScale: {
        borderVisible: false,
        tickMarkFormatter: (time: number) => formatShortNumericDateFromSeconds(time),
        ticksVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        allowBoldLabels: false,
        minimumHeight: 26,
      },
      localization: {
        priceFormatter: (price: number) => formatCompactCurrency(price),
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(147, 163, 184, 0.32)",
          labelBackgroundColor: "#111827",
        },
        horzLine: {
          color: "rgba(147, 163, 184, 0.18)",
          labelBackgroundColor: "#111827",
        },
      },
      handleScroll: true,
      handleScale: true,
    })

    let series: ISeriesApi<"Area" | "Baseline" | "Histogram" | "Line">
    if (type === "area") {
      series = chart.addSeries(AreaSeries, {
        priceScaleId: "left",
        lineColor,
        topColor: topFill ?? "rgba(115, 211, 154, 0.34)",
        bottomColor: bottomFill ?? "rgba(115, 211, 154, 0.05)",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
    } else if (type === "line") {
      series = chart.addSeries(LineSeries, {
        priceScaleId: "left",
        color: lineColor,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
    } else if (type === "baseline") {
      series = chart.addSeries(BaselineSeries, {
        priceScaleId: "left",
        baseValue: { type: "price", price: 0 },
        topLineColor: lineColor,
        topFillColor1: topFill ?? "rgba(115, 211, 154, 0.36)",
        topFillColor2: bottomFill ?? "rgba(115, 211, 154, 0.05)",
        bottomLineColor: "#E6818D",
        bottomFillColor1: "rgba(230, 129, 141, 0.18)",
        bottomFillColor2: "rgba(230, 129, 141, 0.03)",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
    } else {
      series = chart.addSeries(HistogramSeries, {
        priceScaleId: "left",
        base: 0,
        priceLineVisible: false,
        lastValueVisible: false,
      })
    }

    if (type === "area") {
      ;(series as ISeriesApi<"Area">).setData(
        points.map((point) => ({
          time: Math.floor(point.x / 1000) as UTCTimestamp,
          value: Number(point.y.toFixed(2)),
        }))
      )
    } else if (type === "line") {
      ;(series as ISeriesApi<"Line">).setData(
        points.map((point) => ({
          time: Math.floor(point.x / 1000) as UTCTimestamp,
          value: Number(point.y.toFixed(2)),
        }))
      )
    } else if (type === "baseline") {
      ;(series as ISeriesApi<"Baseline">).setData(
        points.map((point) => ({
          time: Math.floor(point.x / 1000) as UTCTimestamp,
          value: Number(point.y.toFixed(2)),
        }))
      )
    } else {
      ;(series as ISeriesApi<"Histogram">).setData(
        points.map((point) => ({
          time: Math.floor(point.x / 1000) as UTCTimestamp,
          value: Number(point.y.toFixed(2)),
          color: point.y >= 0 ? "#82D9B1" : "#E6818D",
        }))
      )
    }

    chart.timeScale().fitContent()
    chartApiRef.current = {
      fitContent: () => chart.timeScale().fitContent(),
    }

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight })
      chart.timeScale().fitContent()
    })

    resizeObserver.observe(container)

    return () => {
      chartApiRef.current = null
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [bottomFill, containerRef, lineColor, points, topFill, type])

  return {
    fitContent: () => chartApiRef.current?.fitContent(),
  }
}

function PilotScoreCard({
  axes,
  score,
}: {
  axes: MetricAxis[]
  score: number
}) {
  const chartData = useMemo(
    () =>
      axes.map((axis) => ({
        metric: axis.label,
        label: `${axis.label} (${axis.value.toFixed(1)})`,
        value: Number(axis.value.toFixed(2)),
      })),
    [axes]
  )

  const scoreBarWidth = `${clamp(score)}%`

  return (
    <Card className="rounded-lg border-0 !p-0 h-full">
      <CardContent className="p-0 h-full">
        <SectionTitle
          title="Pilot score"
          tooltip="Pilot Score evaluates your performance by combining the most essential metrics into one digestible score."
        />
        <div className="px-4 pt-3 pb-5">
          <div className="h-[250px] px-3">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={chartData}
                cx="50%"
                cy="51%"
                outerRadius="58%"
                margin={{ top: 10, right: 46, bottom: 10, left: 46 }}
              >
                <PolarGrid stroke="#E8EEF6" />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{
                    fill: "#7F8DA3",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                />
                <Radar
                  name="Pilot score"
                  dataKey="value"
                  stroke="#7C5CFC"
                  fill="#7C5CFC"
                  fillOpacity={0.24}
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "#7C5CFC",
                    strokeWidth: 0,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 border-t border-neutral-200 pt-5 dark:border-slate-600">
            <div className="grid grid-cols-[116px_1fr] items-start gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Pilot Score
                </p>
                <p className="text-[34px] font-bold leading-none">{fmtScore(score)}</p>
              </div>
              <div className="pt-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: scoreBarWidth,
                      background:
                        "linear-gradient(90deg, #EF6A6A 0%, #F6C85F 38%, #9BD770 68%, #45B369 100%)",
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-between text-[11px] font-medium text-slate-400">
                  {[0, 20, 40, 60, 80, 100].map((mark) => (
                    <span key={mark} className={mark <= score ? "text-slate-500" : undefined}>
                      {mark}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DailyCumulativePnlCard({ points }: { points: TimePoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [chartType, setChartType] = useState<CumulativeChartType>("area")
  const { fitContent } = useLightweightChart({
    containerRef,
    points,
    type: chartType,
    lineColor: "#0d114a",
    topFill: "rgba(2, 255, 103, 0.42)",
    bottomFill: "rgba(161, 240, 192, 0.05)",
  })

  const hasData = points.length > 0

  return (
    <Card className="rounded-lg border-0 !p-0 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <SectionTitle
          title="Daily net cumulative P&L"
          tooltip="A running view of realized performance, compounded from your daily closed-trade results."
          action={
            <>
              <Tabs
                value={chartType}
                onValueChange={(value) => setChartType(value as CumulativeChartType)}
                className="gap-0"
              >
                <TabsList className="h-8 bg-muted/70">
                  <TabsTrigger value="area" className="px-2 text-xs">
                    Area
                  </TabsTrigger>
                  <TabsTrigger value="line" className="px-2 text-xs">
                    Line
                  </TabsTrigger>
                  <TabsTrigger value="baseline" className="px-2 text-xs">
                    Base
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={fitContent}>
                Fit
              </Button>
            </>
          }
        />
        <div className="px-3 pt-3 pb-2 flex-1">
          {hasData ? (
            <div ref={containerRef} className="h-full min-h-[310px] w-full" />
          ) : (
            <div className="flex h-full min-h-[310px] items-center justify-center px-4 text-sm text-muted-foreground">
              No closed trades yet. Daily cumulative P&amp;L will appear after real closes are recorded.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function NetDailyPnlCard({ points }: { points: TimePoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [chartType, setChartType] = useState<NetChartType>("histogram")
  const { fitContent } = useLightweightChart({
    containerRef,
    points,
    type: chartType,
    lineColor: "#82D9B1",
  })

  const hasData = points.length > 0

  return (
    <Card className="rounded-lg border-0 !p-0 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <SectionTitle
          title="Net Daily P&L"
          tooltip="Daily realized profit and loss from your closed trades, separated into positive and negative days."
          action={
            <>
              <Tabs
                value={chartType}
                onValueChange={(value) => setChartType(value as NetChartType)}
                className="gap-0"
              >
                <TabsList className="h-8 bg-muted/70">
                  <TabsTrigger value="histogram" className="px-2 text-xs">
                    Bars
                  </TabsTrigger>
                  <TabsTrigger value="line" className="px-2 text-xs">
                    Line
                  </TabsTrigger>
                  <TabsTrigger value="baseline" className="px-2 text-xs">
                    Base
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={fitContent}>
                Fit
              </Button>
            </>
          }
        />
        <div className="px-3 pt-3 pb-2 flex-1">
          {hasData ? (
            <div ref={containerRef} className="h-full min-h-[310px] w-full" />
          ) : (
            <div className="flex h-full min-h-[310px] items-center justify-center px-4 text-sm text-muted-foreground">
              No closed trades yet. Net daily P&amp;L will appear after real closes are recorded.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PerformanceInsightRow({ trades }: Props) {
  const performance = computePerformance(trades)
  const cumulativePoints = useMemo(
    () => performance.dailyCumulative.datetimePoints,
    [performance.dailyCumulative.datetimePoints]
  )
  const netPoints = useMemo(
    () => performance.dailyNet.datetimePoints,
    [performance.dailyNet.datetimePoints]
  )

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-4">
          <PilotScoreCard axes={performance.pilotAxes} score={performance.pilotScore} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <DailyCumulativePnlCard points={cumulativePoints} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <NetDailyPnlCard points={netPoints} />
        </div>
      </div>

    </div>
  )
}
