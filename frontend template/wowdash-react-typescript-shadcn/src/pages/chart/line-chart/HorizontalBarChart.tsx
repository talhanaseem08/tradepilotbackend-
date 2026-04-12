import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        type: 'bar',
        height: 270,
        toolbar: {
            show: false
        },
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
            distributed: true,
            barHeight: '22px'
        }
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: true,
        borderColor: '#ddd',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    xaxis: {
        categories: ['Booking', 'Pending', 'Finished', 'Canceled', 'Refunded'],
    },
    legend: {
        show: false
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ['#C98BFF', '#FFDC90', '#94FF9B', '#FFAC89', '#A3E2FE'],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
        }
    },
    colors: [
        '#8501F8',
        '#FF9F29',
        '#00D40E',
        '#F84B01',
        '#2FBCFC'
    ]
};

const chartSeries = [{
    data: [6200, 5200, 4200, 3200, 1200]
}]


const HorizontalBarChart = () => {
    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={270}
        />
    );
};

export default HorizontalBarChart;