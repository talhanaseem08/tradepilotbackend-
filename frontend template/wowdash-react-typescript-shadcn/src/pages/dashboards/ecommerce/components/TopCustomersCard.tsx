import CommonLink from '@/components/shared/CommonLink';
import TopCustomerList from '@/components/shared/TopCustomerList';
import { Card, CardContent } from '@/components/ui/card';

const TopCustomersCard = () => {
    return (
        <Card className="card">
            <CardContent className="card-body p-0">
                <div className="flex items-center justify-between">
                    <h6 className="mb-3 font-semibold text-lg">Top Customers</h6>
                    <CommonLink />
                </div>

                <div className="mt-4 space-y-7">
                    <TopCustomerList />
                </div>
            </CardContent>
        </Card>
    );
};

export default TopCustomersCard;