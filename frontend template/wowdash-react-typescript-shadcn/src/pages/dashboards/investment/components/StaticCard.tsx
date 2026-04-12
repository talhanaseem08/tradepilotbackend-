
import BarLightChart from "@/components/charts/BarLightChart";
import RadialHalfChart from "@/components/charts/RadialHalfChart";
import SmallAreaChartTwo from "@/components/charts/SmallAreaChartTwo";
import { Card, CardContent } from "@/components/ui/card";
import { Smile } from "lucide-react";

const StaticCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <h6 className="mb-2 font-bold text-lg">Statistic</h6>

        <div className="mt-6 space-y-14">
          <div className="flex items-center gap-1 justify-between overflow-hidden">
            <div>
              <span className="text-neutral-500 dark:text-neutral-300 font-normal mb-3 text-xl">
                Daily Conversions
              </span>
              <h5 className="font-semibold mb-0">%60</h5>
            </div>
            <div className="relative h-[110px] w-[80px] flex items-center justify-center">
              <RadialHalfChart chartHeight={165} chartWidth={120} />
              <span className="w-9 h-9 text-primary mb-0 rounded-full bg-primary/20 flex justify-center items-center absolute start-[12%] bottom-[40px]">
                <Smile className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-between">
            <div>
              <span className="text-neutral-500 dark:text-neutral-300 font-normal mb-3 text-xl">
                Visits By Day
              </span>
              <h5 className="font-semibold mb-0">20k</h5>
            </div>
            <div className="remove-tooltip-title rounded-tooltip-value remove-tooltip-marker">
              <div className="-mt-[30px]">
                <SmallAreaChartTwo chartWidth={164} chartHeight={100} chartColor={"#ff9f29"} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-between">
            <div>
              <span className="text-neutral-500 dark:text-neutral-300 font-normal mb-3 text-xl">
                Today Income
              </span>
              <h5 className="font-semibold mb-0">$5.5k</h5>
            </div>
            <div className="x-axies-value-none">
              <BarLightChart chartHeight={135} chartWidth={'180'} chartBorderRadius={6} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaticCard;
