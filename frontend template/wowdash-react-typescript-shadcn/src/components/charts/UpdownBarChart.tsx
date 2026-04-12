
import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface UpdownBarChartType {
    chartHeight?: number
}

const UpdownBarChart = ({ chartHeight=310 }: UpdownBarChartType) => {
    const chartOptions: ApexOptions = {
        chart: {
            stacked: true,
            type: "bar",
            height: chartHeight,
            fontFamily: "Poppins, sans-serif",
            toolbar: {
                show: false,
            },
        },
        colors: ["#487FFF", "#EF4A00"],
        plotOptions: {
            bar: {
                columnWidth: "8",
                borderRadius: 2,
                borderRadiusWhenStacked: "all",
            },
        },
        stroke: {
            width: [5, 5],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: "top",
        },
        yaxis: {
            show: false,
            title: {
                text: undefined,
            },
        },
        xaxis: {
            categories: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
            ],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: true,
                style: {
                    colors: "#d4d7d9",
                    fontSize: "10px",
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            theme: "dark",
            x: {
                show: false,
            },
        },
    };

    const chartSeries = [
        {
            name: "Income",
            data: [44, 42, 57, 86, 58, 55, 70, 44, 42, 57, 86, 58, 55, 70],
        },
        {
            name: "Expenses",
            data: [
                -34, -22, -37, -56, -21, -35, -60, -34, -22, -37, -56, -21, -35, -60,
            ],
        },
    ];

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={chartHeight}
        />
    );
};

export default UpdownBarChart;
