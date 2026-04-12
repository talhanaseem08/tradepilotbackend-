import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface RadialHalfChartType {
    chartHeight?: number;
    chartWidth?: number;
}

const RadialHalfChart = ({ chartHeight=165, chartWidth=165 }: RadialHalfChartType) => {
    const chartOptions: ApexOptions = {
      chart: {
        height: chartHeight,
        width: chartWidth,
        type: "radialBar",
        sparkline: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: -24,
          offsetX: -14,
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#E3E6E9",
            dropShadow: {
              enabled: false,
              top: 2,
              left: 0,
              color: "#999",
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            show: false,
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "22px",
            },
          },
        },
      },
      fill: {
        type: "gradient",
        colors: ["#9DBAFF"],
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#487FFF"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Percent"],
    };
    const chartSeries = [75];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="radialBar"
      height={chartHeight}
    />
  );
};

export default RadialHalfChart;
