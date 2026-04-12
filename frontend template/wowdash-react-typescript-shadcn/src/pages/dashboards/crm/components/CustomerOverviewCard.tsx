import DonutHalfChart from '@/components/charts/DonutHalfChart';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';

const CustomerOverviewCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 overflow-hidden">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="mb-0 font-bold text-lg">Customer Overview</h6>
                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>

                <div className="flex sm:flex-nowrap flex-wrap items-center mt-4">
                    <ul className="shrink-0">
                        <li className="flex items-center gap-2 mb-7">
                            <span className="w-3 h-3 rounded-full bg-green-600"></span>
                            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">Total: 400</span>
                        </li>
                        <li className="flex items-center gap-2 mb-7">
                            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">New: 400</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">Active: 1400</span>
                        </li>
                    </ul>
                    <div className="grow apexcharts-tooltip-z-none title-style circle-none donutChart -mt-8 min-h-[163px] h-1">
                        <DonutHalfChart chartHeight={300} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CustomerOverviewCard;