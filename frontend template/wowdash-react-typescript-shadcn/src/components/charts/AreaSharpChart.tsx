import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface AreaSharpChartType {
    chartHeight?: number;
     chartCurve?: "straight" | "smooth" | "stepline" | "monotoneCubic";
}

const AreaSharpChart = ({ chartHeight = 240, chartCurve = "straight" }: AreaSharpChartType) => {
    const chartOptions: ApexOptions = {
        series: [{
            name: 'series2',
            data: [20000, 45000, 30000, 50000, 32000, 40000, 30000, 42000, 28000, 34000, 38000, 26000]
        }],
        legend: {
            show: false
        },
        chart: {
            type: 'area',
            width: '100%',
            height: chartHeight,
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: chartCurve,
            width: 3,
            colors: ['#487FFF'],
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
            padding: {
                top: -20,
                right: 0,
                bottom: 0,
                left: 0
            },
        },
        fill: {
            type: 'gradient',
            colors: ['#487FFF'],
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ["#487FFF", `${'#487FFF'}00`], // Apply transparency to both colors
                inverseColors: false,
                opacityFrom: [0.4, 0.4], // Starting opacity for both colors
                opacityTo: [0.1, 0.1], // Ending opacity for both colors
                stops: [0, 100],
            },
        },
        markers: {
            colors: ['#487FFF'],
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tooltip: {
                enabled: false
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px"
                }
            },
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        }
    }

    return (
        <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="area"
            height={chartHeight}
        />
    );
};

export default AreaSharpChart;
