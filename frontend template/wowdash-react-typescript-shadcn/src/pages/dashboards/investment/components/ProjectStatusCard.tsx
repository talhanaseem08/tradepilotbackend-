import CustomSelect from "@/components/shared/CustomSelect";
import ProjectStatusTable from "@/components/tables/ProjectStatusTable";
import { Card, CardContent } from "@/components/ui/card";

const ProjectStatusCard = () => {
  return (
    <Card className="card h-full rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
          <h6 className="mb-0 font-bold text-lg">Project Status</h6>

          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <ProjectStatusTable />
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
