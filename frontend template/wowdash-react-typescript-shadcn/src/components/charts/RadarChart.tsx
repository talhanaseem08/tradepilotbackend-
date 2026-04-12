import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const RadarChart = () => {
    const chartOptions: ApexOptions = {
        colors: ['#FF9F29', '#487FFF'],
        chart: {
            height: 264,
            type: 'radar',
            toolbar: {
                show: false,
            },
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
            }
        },
        stroke: {
            width: 2
        },
        fill: {
            opacity: 0.25
        },
        markers: {
            size: 0
        },
        yaxis: {
            stepSize: 20
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        }
    };

    const chartSeries = [{
        name: 'Product 1',
        data: [80, 50, 30, 40, 60, 20, 62, 30, 40, 80],
    }, {
        name: 'Product 2',
        data: [80, 60, 80, 70, 68, 60, 56, 50, 40, 45],
    }]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="radar"
            height={264}
        />
    );
};

export default RadarChart