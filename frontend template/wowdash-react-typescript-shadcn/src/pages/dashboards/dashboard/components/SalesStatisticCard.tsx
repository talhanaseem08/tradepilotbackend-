import SalesStaticChart from "@/components/charts/SalesStaticChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";

const SalesStatisticCard = () => {
  return (
    <Card className="card">
      <CardContent className="px-0">
        <div className="flex flex-wrap items-center justify-between">
          <h6 className="mb-0 font-semibold text-lg">Sales Statistic</h6>
          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <h6 className="mb-0">$27,200</h6>
          <span className="text-sm font-semibold rounded-full bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-600/50 px-2 py-1.5 flex items-center gap-1">
            10% <ArrowUp width={14} height={14} />
          </span>
          <span className="text-xs font-medium">+ $1400 Per Day</span>
        </div>

        <div className="apexcharts-tooltip-style-1 mt-7">
          <SalesStaticChart chartHeight={254} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesStatisticCard;
