import DoubleBarChartSevenSeries from "@/components/charts/DoubleBarChartSevenSeries";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

const CourseActivityCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Course Activity</h6>
                            <CommonLink />
                        </div>
                    </div>
                    <div className="card-body p-6">
                        <ul className="flex flex-wrap items-center justify-center my-3 gap-3">
                            <li className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full
                             bg-yellow-500"></span>
                                <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Paid Course:
                                    <span className="text-neutral-500 dark:text-neutral-200 font-bold">500</span>
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full
                             bg-green-600"></span>
                                <span className="text-neutral-600 dark:text-neutral-100 text-sm font-semibold">Free Course:
                                    <span className="text-neutral-500 dark:text-neutral-200 font-bold">300</span>
                                </span>
                            </li>
                        </ul>
                        <div className="-m-4 y-value-left">
                            <DoubleBarChartSevenSeries chartHeight={390} colorOne="45b369" colorTwo="FF9F29" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseActivityCard;