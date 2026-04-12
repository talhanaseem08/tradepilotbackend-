import CommonLink from "@/components/shared/CommonLink";
import InventoryRecentTransactionsTable from "@/components/tables/InventoryRecentTransactionsTable";
import { Card, CardContent } from "@/components/ui/card";

const RecentTransactionsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Recent Transactions</h6>
                            <CommonLink />
                        </div>
                    </div>

                    <div className="p-6">
                        <InventoryRecentTransactionsTable />
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactionsCard;