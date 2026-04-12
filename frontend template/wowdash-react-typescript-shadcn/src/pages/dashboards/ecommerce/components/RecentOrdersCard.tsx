import CommonLink from '@/components/shared/CommonLink';
import RecentOrdersTable from '@/components/tables/RecentOrdersTable';
import { Card, CardContent } from '@/components/ui/card';

const RecentOrdersCard = () => {
    return (
        <Card className="card h-full border-0">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                    <h6 className="mb-0 font-bold text-lg">Recent Orders</h6>
                    <CommonLink/>
                </div>
                <RecentOrdersTable/>
            </CardContent>
        </Card>
    );
};

export default RecentOrdersCard;