import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface ChartColorType {
    chartColor: string;
    chartHeight: number;
}

const AreaChartWave = ({ chartColor, chartHeight }: ChartColorType) => {

    const chartOptions: ApexOptions = {
        chart: {
            type: 'area',
            width: '100%',
            height: chartHeight,
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
            curve: 'smooth',
            width: 2,
            colors: [chartColor],
            lineCap: 'round'
        },
        grid: {
            show: true,
            borderColor: 'red',
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
            row: {
                colors: undefined,
                opacity: 0.5
            },
            column: {
                colors: undefined,
                opacity: 0.5
            },
            padding: {
                top: -30,
                right: 0,
                bottom: -10,
                left: 0
            },
        },
        fill: {
            type: 'gradient',
            colors: [chartColor], // Set the starting color (top color) here
            gradient: {
                shade: 'light', // Gradient shading type
                type: 'vertical',  // Gradient direction (vertical)
                shadeIntensity: 0.5, // Intensity of the gradient shading
                gradientToColors: [`${chartColor}00`], // Bottom gradient color (with transparency)
                inverseColors: false, // Do not invert colors
                opacityFrom: .6, // Starting opacity
                opacityTo: 0.3,  // Ending opacity
                stops: [0, 100],
            },
        },
        // Customize the circle marker color on hover
        markers: {
            colors: [chartColor],
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
                show: false
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
            data: [4, 18, 13, 40, 30, 50, 30, 60, 40, 75, 45, 90],
        },
    ]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={chartHeight}
        />
    );
};

export default AreaChartWave;