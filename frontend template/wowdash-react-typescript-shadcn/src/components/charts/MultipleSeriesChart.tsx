import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        type: 'polarArea',
        height: 264,
    },
    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
    colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'],
    stroke: {
        colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'],
    },
    fill: {
        opacity: 0.8
    },
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
                position: 'bottom'
            }
        }
    }]
};

const chartSeries = [20, 22, 28, 10]

const MultipleSeriesChart = () => {
    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="polarArea"
            height={264}
        />
    );
};

export default MultipleSeriesChart