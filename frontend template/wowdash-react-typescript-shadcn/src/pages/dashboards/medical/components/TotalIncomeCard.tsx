import DonutTwoSeriesChart from "@/components/charts/DonutTwoSeriesChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const TotalIncomeCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Total Income</h6>
                            <CustomSelect
                                placeholder="This Month"
                                options={["This Month", "This Week", "This Year",]}
                            />
                        </div>
                    </div>
                    <div className="card-body pb-4 px-6">
                        <div className="">
                            <div className="mt-9 grow apexcharts-tooltip-z-none title-style circle-none relative">
                                <DonutTwoSeriesChart onChartHeight={270} chartSeries={[30, 30]} chartColors={["#ff9f29", "#45b369"]} />
                                <div className="text-center absolute top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2">
                                    <span className="text-gray-600 dark:text-neutral-100">Income</span>
                                    <h6 className="">$28,500</h6>
                                </div>
                            </div>
                            <ul className="grid grid-cols-2 gap-6 mt-3">
                                <li className="flex flex-col items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-2 rounded-[50rem] bg-yellow-500"></span>
                                        <span className="text-gray-600 dark:text-neutral-100 text-sm font-normal">Net Income</span>
                                    </div>
                                    <h6 className="text-gray-900 dark:text-white font-bold mb-0">$50,000</h6>
                                </li>
                                <li className="flex flex-col items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-2 rounded-[50rem] bg-green-600"></span>
                                        <span className="text-gray-600 dark:text-neutral-100 text-sm font-normal">Commission </span>
                                    </div>
                                    <h6 className="text-gray-900 dark:text-white font-bold mb-0">$20,000</h6>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TotalIncomeCard;