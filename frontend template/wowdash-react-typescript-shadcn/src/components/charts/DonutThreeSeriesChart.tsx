import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface DonutThreeSeriesChartPropsType {
    onChartHeight?: number;
    chartSeries?: number[];
    chartColors?: string[];
}

const DonutThreeSeriesChart = ({ onChartHeight = 270, chartSeries = [40, 30, 30], chartColors = ["#F59E0B", "#3B82F6", "#e4f1ff"] }: DonutThreeSeriesChartPropsType) => {
    const chartOptions: ApexOptions = {
        series: chartSeries,
        colors: chartColors,
        labels: ['Active', 'New', 'Total'],
        legend: {
            show: false
        },
        chart: {
            type: 'donut',
            height: onChartHeight,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            width: 0
        },
        dataLabels: {
            enabled: false
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    return (
        <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="donut"
            height={onChartHeight}
        />
    );
};

export default DonutThreeSeriesChart;
