import DoubleLineChart from "@/components/charts/DoubleLineChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const IncomeExpenseCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">

                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="font-bold text-lg mb-0">Income Vs Expense</h6>
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
                            <span className="w-[8px] h-[8px] rounded-[50rem] bg-yellow-500"></span>
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

                <div className="">
                    <DoubleLineChart colors={["#487FFF", "#FF9F29"]} />
                </div>

            </CardContent>
        </Card>
    );
};

export default IncomeExpenseCard;