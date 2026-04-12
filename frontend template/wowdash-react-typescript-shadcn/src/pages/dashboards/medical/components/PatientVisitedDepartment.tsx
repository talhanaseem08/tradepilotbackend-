import RadialBarChart from "@/components/charts/RadialBarChart";
import { Card, CardContent } from "@/components/ui/card";

const PatientVisitedDepartment = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Patient Visited by Department</h6>
                        </div>
                    </div>
                    <div className="card-body py-4 px-6 flex items-center gap-4">
                        <div className="-m-4">
                            <RadialBarChart chartHeight={300} />
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <span className="text-lg">Cardiology: <span className="text-primary dark:text-primary font-semibold">80%</span> </span>
                            </li>
                            <li>
                                <span className="text-lg">Psychiatry: <span className="text-yellow-500 dark:text-yellow-500 font-semibold">40%</span> </span>
                            </li>
                            <li>
                                <span className="text-lg">Pediatrics: <span className="text-green-500 dark:text-green-500 font-semibold">10%</span> </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatientVisitedDepartment;