import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface RadialBarChartType {
    chartHeight?: number;
}

const RadialBarChart = ({ chartHeight = 300 }: RadialBarChartType) => {
    const chartOptions: ApexOptions = {
        series: [80, 40, 10],
        chart: {
            height: chartHeight,
            type: 'radialBar',
        },
        colors: ['#3D7FF9', '#ff9f29', '#16a34a'],
        stroke: {
            lineCap: 'round',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '10%',  // Adjust this value to control the bar width
                },
                dataLabels: {
                    name: {
                        fontSize: '16px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                },
                track: {
                    margin: 20, // Space between the bars
                }
            }
        },
        labels: ['Cardiology', 'Psychiatry', 'Pediatrics'],
    };
    
    const chartSeries = [80, 40, 10]

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            height={chartHeight}
        />
    );
};

export default RadialBarChart