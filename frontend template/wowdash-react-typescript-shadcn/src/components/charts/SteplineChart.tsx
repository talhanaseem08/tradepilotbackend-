import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        type: 'line',
        height: 270,
        toolbar: {
            show: false
        },
    },
    stroke: {
        curve: 'stepline',
    },
    colors: ['#487FFF'],
    dataLabels: {
        enabled: false
    },
    markers: {
        hover: {
            sizeOffset: 4
        }
    },
    grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
        position: 'back',
    },
    xaxis: {
        labels: {
            show: false
        },
        categories: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
        tooltip: {
            enabled: false,
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return "$" + value + "k";
            },
            style: {
                fontSize: "14px"
            }
        },
    },
};

const chartSeries = [{
    data: [16, 25, 38, 50, 32, 20, 42, 18, 4, 25, 12, 12],
    name: "Example",
}]


const SteplineChart = () => {
    return (
        <div className="-m-4">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={270}
            />
        </div>
    );
};

export default SteplineChart