import RevenueStatisticAreaChart from "@/components/charts/RevenueStatisticAreaChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const RevenueStatisticCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">

                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="font-bold text-lg mb-0">Earning Statistic</h6>
                    <CustomSelect
                        placeholder="Monthly"
                        options={["Monthly", "Weekly", "Yearly",]}
                    />
                </div>

                <ul className="flex flex-wrap items-center justify-center my-3 gap-6">
                    <li className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="w-[8px] h-[8px] rounded-[50rem] bg-blue-500"></span>
                            <span className="text-neutral-600 text-sm dark:text-neutral-100 font-semibold">Income </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <h6 className="mb-0">$26,201</h6>
                            <span className="text-green-500 flex items-center gap-1 text-sm font-bolder">
                                10%
                                <ArrowUp width={12} />
                            </span>
                        </div>
                    </li>
                    <li className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="w-[8px] h-[8px] rounded-[50rem] bg-purple-600"></span>
                            <span className="text-neutral-600 text-sm dark:text-neutral-100 font-semibold">Loss </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <h6 className="mb-0">$18,120</h6>
                            <span className="text-red-600 flex items-center gap-1 text-sm font-bolder">
                                10%
                                <ArrowDown width={12} />
                            </span>
                        </div>
                    </li>
                </ul>

                <div className="-m-4">
                    <RevenueStatisticAreaChart
                        series={[
                            { name: "Revenue", data: [6, 20, 15, 48, 28, 55, 28, 52, 25, 32, 15, 25] },
                            { name: "Profit", data: [0, 8, 4, 36, 16, 42, 16, 40, 12, 24, 4, 12] },
                        ]}
                        color1="#CD20F9"
                        color2="#6593FF"
                        height={200}
                    />
                </div>

            </CardContent>
        </Card>
    );
};

export default RevenueStatisticCard;