import type { ApexOptions } from "apexcharts"
import Chart from "react-apexcharts"
import { formatAxisCurrency } from "@/lib/chartFormatters"

interface DoubleBarChartProps {
  chartHeight?: number
  colorOne?: string
  colorTwo?: string
  categories: string[]
  series: { name: string; data: number[] }[]
  emptyMessage?: string
}

const DoubleBarChart = ({
  chartHeight = 264,
  colorOne = "487FFF",
  colorTwo = "FF9F29",
  categories,
  series,
  emptyMessage = "No data to display.",
}: DoubleBarChartProps) => {
  const hasData =
    categories.length > 0 &&
    series.length > 0 &&
    series.every((s) => s.data.length === categories.length)

  const maxVal = hasData
    ? Math.max(
        ...series.flatMap((s) => s.data.map((v) => Math.abs(Number(v) || 0))),
        0
      )
    : 0

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    colors: [`#${colorOne}`, `#${colorTwo}`],
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      show: true,
      borderColor: "#D1D5DB",
      strokeDashArray: 4,
      position: "back",
      padding: {
        bottom: 12,
        left: 4,
        right: 4,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: 10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: hasData ? categories : [],
      tickPlacement: "on",
      labels: {
        rotate: -55,
        rotateAlways: true,
        hideOverlappingLabels: true,
        trim: true,
        maxHeight: 100,
        style: {
          fontSize: "10px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatAxisCurrency(val),
      },
      decimalsInFloat: 2,
      min: 0,
      max: maxVal === 0 ? 1 : undefined,
      forceNiceScale: true,
      tickAmount: 5,
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(val),
      },
    },
  }

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
      series={series}
      type="bar"
      height={chartHeight}
    />
  )
}

export default DoubleBarChart
