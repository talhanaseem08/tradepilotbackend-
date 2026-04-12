import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        height: 264,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
    },
    colors: ['#487FFF'],  // Set the color of the series
    dataLabels: {
        enabled: true
    },
    stroke: {
        curve: 'straight',
        width: 4,
    },
    markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
            size: 8
        }
    },
    grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0,
        },
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    name: "Desktops",
    data: [5, 25, 35, 15, 21, 15, 35, 35, 51]
}]


const LineChartLabel = () => {
    return (
        <div className="-m-4">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={264}
            />
        </div>
    );
};

export default LineChartLabel