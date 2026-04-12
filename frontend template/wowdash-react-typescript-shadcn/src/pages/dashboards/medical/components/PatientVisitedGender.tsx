import DoubleBarChartSevenSeries from "@/components/charts/DoubleBarChartSevenSeries";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const PatientVisitedGender = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Patient Visited by Gender</h6>
                            <CustomSelect
                                placeholder="This Month"
                                options={["This Month", "This Week", "This Year",]}
                            />
                        </div>
                    </div>
                    <div className="card-body py-4 px-6">
                        <ul className="flex flex-wrap items-center justify-center my-3 gap-3">
                            <li className="flex items-center gap-2">
                                <span className="w-3 h-2 rounded-[50rem] bg-yellow-500"></span>
                                <span className="text-gray-600 dark:text-neutral-200 text-sm font-semibold">
                                    Male:
                                    <span className="text-gray-900 dark:text-white font-bold">200</span>
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-3 h-2 rounded-[50rem] bg-green-500"></span>
                                <span className="text-gray-600 dark:text-neutral-200 text-sm font-semibold">
                                    Female:
                                    <span className="text-gray-900 dark:text-white font-bold"> 450</span>
                                </span>
                            </li>
                        </ul>
                        <div className="y-value-left -m-4">
                            <DoubleBarChartSevenSeries chartHeight={236} colorOne="45b369" colorTwo="FF9F29" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatientVisitedGender;