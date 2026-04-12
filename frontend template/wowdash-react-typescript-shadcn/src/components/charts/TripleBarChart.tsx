import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface TripleBarChartType {
    chartHeight?: number,
    colorOne?: string,
    colorTwo?: string,
    colorThree?: string,
}

const TripleBarChart = ({ chartHeight = 264, colorOne = "45B369", colorTwo = "144bd6", colorThree = "FF9F29" }: TripleBarChartType) => {
    const chartOptions: ApexOptions = {
        colors: [`#${colorOne}`, `#${colorTwo}`, `#${colorThree}`],
        labels: ['Active', 'New', 'Total'],

        legend: {
            show: false
        },
        chart: {
            type: 'bar',
            height: chartHeight,
            toolbar: {
                show: false
            },
        },
        grid: {
            show: true,
            borderColor: '#D1D5DB',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: 8,
            },
        },
        dataLabels: {
            enabled: false
        },
        states: {
            hover: {
                filter: {
                    type: 'none'
                }
            }
        },
        stroke: {
            show: true,
            width: 0,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        },
        fill: {
            opacity: 1,
        },
    };

    const chartSeries = [{
        name: 'Net Profit',
        data: [44, 100, 40, 56, 30, 58, 50]
    }, {
        name: 'Revenue',
        data: [90, 140, 80, 125, 70, 140, 110]
    }, {
        name: 'Free Cash',
        data: [60, 120, 60, 90, 50, 95, 90]
    }]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={chartHeight}
        />
    );
};

export default TripleBarChart;
