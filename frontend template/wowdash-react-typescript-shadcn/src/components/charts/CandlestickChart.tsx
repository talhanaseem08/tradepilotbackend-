import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"
import { fetchCandles } from "@/lib/api"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CandlestickChartProps {
  chartHeight?: number
  symbol?: string
  market?: string
  timeframe?: string
  count?: number
}

const CandlestickChart = ({
  chartHeight = 350,
  symbol = "EUR_USD",
  market = "forex",
  timeframe = "1h",
  count = 200,
}: CandlestickChartProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [series, setSeries] = useState<
    { data: { x: Date; y: number[] }[] }[]
  >([{ data: [] }])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchCandles(symbol, { market, timeframe, count }).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setError(res.message)
        setLoading(false)
        return
      }
      const candles = res.data.candles ?? []
      const data = candles.map((c, i) => {
        let x: Date
        if (c.timestamp) {
          x = new Date(c.timestamp)
        } else {
          x = new Date(Date.now() - (candles.length - i) * 3600000)
        }
        return {
          x,
          y: [c.open, c.high, c.low, c.close],
        }
      })
      setSeries([{ data }])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [symbol, market, timeframe, count])

  const chartOptions: ApexOptions = {
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#487FFF",
          downward: "#FF9F29",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    chart: {
      type: "candlestick",
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }

  if (loading) {
    return <Skeleton className="w-full rounded-lg" style={{ height: chartHeight }} />
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center text-sm text-red-500 px-4 text-center"
        style={{ minHeight: chartHeight }}
      >
        {error}
      </div>
    )
  }

  if (!series[0]?.data?.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground px-4"
        style={{ minHeight: chartHeight }}
      >
        No candle data returned for this symbol.
      </div>
    )
  }

  return (
    <Chart
      options={chartOptions}
      series={series}
      type="candlestick"
      height={chartHeight}
    />
  )
}

export default CandlestickChart
