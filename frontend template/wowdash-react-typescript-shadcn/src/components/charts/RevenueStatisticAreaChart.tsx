import type { ApexOptions } from "apexcharts";
import React from "react";
import Chart from 'react-apexcharts';

interface RevenueChartProps {
    series: { name: string; data: number[] }[];
    color1: string;
    color2: string;
    height?: number;
}

const RevenueStatisticAreaChart: React.FC<RevenueChartProps> = ({
    series,
    color1,
    color2,
    height = 150,
}) => {
    const options: ApexOptions = {
        series: series,
        chart: {
            type: "area",
            height: height,
            toolbar: { show: false },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: [color1, color2],
            lineCap: "round",
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: [color1 + "80", color2 + "80"],
                inverseColors: false,
                opacityFrom: 0.6,
                opacityTo: 0.2,
                stops: [0, 100],
            },
        },
        markers: {
            size: 0,
            colors: [color1, color2],
            strokeWidth: 2,
            hover: { size: 8 },
        },
        grid: {
            show: false,
        },
        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            labels: { show: true },
        },
        yaxis: {
            labels: {
                formatter: (val) => "$" + val + "k",
            },
        },
        tooltip: {
            x: { format: "dd/MM/yy HH:mm" },
        },
        legend: { show: false },
    };

    return (
        <div className="">
            <Chart options={options} series={series} type="area" height={height} />
        </div>
    );
};

export default RevenueStatisticAreaChart;