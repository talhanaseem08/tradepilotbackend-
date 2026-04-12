import LineChartOneSeries from "@/components/charts/LineChartOneSeries";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const TotalTransactionsCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
          <h6 className="mb-0 font-bold text-lg">Total Transactions</h6>

          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <ul className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-blue-500"></span>
            <span className="text-neutral-600 dark:text-neutral-300 text-lg font-normal">
              Total Gain:
              <span className="text-neutral-600 dark:text-neutral-200 font-bold text-lg">
                $50,000
              </span>
            </span>
          </li>
        </ul>

        <div className="-m-4">
          <LineChartOneSeries chartHeight={290} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalTransactionsCard;
