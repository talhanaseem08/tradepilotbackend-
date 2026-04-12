import CommonLink from "@/components/shared/CommonLink";
import CoursesTable from "@/components/tables/CoursesTable";
import { Card, CardContent } from "@/components/ui/card";

const CoursesCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Courses</h6>
                            <CommonLink />
                        </div>
                    </div>
                    <div className="card-body p-6">
                        <CoursesTable />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoursesCard;