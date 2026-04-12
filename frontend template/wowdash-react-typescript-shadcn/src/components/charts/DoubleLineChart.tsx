import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface DoubleLineChartProps {
    colors: [string, string];
    chartHeight?: number;
}

const DoubleLineChart = ({ colors, chartHeight = 270 }: DoubleLineChartProps) => {
    const chartOptions: ApexOptions = {
        legend: {
            show: false,
        },
        chart: {
            type: "area",
            width: "100%",
            height: chartHeight,
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: colors,
            lineCap: "round",
        },
        grid: {
            show: true,
            borderColor: "#D1D5DB",
            strokeDashArray: 1,
            position: "back",
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { top: -20, right: 0, bottom: -10, left: 0 },
        },
        fill: {
            type: "gradient",
            colors: colors,
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: [colors[0], `${colors[1]}00`],
                inverseColors: false,
                opacityFrom: [0.4, 0.6],
                opacityTo: [0.3, 0.3],
                stops: [0, 100],
            },
        },
        markers: {
            colors: colors,
            strokeWidth: 3,
            size: 0,
            hover: { size: 10 },
        },
        xaxis: {
            labels: { show: true },
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            tooltip: { enabled: false },
        },
        yaxis: {
            labels: {
                formatter: (value) => "$" + value + "k",
                style: { fontSize: "14px" },
            },
        },
        tooltip: {
            x: { format: "dd/MM/yy HH:mm" },
        },
    };
    const chartSeries = [
        {
            name: "series1",
            data: [48, 35, 55, 32, 48, 30, 55, 50, 57],
        },
        {
            name: "series2",
            data: [12, 20, 15, 26, 22, 60, 40, 48, 25],
        },
    ];

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={chartHeight}
        />
    );
};

export default DoubleLineChart;