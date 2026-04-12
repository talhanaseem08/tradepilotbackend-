import CountryList from '@/components/shared/CountryList';
import CustomSelect from '@/components/shared/CustomSelect';
import WorldMap from '@/components/shared/WorldMap';
import { Card, CardContent } from '@/components/ui/card';

const DistributionMapsCard = () => {
    return (
      <Card className="card h-full rounded-lg border-0 !p-0">
        <CardContent className="card-body p-0">
            <div className="flex items-center flex-wrap gap-2 justify-between p-6">
                <h6 className="mb-0 font-bold text-lg">Distribution Maps</h6>
                <CustomSelect
                  placeholder="Yearly"
                  options={["Yearly", "Monthly", "Weekly", "Today"]}
                />
            </div>

            <div className="bg-neutral-100 dark:bg-slate-700/50 h-[160px] overflow-hidden">
              <WorldMap />
            </div> 

            <div className="max-h-[294px] overflow-y-auto p-6 scrollbar-thin">
              <CountryList />
            </div>
          
        </CardContent>
    </Card>
    );
};

export default DistributionMapsCard;