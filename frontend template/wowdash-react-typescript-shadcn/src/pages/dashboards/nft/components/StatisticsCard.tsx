import BarLightChart from "@/components/charts/BarLightChart";
import SmallAreaChartTwo from "@/components/charts/SmallAreaChartTwo";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

const StatisticsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Statistics</h6>
                            <CommonLink />
                        </div>
                    </div>
                    <div className="card-body py-4 px-6">
                        <div className="flex items-center gap-1 justify-between mb-[44px]">
                            <div>
                                <h5 className="font-semibold mb-3">145</h5>
                                <span className="text-neutral-500 dark:text-neutral-300 font-normal text-xl">Total Art Sold</span>
                            </div>
                            <div className="x-axies-value-none h-[110px]">
                                <BarLightChart chartHeight={135} chartWidth={'180'} chartBorderRadius={6} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 justify-between">
                            <div>
                                <h5 className="font-semibold mb-3">750 ETH</h5>
                                <span className="text-neutral-500 dark:text-neutral-300 font-normal text-xl">Total Earnings</span>
                            </div>
                            <div className="remove-tooltip-title rounded-tooltip-value remove-tooltip-marker">
                                <SmallAreaChartTwo chartWidth={164} chartHeight={100} chartColor={"#ff9f29"} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticsCard;