import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface DoubleBarChartType {
    chartHeight?: number,
    colorOne?: string,
    colorTwo?: string,
}

const DoubleBarChart = ({ chartHeight=264, colorOne="487FFF", colorTwo="FF9F29" } : DoubleBarChartType) => {
  const chartOptions: ApexOptions = {
    series: [
      {
        name: 'Net Profit',
        data: [20000, 16000, 14000, 25000, 45000, 18000, 28000, 11000, 26000, 48000, 18000, 22000],
      },
      {
        name: 'Revenue',
        data: [15000, 18000, 19000, 20000, 35000, 20000, 18000, 13000, 18000, 38000, 14000, 16000],
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
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
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

export default DoubleBarChart;
