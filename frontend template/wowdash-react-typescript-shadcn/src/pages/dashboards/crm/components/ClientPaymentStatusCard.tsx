import TripleBarChart from '@/components/charts/TripleBarChart';
import { Card, CardContent } from '@/components/ui/card';

const ClientPaymentStatusCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <h6 className="mb-4 font-bold text-lg">Client Payment Status</h6>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-300">Weekly Report</span>

        <ul className="flex flex-wrap items-center justify-center mt-8">
          <li className="flex items-center gap-2 me-7">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">Paid: 400</span>
          </li>
          <li className="flex items-center gap-2 me-7">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">Pending: 400</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">Overdue: 1400</span>
          </li>
        </ul>
        <div className="mt-8 -m-4">
          <TripleBarChart chartHeight={370} colorOne="45B369" colorTwo="144bd6" colorThree="FF9F29" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientPaymentStatusCard;