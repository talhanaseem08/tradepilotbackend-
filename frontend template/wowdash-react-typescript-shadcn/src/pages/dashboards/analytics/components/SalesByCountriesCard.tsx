import CountryList from "@/components/shared/CountryList";
import CustomSelect from "@/components/shared/CustomSelect";
import WorldMap from "@/components/shared/WorldMap";
import { Card, CardContent } from "@/components/ui/card";

const SalesByCountriesCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">

                <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                    <h6 className="font-bold text-lg mb-0">Sales by Countries</h6>
                    <CustomSelect
                        placeholder="Monthly"
                        options={["Monthly", "Weekly", "Yearly",]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-6">
                        <div className="border border-neutral-300 dark:border-neutral-300/20 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-600/20 h-full">
                            <WorldMap />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <div className="border border-neutral-300 dark:border-neutral-300/20 rounded-lg bg-neutral-50 dark:bg-neutral-600/20 h-full max-h-[266px] overflow-y-auto p-6 scrollbar-thin">
                            <CountryList />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default SalesByCountriesCard;