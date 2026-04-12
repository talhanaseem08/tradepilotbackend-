import DoubleBarChart from "@/components/charts/DoubleBarChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const GenerateContentCard = () => {
    return (
        <Card className="card">
            <CardContent className="px-0">
                <div className="flex flex-wrap items-center justify-between">
                    <h6 className="mb-0 font-semibold text-lg">Generated Content </h6>
                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>
                <ul className="flex flex-wrap items-center mt-4 gap-3">
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Word:
                            <span className="text-neutral-600 dark:text-neutral-100 font-bold">400</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Image:
                            <span className="text-neutral-600 dark:text-neutral-100 font-bold">300</span>
                        </span>
                    </li>
                </ul>

                <div className="mt-4">
                    <div className="-m-4 -mt-0">
                        <DoubleBarChart chartHeight={264} colorOne="487FFF" colorTwo="FF9F29" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GenerateContentCard;