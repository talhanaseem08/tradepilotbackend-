import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"
import { formatAxisCurrency } from "@/lib/chartFormatters"

interface AreaChartBigChartProps {
  chartHeight?: number
  chartColor?: string
  /** Series name in legend/tooltip */
  seriesName?: string
  /** Y values (e.g. cumulative realized P&L). */
  data: number[]
  /** X labels (same length as `data`) — used when `datetimePoints` is omitted. */
  categories: string[]
  /**
   * Prefer this over `data` + `categories` when present — datetime x-axis avoids
   * duplicate labels when several closes share the same calendar day.
   */
  datetimePoints?: { x: number; y: number }[]
  emptyMessage?: string
}

const AreaChartBigChart = ({
  chartHeight = 370,
  chartColor = "#487fff",
  seriesName = "P&L",
  data,
  categories,
  datetimePoints,
  emptyMessage = "No data to display.",
}: AreaChartBigChartProps) => {
  const dt =
    datetimePoints && datetimePoints.length > 0
      ? datetimePoints.length === 1
        ? [
            datetimePoints[0],
            {
              x: datetimePoints[0].x + 3_600_000,
              y: datetimePoints[0].y,
            },
          ]
        : datetimePoints
      : null

  const hasCategoryData =
    data.length > 0 && categories.length === data.length && !dt
  const hasData = Boolean(dt?.length || hasCategoryData)

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      width: "100%",
      height: chartHeight,
      sparkline: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 4,
      colors: [chartColor],
      lineCap: "round",
    },
    grid: {
      show: true,
      borderColor: "#D1D5DB",
      strokeDashArray: 1,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: -30,
        right: 8,
        bottom: dt ? 8 : -10,
        left: 8,
      },
    },
    fill: {
      type: "gradient",
      colors: [chartColor],
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [`${chartColor}00`],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    markers: {
      colors: [chartColor],
      strokeWidth: 3,
      size: 0,
      hover: {
        size: 10,
      },
    },
    xaxis: dt
      ? {
          type: "datetime",
          tickAmount: 6,
          labels: {
            show: true,
            datetimeUTC: false,
            format: "dd MMM",
            rotate: -40,
            rotateAlways: true,
            hideOverlappingLabels: true,
            maxHeight: 120,
            style: {
              fontSize: "11px",
            },
          },
          tooltip: {
            enabled: false,
          },
        }
      : {
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: categories.length > 8,
            hideOverlappingLabels: true,
            maxHeight: 100,
            style: { fontSize: "11px" },
          },
          categories: hasCategoryData ? categories : [],
          tooltip: {
            enabled: false,
          },
        },
    yaxis: {
      labels: {
        show: true,
        formatter: (val: number) => formatAxisCurrency(val),
      },
      decimalsInFloat: 2,
    },
    tooltip: {
      x: dt
        ? {
            format: "dd MMM yyyy HH:mm",
          }
        : undefined,
      y: {
        formatter: (val: number) =>
          new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          }).format(val),
      },
    },
  }

  const chartSeries = [
    {
      name: seriesName,
      data: dt
        ? dt.map((p) => ({ x: p.x, y: p.y }))
        : hasCategoryData
          ? data
          : [],
    },
  ]

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
      type="area"
      height={chartHeight}
    />
  )
}

export default AreaChartBigChart
