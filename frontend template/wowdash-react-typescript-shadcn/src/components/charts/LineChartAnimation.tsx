import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        type: 'line',
        width: '100%',
        height: 264,
        sparkline: {
            enabled: false // Remove whitespace
        },
        toolbar: {
            show: false
        },
    },
    colors: ['#487FFF', '#FF9F29'],  // Set the color of the series
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 4,
        colors: ["#FF9F29", '#487fff'],
        lineCap: 'round',
    },
    grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        row: {
            colors: undefined,
            opacity: 0.5
        },
        column: {
            colors: undefined,
            opacity: 0.5
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    },
    // Customize the circle marker color on hover
    markers: {
        colors: ["#FF9F29", '#487fff'],
        strokeWidth: 3,
        size: 0,
        hover: {
            size: 10
        }
    },
    xaxis: {
        labels: {
            show: false
        },
        categories: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
        tooltip: {
            enabled: false,
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return "$" + value + "k";
            },
            style: {
                fontSize: "14px"
            }
        },
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    legend: {
        show: false
    }
};

const chartSeries = [
    {
        name: 'This Day',
        data: [8, 15, 9, 20, 10, 33, 13, 22, 8, 17, 10, 15],
    },
    {
        name: 'Example',
        data: [8, 24, 18, 40, 18, 48, 22, 38, 18, 30, 20, 28],
    },
]


const LineChartAnimation = () => {
    return (
        <div className="-m-4">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={264}
            />
        </div>
    );
};

export default LineChartAnimation