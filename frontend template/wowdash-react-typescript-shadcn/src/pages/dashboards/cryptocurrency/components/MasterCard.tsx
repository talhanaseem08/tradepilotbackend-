import MasterCardSlider from "@/components/shared/MasterCardSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const MasterCard = () => {
  return (
    <Card className="card rounded-lg border-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
          <h6 className="mb-2 font-bold text-lg">My Cards</h6>
          <Button
            variant="outline"
            className={cn("w-auto h-9 px-2 py-1.5 gap-1 rounded-md text-sm")}
          >
            <Plus className="w-3 h-3" />
            Sell Now
          </Button>
        </div>

        <MasterCardSlider />
      </CardContent>
    </Card>
  );
};

export default MasterCard;
