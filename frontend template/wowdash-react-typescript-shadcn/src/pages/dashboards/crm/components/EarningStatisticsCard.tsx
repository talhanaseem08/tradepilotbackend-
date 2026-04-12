import BarChartYear from '@/components/charts/BarChartYear';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowBigUp, ShoppingCart, SquareKanban } from 'lucide-react';

const EarningStatisticsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <div>
                        <h6 className="mb-0 font-bold text-lg">Earning Statistic</h6>
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-100">Yearly earning overview</span>
                    </div>
                    <div className="">
                        <CustomSelect
                            placeholder="Yearly"
                            options={["Yearly", "Monthly", "Weekly", "Today"]}
                        />
                    </div>
                </div>

                <div className="mt-5 flex justify-center flex-wrap gap-3">

                    <div className="inline-flex items-center gap-2 p-2 rounded-lg border transition hover:border-primary border-neutral-200 dark:border-neutral-500 dark:hover:border-primary pe-[46px] br-hover-primary group">
                        <span className="bg-neutral-100 dark:bg-slate-600 w-[44px] h-[44px] text-2xl transition rounded-lg flex justify-center items-center text-neutral-600 dark:text-neutral-100 group-hover:text-white group-hover:bg-primary">
                            <ShoppingCart />
                        </span>
                        <div>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-medium">Sales</span>
                            <h6 className="text-base font-semibold mb-0">$200k</h6>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 p-2 rounded-lg border transition hover:border-primary border-neutral-200 dark:border-neutral-500 dark:hover:border-primary pe-[46px] br-hover-primary group">
                        <span className="bg-neutral-100 dark:bg-slate-600 w-[44px] h-[44px] text-2xl transition rounded-lg flex justify-center items-center text-neutral-600 dark:text-neutral-100 group-hover:text-white group-hover:bg-primary">
                            <SquareKanban />
                        </span>
                        <div>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-medium">Income</span>
                            <h6 className="text-base font-semibold mb-0">$200k</h6>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 p-2 rounded-lg border transition hover:border-primary border-neutral-200 dark:border-neutral-500 dark:hover:border-primary pe-[46px] br-hover-primary group">
                        <span className="bg-neutral-100 dark:bg-slate-600 w-[44px] h-[44px] text-2xl transition rounded-lg flex justify-center items-center text-neutral-600 dark:text-neutral-100 group-hover:text-white group-hover:bg-primary">
                            <ArrowBigUp />
                        </span>
                        <div>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-medium">Profit</span>
                            <h6 className="text-base font-semibold mb-0">$200k</h6>
                        </div>
                    </div>
                </div>

                <div className="-mb-4 mt-0">
                    <BarChartYear chartHeight={330} />
                </div>
                
            </CardContent>
        </Card>
    );
};

export default EarningStatisticsCard;