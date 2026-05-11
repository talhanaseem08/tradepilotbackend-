import type { TradeRecord } from "@/lib/api"

function closeTimeMs(t: TradeRecord): number {
  const s = t.closed_at ?? t.timestamp
  if (!s) return 0
  const ms = new Date(s).getTime()
  return Number.isNaN(ms) ? 0 : ms
}

/** Closed trades with P&amp;L, oldest first. */
export function closedTradesSortedAsc(trades: TradeRecord[]): TradeRecord[] {
  return trades
    .filter((t) => t.status === "closed" && t.pnl != null)
    .sort((a, b) => closeTimeMs(a) - closeTimeMs(b))
}

function fmtShort(iso: string | undefined): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  } catch {
    return ""
  }
}

/** Cumulative realized P&L after each closed trade. */
export function cumulativePnlSeries(trades: TradeRecord[]): {
  series: number[]
  labels: string[]
  /** For Apex datetime x-axis — one point per close, unique timestamps. */
  datetimePoints: { x: number; y: number }[]
} {
  const closed = closedTradesSortedAsc(trades)
  let cum = 0
  const series: number[] = []
  const labels: string[] = []
  const datetimePoints: { x: number; y: number }[] = []
  const base = Date.now()
  for (let i = 0; i < closed.length; i++) {
    const t = closed[i]
    cum += t.pnl ?? 0
    series.push(cum)
    labels.push(fmtShort(t.closed_at ?? t.timestamp))
    const iso = t.closed_at ?? t.timestamp
    let ms = iso ? new Date(iso).getTime() : NaN
    if (!Number.isFinite(ms) || ms <= 0) {
      ms = base + i * 60_000
    }
    datetimePoints.push({ x: ms, y: cum })
  }
  return { series, labels, datetimePoints }
}

/**
 * Implied account balance after each closed trade (forward from inferred start),
 * ending at `balanceNow` after the last trade.
 */
export function balancePathSeries(trades: TradeRecord[], balanceNow: number): number[] {
  const closed = closedTradesSortedAsc(trades)
  if (closed.length === 0) return [balanceNow]
  const totalPnl = closed.reduce((s, t) => s + (t.pnl ?? 0), 0)
  let run = balanceNow - totalPnl
  const series: number[] = []
  for (const t of closed) {
    run += t.pnl ?? 0
    series.push(run)
  }
  return series
}

/** Repeat a value for sparklines when no time series exists (flat = real snapshot). */
export function flatSeries(value: number, points = 12): number[] {
  return Array.from({ length: Math.max(2, points) }, () => value)
}

/** Ensure Apex gets at least two points. */
export function padSeriesMin2(values: number[]): number[] {
  if (values.length === 0) return [0, 0]
  if (values.length === 1) return [values[0], values[0]]
  return values
}

export type MonthlyBucket = {
  key: string
  label: string
  grossProfit: number
  grossLoss: number
}

/** Last `months` calendar months (oldest first) with gross profit vs gross loss from closed trades. */
export function monthlyProfitLossBreakdown(
  trades: TradeRecord[],
  months = 12
): { categories: string[]; grossProfit: number[]; grossLoss: number[] } {
  const closed = closedTradesSortedAsc(trades)
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)

  const keys: string[] = []
  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    keys.push(key)
  }

  const profit = new Map<string, number>()
  const loss = new Map<string, number>()
  for (const k of keys) {
    profit.set(k, 0)
    loss.set(k, 0)
  }

  for (const t of closed) {
    const iso = t.closed_at ?? t.timestamp
    if (!iso) continue
    const d = new Date(iso)
    if (Number.isNaN(d.getTime()) || d < start) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!profit.has(key)) continue
    const p = t.pnl ?? 0
    if (p > 0) profit.set(key, (profit.get(key) ?? 0) + p)
    else if (p < 0) loss.set(key, (loss.get(key) ?? 0) + Math.abs(p))
  }

  const categories = keys.map((k) => {
    const [y, m] = k.split("-").map(Number)
    const d = new Date(y, m - 1, 1)
    return d.toLocaleString(undefined, { month: "short", year: "numeric" })
  })

  return {
    categories,
    grossProfit: keys.map((k) => profit.get(k) ?? 0),
    grossLoss: keys.map((k) => loss.get(k) ?? 0),
  }
}

function enumerateDayStarts(startMs: number, endMs: number): number[] {
  const days: number[] = []
  let cursor = startMs
  while (cursor <= endMs) {
    days.push(cursor)
    cursor += 86_400_000
  }
  return days
}

/** Daily net cumulative P&L grouped by close date, oldest first. */
export function dailyNetCumulativePnlSeries(trades: TradeRecord[]): {
  series: number[]
  labels: string[]
  datetimePoints: { x: number; y: number }[]
} {
  const closed = closedTradesSortedAsc(trades)
  const grouped = new Map<string, { x: number; pnl: number }>()

  for (const trade of closed) {
    const iso = trade.closed_at ?? trade.timestamp
    if (!iso) continue
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) continue

    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const key = String(dayStart)
    const current = grouped.get(key) ?? { x: dayStart, pnl: 0 }
    current.pnl += trade.pnl ?? 0
    grouped.set(key, current)
  }

  const groupedDays = [...grouped.values()].sort((a, b) => a.x - b.x)
  const series: number[] = []
  const labels: string[] = []
  const datetimePoints: { x: number; y: number }[] = []
  let cumulative = 0

  if (groupedDays.length === 0) {
    return { series, labels, datetimePoints }
  }

  const byDay = new Map(groupedDays.map((day) => [day.x, day.pnl]))
  const fullDays = enumerateDayStarts(groupedDays[0].x, groupedDays[groupedDays.length - 1].x)

  for (const dayStart of fullDays) {
    cumulative += byDay.get(dayStart) ?? 0
    series.push(cumulative)
    labels.push(
      new Date(dayStart).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    )
    datetimePoints.push({ x: dayStart, y: cumulative })
  }

  return { series, labels, datetimePoints }
}

/** Daily net realized P&L grouped by close date, oldest first. */
export function dailyNetPnlSeries(trades: TradeRecord[]): {
  positives: number[]
  negatives: number[]
  categories: string[]
  datetimePoints: { x: number; y: number }[]
} {
  const closed = closedTradesSortedAsc(trades)
  const grouped = new Map<string, { x: number; pnl: number }>()

  for (const trade of closed) {
    const iso = trade.closed_at ?? trade.timestamp
    if (!iso) continue
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) continue

    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const key = String(dayStart)
    const current = grouped.get(key) ?? { x: dayStart, pnl: 0 }
    current.pnl += trade.pnl ?? 0
    grouped.set(key, current)
  }

  const groupedDays = [...grouped.values()].sort((a, b) => a.x - b.x)

  if (groupedDays.length === 0) {
    return {
      positives: [],
      negatives: [],
      categories: [],
      datetimePoints: [],
    }
  }

  const byDay = new Map(groupedDays.map((day) => [day.x, day.pnl]))
  const fullDays = enumerateDayStarts(groupedDays[0].x, groupedDays[groupedDays.length - 1].x)

  return {
    positives: fullDays.map((dayStart) => {
      const pnl = byDay.get(dayStart) ?? 0
      return pnl > 0 ? pnl : 0
    }),
    negatives: fullDays.map((dayStart) => {
      const pnl = byDay.get(dayStart) ?? 0
      return pnl < 0 ? pnl : 0
    }),
    categories: fullDays.map((dayStart) =>
      new Date(dayStart).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    ),
    datetimePoints: fullDays.map((dayStart) => ({
      x: dayStart,
      y: byDay.get(dayStart) ?? 0,
    })),
  }
}

export function tradeOutcomeCounts(trades: TradeRecord[]): {
  wins: number
  losses: number
  breakeven: number
} {
  const closed = trades.filter((t) => t.status === "closed" && t.pnl != null)
  let wins = 0
  let losses = 0
  let breakeven = 0
  for (const t of closed) {
    const p = t.pnl ?? 0
    if (p > 0) wins += 1
    else if (p < 0) losses += 1
    else breakeven += 1
  }
  return { wins, losses, breakeven }
}

/** Short label for chart Y-axis (full id in tooltip via index map if needed). */
function shortBotLabel(id: string): string {
  const t = id.trim()
  if (t.length <= 14) return `Bot ${t}`
  return `Bot ${t.slice(0, 10)}…`
}

/** Win rate % per bot (top `maxBots`), for horizontal bar chart. */
export function winRateByBot(
  trades: TradeRecord[],
  maxBots = 5
): { labels: string[]; series: number[] } {
  const closed = trades.filter((t) => t.status === "closed" && t.pnl != null && t.botID)
  const byBot = new Map<string, { wins: number; total: number }>()
  for (const t of closed) {
    const id = t.botID as string
    const cur = byBot.get(id) ?? { wins: 0, total: 0 }
    cur.total += 1
    if ((t.pnl ?? 0) > 0) cur.wins += 1
    byBot.set(id, cur)
  }
  const rows = [...byBot.entries()]
    .map(([id, v]) => ({
      id,
      rate: v.total > 0 ? Math.round((v.wins / v.total) * 100) : 0,
      total: v.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, maxBots)

  return {
    labels: rows.map((r) => shortBotLabel(r.id)),
    series: rows.map((r) => r.rate),
  }
}
