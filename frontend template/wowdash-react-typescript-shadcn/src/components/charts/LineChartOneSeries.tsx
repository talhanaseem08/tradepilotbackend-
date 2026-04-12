import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';


interface LineChartOneSeriesType {
  chartHeight?: 290;
}

const LineChartOneSeries = ({ chartHeight = 290 }: LineChartOneSeriesType) => {
    const chartOptions: ApexOptions = {
      chart: {
        height: chartHeight,
        type: "line",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          top: 6,
          left: 0,
          blur: 4,
          color: "#000",
          opacity: 0.1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
          size: 8,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
        borderColor: "#D1D5DB",
        strokeDashArray: 3,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "$" + value + "k";
          },
          style: {
            fontSize: "14px",
          },
        },
      },
      xaxis: {
        categories: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
        tooltip: {
          enabled: false,
        },
        labels: {
          formatter: function (value: string) {
            return value;
          },
          style: {
            fontSize: "14px",
          },
        },
        axisBorder: {
          show: false,
        },
        crosshairs: {
          show: true,
          width: 20,
          stroke: {
            width: 0,
          },
          fill: {
            type: "solid",
            color: "#B1B9C4",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
      },
    };
    
    const chartSeries = [
      {
        name: "This month",
        data: [4, 16, 12, 28, 22, 38, 23],
      },
    ];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={chartHeight}
    />
  );
};

export default LineChartOneSeries;
