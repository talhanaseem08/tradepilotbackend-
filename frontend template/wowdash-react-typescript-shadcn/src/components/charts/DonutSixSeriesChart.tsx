import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const DonutSixSeriesChart = () => {
    const chartOptions: ApexOptions = {

        chart: {
            height: 264,
            type: 'donut',
        },
        colors: ['#16a34a', '#487fff', '#2563eb', '#dc2626', '#f86624', '#ffc107'],
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
                    show: false
                }
            }
        }],
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
            show: false
        }
    };

    const chartSeries = [44, 55, 13, 33, 28, 14]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={264}
        />
    );
};

export default DonutSixSeriesChart