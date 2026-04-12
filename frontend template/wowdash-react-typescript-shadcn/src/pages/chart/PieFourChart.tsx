import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface PeiFourChartType {
    chartHeight?: number;
}

const PieFourChart = ({ chartHeight = 240 } : PeiFourChartType) => {
    const chartOptions: ApexOptions = {
        series: [30, 30, 30, 30],
        chart: {
            height: chartHeight,
            type: 'pie',
        },
        labels: ['Entertainment', 'Bill Expense', 'Others', 'Investment'],
        colors: ['#02BCAF', '#F0437D', '#1C52F6', '#43DCFF'],
        legend: {
            show: true
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="pie"
            height={chartHeight}
        />
    );
};

export default PieFourChart;
