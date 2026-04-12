import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const PieChart = () => {
    const chartOptions: ApexOptions = {
        chart: {
            height: 264,
            type: 'pie',
        },
        stroke: {
            show: false // This will remove the white border
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        colors: ['#487FFF', "#FF9F29", '#45B369', '#EF4A00'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center' // Align the legend horizontally
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: false,
                    position: 'bottom', // Ensure the legend is at the bottom
                    horizontalAlign: 'center', // Align the legend horizontally
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }]
    };

    const chartSeries = [70, 80, 90, 30]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            height={264}
        />
    );
};

export default PieChart