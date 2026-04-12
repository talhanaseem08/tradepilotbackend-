import AreaSharpChart from "@/components/charts/AreaSharpChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const EthPriceCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">ETH Price</h6>
                            <CustomSelect
                                placeholder="November"
                                options={["November", "December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October"]}
                            />
                        </div>
                    </div>
                    <div className="card-body py-4 px-6">
                        <div className="apexcharts-tooltip-style-1 yaxies-more label--20-px">
                            <AreaSharpChart chartHeight={240} chartCurve={`straight`} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EthPriceCard;