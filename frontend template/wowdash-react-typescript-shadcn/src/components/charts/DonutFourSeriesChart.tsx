import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"

interface DonutFourSeriesChartProps {
  chartHeight?: number
  dataLabels?: boolean
  /** Slice values — must come from real metrics (counts, etc.). */
  series: number[]
  labels: string[]
}

/**
 * Donut chart — expects real `series`/`labels` from callers (no template defaults).
 */
const DonutFourSeriesChart = ({
  chartHeight = 300,
  /** Slice percentages (often cluttered); default off — use legend + center total. */
  dataLabels = false,
  series,
  labels,
}: DonutFourSeriesChartProps) => {
  const safeSeries = series.map((n) => Math.max(0, n))
  const sum = safeSeries.reduce((a, b) => a + b, 0)
  const displaySeries = sum > 0 ? safeSeries : safeSeries.map(() => 1)

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: chartHeight,
      toolbar: { show: false },
      animations: { enabled: true },
    },
    colors: ["#45B369", "#FF9F29", "#487FFF", "#9935FE"],
    labels: labels.slice(0, displaySeries.length),
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: {
      enabled: dataLabels,
      style: { fontSize: "11px", fontWeight: 600 },
      dropShadow: { enabled: false },
      formatter: (val: string | number) => {
        const n = typeof val === "number" ? val : parseFloat(String(val))
        if (Number.isNaN(n) || n < 6) return ""
        return `${n.toFixed(1)}%`
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: true,
              showAlways: true,
              label: "Trades",
              fontSize: "12px",
              formatter: (w) =>
                String(
                  (w.globals.seriesTotals as number[] | undefined)?.reduce(
                    (a, b) => a + b,
                    0
                  ) ?? 0
                ),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  }

  if (series.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ minHeight: chartHeight }}
      >
        No data
      </div>
    )
  }

  return (
    <Chart
      options={chartOptions}
      series={displaySeries}
      type="donut"
      height={chartHeight}
    />
  )
}

export default DonutFourSeriesChart
