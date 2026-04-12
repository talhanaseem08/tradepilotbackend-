import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        width: 400,
        height: 300,
        type: 'radialBar',
        sparkline: {
            enabled: true,
        },
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        radialBar: {
            offsetY: -24,
            offsetX: -14,
            startAngle: -90,
            endAngle: 90,
            track: {
                background: "#E3E6E9",
                strokeWidth: "70%",
            },
            hollow: {
                size: "70%",
            },
            dataLabels: {
                show: false,

                value: {
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#487FFF',
                    offsetY: 16,
                },
            },
        },
    },
    fill: {
        type: 'gradient',
        colors: ['#9DBAFF'],
        gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#487FFF'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
        },
    },
    stroke: {
        lineCap: 'round',
    },
};
const chartSeries = [75];

const SemiCircleGauge = () => {
    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            height={300}
        />
    );
};

export default SemiCircleGauge;