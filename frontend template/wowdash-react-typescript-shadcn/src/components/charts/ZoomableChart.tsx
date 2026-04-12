import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        type: 'area',
        width: '100%',
        height: 264,
        sparkline: {
            enabled: false // Remove whitespace
        },
        toolbar: {
            show: false
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 4,
        colors: ["#487fff"],
        lineCap: 'round'
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
    fill: {
        type: 'gradient',
        colors: ["#487fff"], // Set the starting color (top color) here
        gradient: {
            shade: 'light', // Gradient shading type
            type: 'vertical',  // Gradient direction (vertical)
            shadeIntensity: 0.5, // Intensity of the gradient shading
            gradientToColors: [`${"#487fff"}00`], // Bottom gradient color (with transparency)
            inverseColors: false, // Do not invert colors
            opacityFrom: .6, // Starting opacity
            opacityTo: 0.3,  // Ending opacity
            stops: [0, 100],
        },
    },
    // Customize the circle marker color on hover
    markers: {
        colors: ["#487fff"],
        strokeWidth: 3,
        size: 0,
        hover: {
            size: 10
        }
    },
    xaxis: {
        labels: {
            show: true
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
};

const chartSeries = [
    {
        name: 'This Day',
        data: [12, 18, 12, 48, 18, 30, 18, 15, 88, 40, 65, 24, 48],
    },
]

const ZoomableChart = () => {
    return (
        <div className="-m-4">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={264}
            />
        </div>
    );
};

export default ZoomableChart