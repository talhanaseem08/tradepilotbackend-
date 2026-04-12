import CustomSelect from '@/components/shared/CustomSelect';
import MyOrderTable from '@/components/tables/MyOrderTable';
import { Card, CardContent } from '@/components/ui/card';

const MyOrderCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                    <h6 className="mb-0 font-bold text-lg">My Orders</h6>
                    
                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>

                <MyOrderTable />
            
            </CardContent>
        </Card>
    );
};

export default MyOrderCard;