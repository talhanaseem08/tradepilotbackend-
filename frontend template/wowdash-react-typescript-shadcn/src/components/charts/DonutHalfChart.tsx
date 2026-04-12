import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface DonutHalfChartType {
    chartHeight?: number
}

const DonutHalfChart = ({ chartHeight }: DonutHalfChartType) => {
    const chartOptions: ApexOptions = {
        colors: ['#45B369', '#FF9F29', '#487FFF'],
        labels: ['Active', 'New', 'Total'],
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
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10,
                customScale: 0.8,
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            showAlways: true,
                            show: true,
                            label: 'Customer Report',
                        }
                    },
                }
            }
        },
    };

    const chartSeries = [500, 500, 500]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={chartHeight}
        />
    );
};

export default DonutHalfChart;