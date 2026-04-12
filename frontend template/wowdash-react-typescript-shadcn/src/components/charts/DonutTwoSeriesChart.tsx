import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface DonutTwoSeriesChartPropsType {
    onChartHeight?: number;
    chartSeries?: number[];
    chartColors?: string[];
}

const DonutTwoSeriesChart = ({ onChartHeight = 270, chartSeries = [30, 30], chartColors = ["#ff9f29", "#487fff"] }: DonutTwoSeriesChartPropsType) => {
    const chartOptions: ApexOptions = {
        series: chartSeries,
        colors: chartColors,
        labels: ['Female', 'Male'],
        legend: {
            show: false
        },
        chart: {
            type: 'donut',
            height: onChartHeight,
            sparkline: {
                enabled: true // Remove whitespace
            },
        },
        stroke: {
            width: 0,
        },
        dataLabels: {
            enabled: false
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
    // const chartSerieses = chartSeries
    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={onChartHeight}
        />
    );
};

export default DonutTwoSeriesChart;