import UpdownBarChart from "@/components/charts/UpdownBarChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const RevenueStatisticsCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <div>
            <h6 className="mb-2 font-bold text-lg">Revenue Statistics</h6>
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
              Yearly earning overview
            </span>
          </div>
          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <div className="mt-6 mb-1 flex flex-wrap">
          <div className="me-10">
            <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-1">Income</span>
            <div className="flex items-center gap-1">
              <h6 className="font-semibold inline-block mb-0">$26,201</h6>
              <span className="!text-green-600 font-bold inline-flex items-center gap-1">
                {" "}
                10% <ArrowUp className="w-4 h-4" />{" "}
              </span>
            </div>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-1">Expenses</span>
            <div className="flex items-center gap-1">
              <h6 className="font-semibold inline-block mb-0">$18,120</h6>
              <span className="!text-red-600 font-bold inline-flex items-center gap-1">
                {" "}
                10% <ArrowDown className="w-4 h-4" />{" "}
              </span>
            </div>
          </div>
        </div>

        <UpdownBarChart chartHeight={310} />
      </CardContent>
    </Card>
  );
};

export default RevenueStatisticsCard;
