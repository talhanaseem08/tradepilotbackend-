import CommonLink from '@/components/shared/CommonLink';
import StockReportTable from '@/components/tables/StockReportTable';
import { Card, CardContent } from '@/components/ui/card';

const StockReportCard = () => {
    return (
        <Card className="card">
            <CardContent className="card-body p-0">
                <div className="flex items-center justify-between">
                    <h6 className="mb-3 font-semibold text-lg">Stock Report</h6>
                    <CommonLink />
                </div>

                <div className="mt-4 space-y-6">
                    <StockReportTable />
                </div>
            </CardContent>
        </Card>
    );
};

export default StockReportCard;