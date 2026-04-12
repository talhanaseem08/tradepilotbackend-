import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        height: 264,
        type: 'line',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        colors: ['#487FFF'],
        width: 4
    },
    markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
            size: 8
        }
    },
    tooltip: {
        enabled: true,
        x: {
            show: true,
        },
    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
        },
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
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
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        tooltip: {
            enabled: false
        },
        labels: {
            style: {
                fontSize: "14px"
            }
        },
        axisBorder: {
            show: false
        },
    }
};

const chartSeries = [{
    name: "This month",
    data: [0, 48, 20, 24, 6, 33, 30, 48, 35, 18, 20, 5]
}]

const LineChart = () => {
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

export default LineChart