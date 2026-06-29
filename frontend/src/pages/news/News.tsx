import Breadcrumb from "@/layouts/Breadcrumb"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchCryptoNews,
  fetchForexCalendar,
  type NlpNewsItem,
} from "@/lib/api"
import {
  CalendarDays,
  Clock3,
  Coins,
  ExternalLink,
  Globe2,
  Newspaper,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

function impactVariant(
  impact: string | null | undefined
): "default" | "secondary" | "destructive" | "outline" {
  if (!impact) return "outline"
  const i = impact.toLowerCase()
  if (i === "high" || i === "red") return "destructive"
  if (i === "medium" || i === "orange") return "default"
  if (i === "low" || i === "yellow") return "secondary"
  if (i === "gray" || i === "grey") return "outline"
  return "secondary"
}

function fmtWhen(iso: string | undefined | null) {
  if (!iso) return "—"
  try {
    let parsed: Date
    const ddmmyyyy = iso.match(
      /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}))?$/
    )
    if (ddmmyyyy) {
      const [, dd, mm, yyyy, hh = "00", min = "00"] = ddmmyyyy
      parsed = new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        Number(hh),
        Number(min)
      )
    } else {
      parsed = new Date(iso)
    }

    if (Number.isNaN(parsed.getTime())) {
      return iso
    }

    return parsed.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function SurfaceCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rounded-2xl bg-card shadow-none ${className}`}>{children}</div>
}

function MetricTile({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-2xl bg-card px-4 py-4 shadow-none">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-slate-500">
        <Icon className="size-4 opacity-70" />
        <span>{label}</span>
      </div>
      <div className="text-[30px] font-bold leading-none tracking-tight text-slate-900">{value}</div>
      <p className="mt-3 text-sm text-slate-500">{subtext}</p>
    </div>
  )
}

export default function News() {
  const { activeMarket } = useDashboardMarket()
  const [forex, setForex] = useState<NlpNewsItem[] | null>(null)
  const [forexSource, setForexSource] = useState<string>("")
  const [forexErr, setForexErr] = useState<string | null>(null)
  const [forexLoading, setForexLoading] = useState(true)

  const [crypto, setCrypto] = useState<NlpNewsItem[] | null>(null)
  const [cryptoSource, setCryptoSource] = useState<string>("")
  const [cryptoErr, setCryptoErr] = useState<string | null>(null)
  const [cryptoLoading, setCryptoLoading] = useState(true)

  const loadForex = useCallback(async () => {
    setForexLoading(true)
    setForexErr(null)
    const res = await fetchForexCalendar()
    if (!res.ok) {
      setForex(null)
      setForexErr(res.message)
    } else {
      setForex(res.data.items ?? [])
      setForexSource(res.data.source ?? "")
    }
    setForexLoading(false)
  }, [])

  const loadCrypto = useCallback(async () => {
    setCryptoLoading(true)
    setCryptoErr(null)
    const res = await fetchCryptoNews()
    if (!res.ok) {
      setCrypto(null)
      setCryptoErr(res.message)
    } else {
      setCrypto(res.data.articles ?? [])
      setCryptoSource(res.data.source ?? "")
    }
    setCryptoLoading(false)
  }, [])

  useEffect(() => {
    void loadForex()
    void loadCrypto()
  }, [loadForex, loadCrypto])

  const isCrypto = activeMarket === "crypto"
  const activeItems = isCrypto ? crypto ?? [] : forex ?? []
  const activeLoading = isCrypto ? cryptoLoading : forexLoading
  const activeError = isCrypto ? cryptoErr : forexErr
  const activeSource = isCrypto ? cryptoSource : forexSource

  const highImpactCount = forex?.filter((item) => {
    const impact = item.impact?.toLowerCase()
    return impact === "high" || impact === "red"
  }).length ?? 0

  const uniqueForexSymbols = new Set((forex ?? []).map((item) => item.symbol).filter(Boolean)).size
  const uniqueCryptoSources = new Set((crypto ?? []).map((item) => item.source).filter(Boolean)).size

  return (
    <>
      <Breadcrumb
        title="News"
        text={
          activeMarket === "crypto"
            ? "Crypto market updates"
            : "Forex market events"
        }
      />

      <div className="space-y-6">
        <SurfaceCard className="overflow-hidden">
          <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {isCrypto ? <Coins className="size-3.5" /> : <CalendarDays className="size-3.5" />}
                {isCrypto ? "Crypto news" : "Forex calendar"}
              </span>
              <div>
                <h2 className="text-[30px] font-bold leading-none tracking-tight text-slate-900">
                  {isCrypto ? "Crypto market updates" : "Forex market calendar"}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  {isCrypto
                    ? "See important crypto headlines and market updates in one place."
                    : "Review upcoming economic events and their expected market impact."}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 border-neutral-200/70 bg-white"
              onClick={() => void (isCrypto ? loadCrypto() : loadForex())}
              disabled={activeLoading}
            >
              <RefreshCw className={`size-4 ${activeLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </SurfaceCard>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricTile
            icon={isCrypto ? Newspaper : CalendarDays}
            label={isCrypto ? "Stories" : "Events"}
            value={String(activeItems.length)}
            subtext={isCrypto ? "Latest articles available" : "Events currently listed"}
          />
          <MetricTile
            icon={Globe2}
            label="Source"
            value={activeSource || "Live"}
            subtext={isCrypto ? `${uniqueCryptoSources || 1} news sources in this view` : `${uniqueForexSymbols} currencies covered`}
          />
          <MetricTile
            icon={isCrypto ? TrendingUp : Clock3}
            label={isCrypto ? "Market focus" : "High impact"}
            value={isCrypto ? "Live" : String(highImpactCount)}
            subtext={
              isCrypto
                ? "Latest crypto updates"
                : "High-impact events shown"
            }
          />
        </div>

        <SurfaceCard className="overflow-hidden">
          <div className="border-b border-neutral-200/70 px-5 py-4">
            <h3 className="text-xl font-semibold text-slate-900">
              {isCrypto ? "Crypto news" : "Economic events"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {isCrypto
                ? "Latest headlines with links to the source."
                : "Upcoming events with time, currency, and impact."}
            </p>
          </div>

          <div className="px-5 py-5">
            {activeLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className={`w-full rounded-xl ${isCrypto ? "h-28" : "h-24"}`} />
                ))}
              </div>
            ) : activeError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-4 text-sm text-rose-600">
                {activeError}
              </div>
            ) : activeItems.length === 0 ? (
              <div className="rounded-2xl bg-neutral-50 px-6 py-14 text-center">
                <p className="text-base font-semibold text-slate-900">
                  {isCrypto ? "No news available yet" : "No events available yet"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Please refresh again in a moment.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-200/80">
                {isCrypto
                  ? crypto!.map((article, idx) => (
                      <li
                        key={String(article.url ?? article.title + String(idx))}
                        className="bg-card px-5 py-4 shadow-none"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            {article.url ? (
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-start gap-1 text-base font-semibold leading-snug text-slate-900 hover:text-primary"
                              >
                                <span>{article.title}</span>
                                <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                              </a>
                            ) : (
                              <p className="text-base font-semibold leading-snug text-slate-900">
                                {article.title}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-slate-600">
                                <Newspaper className="size-3.5" />
                                {article.source || "CoinTelegraph"}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-slate-600">
                                <Clock3 className="size-3.5" />
                                {fmtWhen(article.published_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  : forex!.map((event, idx) => (
                      <li
                        key={`${event.published_at ?? ""}-${event.title}-${idx}`}
                        className="bg-card px-5 py-4 shadow-none"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold leading-snug text-slate-900">
                              {event.title}
                            </p>

                            <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <Clock3 className="size-3.5" />
                              {fmtWhen(event.published_at)}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:pl-4">
                            {event.symbol ? (
                              <Badge
                                variant="outline"
                                className="border-primary/20 bg-white text-slate-700"
                              >
                                {event.symbol}
                              </Badge>
                            ) : null}
                            {event.impact ? (
                              <Badge variant={impactVariant(event.impact)}>{event.impact}</Badge>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </SurfaceCard>
      </div>
    </>
  )
}
