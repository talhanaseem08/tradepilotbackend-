import DoubleBarChart from '@/components/charts/DoubleBarChart';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';
import StatsCard from './StatsCard';

const RevenueReportCard = () => {
    return (
        <Card className="card rounded-lg border-0 !p-0">
            <CardContent className='p-0'>
                <div className="grid grid-cols-1 2xl:grid-cols-12">
                    <div className="xl:col-span-12 2xl:col-span-6">
                        <div className="card-body p-6">
                            <div className="flex items-center flex-wrap gap-2 justify-between">
                                <h6 className="mb-0 font-bold text-lg">Revenue Report</h6>
                                <CustomSelect
                                    placeholder="Yearly"
                                    options={["Yearly", "Monthly", "Weekly", "Today"]}
                                />
                            </div>
                            <ul className="flex flex-wrap items-center mt-4 gap-3">
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-xs bg-blue-500"></span>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Earning:
                                        <span className="text-neutral-600 dark:text-neutral-200 font-bold"> $400,00,000.00</span>
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-xs bg-yellow-500"></span>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Expense:
                                        <span className="text-neutral-600 dark:text-neutral-200 font-bold"> $20,000.00</span>
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <div className="-m-4">
                                <DoubleBarChart chartHeight={286} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-12 2xl:col-span-6 2xl:border-l border-neutral-200 dark:border-slate-600">
                        <div className="grid grid-cols-1 sm:grid-cols-2 border-s-neutral-200">
                            <StatsCard />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RevenueReportCard;