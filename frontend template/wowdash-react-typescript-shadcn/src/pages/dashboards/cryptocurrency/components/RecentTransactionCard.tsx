import CommonLink from "@/components/shared/CommonLink";
import RecentTransactionTable from "@/components/tables/RecentTransactionTable";
import { Card, CardContent } from "@/components/ui/card";

const RecentTransactionCard = () => {
  return (
    <Card className="card h-full border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
          <h6 className="mb-0 font-bold text-lg">Recent Transaction</h6>
          <CommonLink />
        </div>
        <RecentTransactionTable />
      </CardContent>
    </Card>
  );
};

export default RecentTransactionCard;
