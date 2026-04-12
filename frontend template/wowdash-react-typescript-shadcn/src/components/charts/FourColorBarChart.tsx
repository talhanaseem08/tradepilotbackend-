import type { ApexOptions } from "apexcharts";
import Chart from 'react-apexcharts';

interface FourColorBarChartType {
    chartHeight?: number;
}

const FourColorBarChart = ({ chartHeight= 300 } : FourColorBarChartType) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: chartHeight,
            stacked: true,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    show: false,
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        colors: ['#487FFF', '#FF9F29', '#48AB69', '#45B369'],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                columnWidth: 10,
                borderRadiusApplication: 'end', // 'around', 'end'
                borderRadiusWhenStacked: 'last', // 'all', 'last'
                dataLabels: {
                    total: {
                        enabled: false, // Disable total data labels
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        dataLabels: {
            enabled: false // Disable data labels
        },
        xaxis: {
            type: 'category',
            categories: ['01', '03', '05', '07', '10', '13', '16', '19', '21', '23', '25', '27'],
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return (value / 1000).toFixed(0) + 'k';
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value / 1000 + 'k';
                }
            }
        },
        legend: {
            position: 'right',
            offsetY: 40,
            show: false
        },
        fill: {
            opacity: 1
        }
    };

    const chartSeries = [{
        name: 'PRODUCT A',
        data: [14, 18, 24, 35, 14, 22, 43, 14, 22, 43, 14, 18]
    }, {
        name: 'PRODUCT B',
        data: [13, 23, 20, 25, 13, 13, 27, 13, 13, 27, 13, 23]
    }, {
        name: 'PRODUCT C',
        data: [11, 17, 20, 25, 11, 21, 14, 11, 21, 14, 11, 17]
    }, {
        name: 'PRODUCT D',
        data: [21, 15, 20, 25, 21, 22, 8, 10, 22, 8, 21, 15]
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

export default FourColorBarChart;