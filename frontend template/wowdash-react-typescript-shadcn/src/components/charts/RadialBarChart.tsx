import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"

interface RadialBarChartProps {
  chartHeight?: number
  labels: string[]
  /** Win-rate percentages 0–100 per label */
  series: number[]
  emptyMessage?: string
}

/**
 * Win-rate by bot — horizontal bars (readable labels + %). Multi-series radial
 * charts overlap labels in the center; bars avoid that.
 */
const RadialBarChart = ({
  chartHeight = 300,
  labels,
  series,
  emptyMessage = "No data to display.",
}: RadialBarChartProps) => {
  const hasData = series.length > 0 && labels.length === series.length
  const adaptiveHeight = Math.max(chartHeight, series.length * 52 + 48)

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: adaptiveHeight,
      toolbar: { show: false },
      animations: { enabled: true },
      fontFamily: "inherit",
    },
    colors: ["#3D7FF9", "#ff9f29", "#16a34a", "#9935FE", "#487FFF"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "70%",
        distributed: true,
        dataLabels: {
          position: "end",
        },
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 8,
      formatter: (val: number) =>
        val != null && !Number.isNaN(val) ? `${Math.round(val)}%` : "",
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: ["#64748b"],
      },
      dropShadow: { enabled: false },
    },
    legend: { show: false },
    xaxis: {
      categories: hasData ? labels : [],
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val: string | number) =>
          `${typeof val === "number" ? val : parseFloat(String(val)) || 0}%`,
      },
    },
    yaxis: {
      labels: {
        maxWidth: 200,
        style: {
          fontSize: "11px",
        },
      },
    },
    grid: {
      borderColor: "#D1D5DB",
      strokeDashArray: 4,
      xaxis: {
        lines: { show: true },
      },
      padding: {
        left: 4,
        right: 12,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${Math.round(val)}% win rate`,
      },
    },
  }

  const chartSeries = hasData
    ? [{ name: "Win rate", data: series }]
    : [{ name: "Win rate", data: [] }]

  if (!hasData) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground px-4"
        style={{ minHeight: chartHeight }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={adaptiveHeight}
    />
  )
}

export default RadialBarChart
