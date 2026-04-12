import DonutThreeSeriesChart from '@/components/charts/DonutThreeSeriesChart';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';

const TrafficSourceCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-4">
                <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                    <h6 className="font-bold text-lg mb-0">Traffic Sources</h6>
                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>
                <div className="margin-16-minus y-value-left apexcharts-tooltip-z-none">
                    <DonutThreeSeriesChart />
                </div>

                <ul className="flex flex-wrap items-center justify-between mt-3 gap-3">
                    <li className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full
                                     bg-yellow-500"></span>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Organic Search</span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-100 font-bold">875</span>
                    </li>
                    <li className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full
                                     bg-green-600"></span>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Referrals</span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-100 font-bold">450</span>
                    </li>
                    <li className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full
                                     bg-blue-500"></span>
                            <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Social Media</span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-100 font-bold">4,305</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};

export default TrafficSourceCard;