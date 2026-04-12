import CommonLink from '@/components/shared/CommonLink';
import TopSellingProductTable from '@/components/tables/TopSellingProductTable';
import { Card, CardContent } from '@/components/ui/card';

const TopSellingProductCard = () => {
    return (
        <Card className="card">
            <CardContent className="card-body p-0">
                <div className="flex items-center justify-between">
                    <h6 className="mb-3 font-semibold text-lg">Top Selling Product</h6>
                    <CommonLink />
                </div>

                <div className="mt-4 space-y-6">
                    <TopSellingProductTable />
                </div>
            </CardContent>
        </Card>
    );
};

export default TopSellingProductCard;