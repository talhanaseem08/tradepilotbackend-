import DoubleLineChart from '@/components/charts/DoubleLineChart';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';
import StatsCard from './StatsCard';

const WidgetsAverageChart = () => {
    return (
        <Card className="card h-full rounded-lg border-0">
            <CardContent className="card-body p-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                        <div className="flex flex-col gap-3">
                            <StatsCard />
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 2xl:col-span-8">
                        <div className="card-body p-0 h-full flex flex-col justify-between">
                            <div className="">
                                <div className="flex items-center flex-wrap gap-2 justify-between">
                                    <h6 className="mb-2 font-bold text-lg">Average Enrollment Rate
                                    </h6>
                                    <div className="">
                                        <CustomSelect
                                            placeholder="Yearly"
                                            options={["Yearly", "Monthly", "Weekly", "Today"]}
                                        />
                                    </div>
                                </div>
                                <ul className="flex flex-wrap items-center justify-center mt-8 gap-3">
                                    <li className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                        <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Paid Course:
                                            <span className="text-neutral-600 dark:text-neutral-100 font-bold">350</span>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-green-600"></span>
                                        <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Free Course:
                                            <span className="text-neutral-600 dark:text-neutral-100 font-bold">70</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 apexcharts-tooltip-style-1">
                                <DoubleLineChart chartHeight={270} colors={["#45B369", "#487fff"]} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WidgetsAverageChart;