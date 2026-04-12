import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface BarChartYearType {
    chartHeight?: number;
}

const BarChartYear = ({ chartHeight = 310 }: BarChartYearType) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: chartHeight,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '23%',
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            colors: ['#487FFF'], // Set the starting color (top color) here
            gradient: {
                shade: 'light', // Gradient shading type
                type: 'vertical',  // Gradient direction (vertical)
                shadeIntensity: 0.5, // Intensity of the gradient shading
                gradientToColors: ['#487FFF'], // Bottom gradient color (with transparency)
                inverseColors: false, // Do not invert colors
                opacityFrom: 1, // Starting opacity
                opacityTo: 1,  // Ending opacity
                stops: [0, 100],
            },
        },
        grid: {
            show: true,
            borderColor: '#D1D5DB',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return (value / 1000).toFixed(0) + 'k';
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value / 1000 + 'k';
                }
            }
        }
    };
    const chartSeries = [{
        name: "Sales",
        data: [{
            x: 'Jan',
            y: 85000,
        }, {
            x: 'Feb',
            y: 70000,
        }, {
            x: 'Mar',
            y: 40000,
        }, {
            x: 'Apr',
            y: 50000,
        }, {
            x: 'May',
            y: 60000,
        }, {
            x: 'Jun',
            y: 50000,
        }, {
            x: 'Jul',
            y: 40000,
        }, {
            x: 'Aug',
            y: 50000,
        }, {
            x: 'Sep',
            y: 40000,
        }, {
            x: 'Oct',
            y: 60000,
        }, {
            x: 'Nov',
            y: 30000,
        }, {
            x: 'Dec',
            y: 50000,
        }]
    }]

    return (
        <div className="-m-4 mt-0">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={chartHeight}
            />
        </div>
    );
};

export default BarChartYear;