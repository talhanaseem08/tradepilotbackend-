import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface DoubleBarChartSevenSeriesType {
    chartHeight?: number,
    colorOne?: string,
    colorTwo?: string,
}

const DoubleBarChartSevenSeries = ({ chartHeight=264, colorOne="487FFF", colorTwo="FF9F29" } : DoubleBarChartSevenSeriesType) => {
  const chartOptions: ApexOptions = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 100, 40, 56, 30, 58, 50],
      },
      {
        name: 'Revenue',
        data: [60, 120, 60, 90, 50, 95, 90],
      },
    ],
    chart: {
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    colors: [`#${colorOne}`, `#${colorTwo}`],
    legend: {
      show: false,
    },
    grid: {
      show: true,
      borderColor: '#D1D5DB',
      strokeDashArray: 4,
      position: 'back',
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
      colors: ['transparent'],
    },
    xaxis: {
        categories: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <Chart
      options={chartOptions}
      series={chartOptions.series}
      type="bar"
      height={chartHeight}
    />
  );
};

export default DoubleBarChartSevenSeries;
