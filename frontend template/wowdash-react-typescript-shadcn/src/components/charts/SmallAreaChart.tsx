import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"
import { padSeriesMin2 } from "@/lib/dashboardSeries"

interface SmallAreaChartProps {
  /** Y values from real metrics (account path, cumulative P&L, etc.). */
  data: number[]
  chartColor?: string
  chartWidth?: number
  chartHeight?: number
}

const SmallAreaChart = ({
  data,
  chartColor = "#487fff",
  chartWidth = 80,
  chartHeight = 42,
}: SmallAreaChartProps) => {
  const points = padSeriesMin2(data)

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      width: chartWidth,
      height: chartHeight,
      sparkline: {
        enabled: true,
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
      width: 2,
      colors: [chartColor],
      lineCap: "round",
    },
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: -3,
        right: 0,
        bottom: 0,
        left: 0,
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
        opacityFrom: 0.75,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    markers: {
      colors: [chartColor],
      strokeWidth: 2,
      size: 0,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      categories: points.map((_, i) => String(i)),
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  }

  const chartSeries = [
    {
      name: "v",
      data: points,
    },
  ]

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      height={chartHeight}
      width={chartWidth}
    />
  )
}

export default SmallAreaChart
