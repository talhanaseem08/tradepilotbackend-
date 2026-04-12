import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface AreaChartBigChartType {
    chartHeight?: number;
    chartColor?: string;
}

const AreaChartBigChart = ({ chartHeight=370, chartColor="#487fff" }: AreaChartBigChartType) => {
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
            width: 4,
            colors: [chartColor],
            lineCap: 'round'
        },
        grid: {
            show: true,
            borderColor: '#D1D5DB',
            strokeDashArray: 1,
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
                show: true
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
            data: [18, 25, 20, 35, 25, 55, 45, 50, 40],
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

export default AreaChartBigChart;