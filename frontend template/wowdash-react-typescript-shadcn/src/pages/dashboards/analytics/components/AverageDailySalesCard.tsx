import BarLightChart from "@/components/charts/BarLightChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const AverageDailySalesCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="font-bold text-lg mb-0">Average Daily Sales</h6>
                    <CustomSelect
                        placeholder="Monthly"
                        options={["Monthly", "Weekly", "Yearly",]}
                    />
                </div>

                <h6 className="text-center my-4">$27,500.00</h6>
                <BarLightChart chartHeight={235} chartBorderRadius={6} /> 

            </CardContent>
        </Card>
    );
};

export default AverageDailySalesCard;