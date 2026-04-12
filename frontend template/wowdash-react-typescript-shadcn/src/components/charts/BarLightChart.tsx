import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface BarLightChartProps {
    chartHeight?: number,
    chartWidth?: string,
    chartBorderRadius?: number
}

const
    BarLightChart = ({ chartHeight = 235, chartWidth = "100%", chartBorderRadius = 6 }: BarLightChartProps) => {
        const chartSeries: ApexAxisChartSeries = [{
            name: "Sales",
            data: [{
                x: 'Sun',
                y: 15,
            }, {
                x: 'Mon',
                y: 12,
            }, {
                x: 'Tue',
                y: 18,
            }, {
                x: 'Wed',
                y: 20,
            }, {
                x: 'Thu',
                y: 13,
            }, {
                x: 'Fri',
                y: 16,
            }, {
                x: 'Sat',
                y: 6,
            }]
        }]

        const chartOptions: ApexOptions = {
            chart: {
                type: 'bar',
                height: chartHeight,
                width: chartWidth,
                toolbar: {
                    show: false
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: chartBorderRadius,
                    horizontal: false,
                    columnWidth: '52%',
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'gradient',
                colors: ['#dae5ff'], // Set the starting color (top color) here
                gradient: {
                    shade: 'light', // Gradient shading type
                    type: 'vertical',  // Gradient direction (vertical)
                    shadeIntensity: 0.5, // Intensity of the gradient shading
                    gradientToColors: ['#dae5ff'], // Bottom gradient color (with transparency)
                    inverseColors: false, // Do not invert colors
                    opacityFrom: 1, // Starting opacity
                    opacityTo: 1,  // Ending opacity
                    stops: [0, 100],
                },
            },
            grid: {
                show: false,
                borderColor: '#D1D5DB',
                strokeDashArray: 4, // Use a number for dashed style
                position: 'back',
                padding: {
                    top: -10,
                    right: -10,
                    bottom: -10,
                    left: -10
                }
            },
            xaxis: {
                type: 'category',
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            yaxis: {
                show: false,
            },
        };

        return (
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={chartHeight}
                width={chartWidth}
            />
        );
    };

export default BarLightChart;