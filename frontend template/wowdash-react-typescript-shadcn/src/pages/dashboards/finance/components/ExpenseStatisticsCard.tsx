import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";
import PieFourChart from "@/pages/chart/PieFourChart";


const ExpenseStatisticsCard: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-3 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Expense Statistics</h6>
                            <CustomSelect
                                placeholder="Yearly"
                                options={["Yearly", "Monthly", "Weekly", "Today"]}
                            />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="p-6">
                        <PieFourChart />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpenseStatisticsCard;
