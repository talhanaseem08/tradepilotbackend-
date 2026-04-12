import DonutSixSeriesChart from "@/components/charts/DonutSixSeriesChart";
import MultipleSeriesChart from "@/components/charts/MultipleSeriesChart";
import PieChart from "@/components/charts/PieChart";
import RadarChart from "@/components/charts/RadarChart";
import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";

const PieChartPage = () => {
    return (
        <>
            <Breadcrumb title="Pie Chart" text="Pie Chart" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <DefaultCardComponent title="Basic Pie Chart">
                    <LazyWrapper>
                        <div className="-m-4">
                            <PieChart />
                        </div>
                    </LazyWrapper>
                </DefaultCardComponent>

                <DefaultCardComponent title="Donut Chart">
                    <div className="text-center flex flex-wrap items-start gap-5 justify-center">
                        <div className="relative">
                            <LazyWrapper>
                                <div className="-m-4">
                                    <DonutSixSeriesChart />
                                </div>
                            </LazyWrapper>
                            <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className="text-lg text-neutral-500 dark:text-neutral-300 font-medium">Total Value</span>
                                <h4 className="mb-0">72</h4>
                            </div>
                        </div>

                        <div className="max-w-[290px] w-full">
                            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-600 pb-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">Label</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">Value</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-green-600 rounded-full"></span> Label 1
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">12</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm"> 30.6% </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Label 2
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">22</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">  42.9%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-cyan-600 rounded-full"></span> Label 3
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">12</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm"> 24.6% </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-red-600 rounded-full"></span> Label 4
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">12</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm"> 26.6% </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span> Label 5
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">7</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm"> 13.3% </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm flex items-center gap-3">
                                    <span className="w-3 h-3 bg-yellow-600 rounded-full"></span> Label 6
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm">7</span>
                                <span className="text-neutral-600 dark:text-neutral-200 font-medium text-sm"> 15.3% </span>
                            </div>
                        </div>
                    </div>
                </DefaultCardComponent>

                <DefaultCardComponent title="Radar Chart">
                    <LazyWrapper>
                        <RadarChart />
                    </LazyWrapper>
                </DefaultCardComponent>

                <DefaultCardComponent title="Multiple series">
                    <LazyWrapper>
                        <MultipleSeriesChart />
                    </LazyWrapper>
                </DefaultCardComponent>

            </div>

        </>
    );
};

export default PieChartPage;