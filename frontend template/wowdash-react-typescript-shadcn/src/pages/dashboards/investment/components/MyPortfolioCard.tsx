import DonutTwoSeriesChart from "@/components/charts/DonutTwoSeriesChart";
import { Card, CardContent } from "@/components/ui/card";

const MyPortfolioCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <h6 className="mb-0 font-bold text-lg">My Portfolio</h6>
        </div>

        <div className="relative">
          <span className="w-[80px] h-[80px] bg-white dark:bg-slate-700 shadow-lg text-neutral-600 dark:text-neutral-200 font-semibold text-xl flex justify-center items-center rounded-full absolute end-0 top-0 z-1 me-11 mt-6">
            20k
          </span>
          <div className="mt-9 grow apexcharts-tooltip-z-none title-style circle-none">
            <DonutTwoSeriesChart />
          </div>
          <span className="w-[80px] h-[80px] bg-white dark:bg-slate-700 shadow-lg text-neutral-600 dark:text-neutral-200 font-semibold text-xl flex justify-center items-center rounded-full absolute start-0 bottom-0 z-1 mb-6 ms-14">
            50k
          </span>
        </div>

        <ul className="flex flex-wrap flex-col mt-[80px] gap-3">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-blue-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-lg font-normal">
              Total Gain:
              <span className="text-neutral-600 dark:text-neutral-200 font-bold text-lg">
                $50,000
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-yellow-500"></span>
            <span className="text-neutral-500 dark:text-neutral-300 text-lg font-normal">
              Total Investment:
              <span className="text-neutral-600 dark:text-neutral-200 font-bold text-lg">
                $20,000
              </span>
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default MyPortfolioCard;
