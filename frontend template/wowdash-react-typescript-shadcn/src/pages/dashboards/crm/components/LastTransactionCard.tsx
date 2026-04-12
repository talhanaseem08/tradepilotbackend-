import CommonLink from '@/components/shared/CommonLink';
import LastTransactionTable from '@/components/tables/LastTransactionTable';
import { Card, CardContent } from '@/components/ui/card';

const LastTransactionCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between py-4 px-6 border-b border-neutral-200 dark:border-slate-600">
                    <h6 className="mb-0 font-bold text-lg">Last Transaction</h6>
                    <CommonLink />
                </div>

                <div className="p-6">
                    <LastTransactionTable />
                </div>
            </CardContent>
        </Card>
    );
};

export default LastTransactionCard;