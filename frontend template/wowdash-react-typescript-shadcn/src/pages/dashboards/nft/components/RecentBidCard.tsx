import CustomSelect from '@/components/shared/CustomSelect';
import RecentBidTable from '@/components/tables/RecentBidTable';
import { Card, CardContent } from '@/components/ui/card';

const RecentBidCard = () => {
    return (
        <>
            <Card className="card !p-4">
                <CardContent className="px-0">
                    <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                        <h6 className="font-bold text-lg mb-0">Recent Bid</h6>
                        <CustomSelect
                            placeholder="All Items"
                            options={["All Items", "New Item", "Trending Item", "Old Item"]}
                        />
                    </div>

                    <RecentBidTable />

                </CardContent>
            </Card>
        </>
    );
};

export default RecentBidCard;