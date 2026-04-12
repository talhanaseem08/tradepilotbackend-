import DonutTwoSeriesChart from "@/components/charts/DonutTwoSeriesChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const UsersActivateCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <h6 className="mb-0 font-bold text-lg">User Activates</h6>
          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <div className="relative">
          <span className="w-[80px] h-[80px] bg-white dark:bg-slate-700 shadow-lg text-neutral-600 dark:text-neutral-200 font-semibold text-xl flex justify-center items-center rounded-full absolute end-0 top-0 z-1 me-[130px] mt-6">
            +30%
          </span>
          <div className="mt-9 grow apexcharts-tooltip-z-none title-style circle-none">
            <DonutTwoSeriesChart onChartHeight={360} />
          </div>
          <span className="w-[80px] h-[80px] bg-white dark:bg-slate-700 shadow-lg text-neutral-600 dark:text-neutral-200 font-semibold text-xl flex justify-center items-center rounded-full absolute start-0 bottom-0 z-1 mb-6 ms-[130px]">
            +25%
          </span>
        </div>

        <ul className="flex flex-wrap items-center justify-between mt-8 gap-3">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-blue-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-normal">
              Visits By Day:
              <span className="text-neutral-600 dark:text-neutral-200 font-bold">
                20,000
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-yellow-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-normal">
              Referral Join:
              <span className="text-neutral-600 dark:text-neutral-200 font-bold">
                25,000
              </span>
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default UsersActivateCard;
