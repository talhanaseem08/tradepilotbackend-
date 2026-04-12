import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface DonutFourSeriesChartType {
    chartHeight?:number;
    dataLabels?: boolean;
}

const DonutFourSeriesChart = ({ chartHeight = 300, dataLabels = true }: DonutFourSeriesChartType) => {
    const chartOptions: ApexOptions = {
        series: [30, 30, 20, 20],
        colors: ['#FF9F29', '#487FFF', '#45B369', '#9935FE'],
        labels: ['Purchase', 'Sales', 'Expense', 'Gross Profit'],
        legend: {
            show: false
        },
        chart: {
            type: 'donut',
            height: chartHeight,
            sparkline: {
                enabled: true // Remove whitespace
            },
        },
        stroke: {
            width: 0,
        },
        dataLabels: {
            enabled: dataLabels
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
    };

    return (
        <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="donut"
            height={chartHeight}
        />
    );
};

export default DonutFourSeriesChart;
