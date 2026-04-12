import CountryList from "@/components/shared/CountryList";
import CustomSelect from "@/components/shared/CustomSelect";
import WorldMap from "@/components/shared/WorldMap";
import { Card, CardContent } from "@/components/ui/card";

const TopCountriesCard = () => {
  return (
    <Card className="card">
      <CardContent className="px-0">
        <div className="flex flex-wrap items-center justify-between">
          <h6 className="mb-0 font-semibold text-lg">Top Countries</h6>
          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
          <div className="h-full border border-neutral-200 dark:border-neutral-600 rounded-lg overflow-hidden">
            <WorldMap />
          </div>

          <div className="h-full border border-neutral-200 dark:border-neutral-600 p-4 pe-0 rounded-lg">
            <div className="max-h-[266px] overflow-y-auto pe-2 scrollbar-thin">
              <CountryList />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCountriesCard;
