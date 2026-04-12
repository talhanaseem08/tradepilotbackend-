import CandlestickChart from '@/components/charts/CandlestickChart';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUp } from 'lucide-react';

const CoinAnalyticsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0">
            <CardContent className="card-body p-0">
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="mb-0 font-bold text-lg">Coin Analytics</h6>

                    <RadioGroup defaultValue="BTC" className='flex items-center gap-4'>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="BTC" id="BTC" className='border border-primary' />
                            <Label htmlFor="BTC">BTC</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ETH" id="ETH" className='border border-primary' />
                            <Label htmlFor="ETH"> ETH</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="SOL" id="SOL" className='border border-primary' />
                            <Label htmlFor="SOL">SOL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="LTE" id="LTE" className='border border-primary' />
                            <Label htmlFor="LTE">LTE</Label>
                        </div>
                    </RadioGroup>

                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <h6 className="font-semibold mb-0">$25,000</h6>
                    <p className="text-sm mb-0 flex items-center gap-1">
                        Bitcoin (BTC)
                        <span className="bg-green-100 dark:bg-green-600/25 border border-green-600/25 px-2.5 py-1 rounded-full font-semibold text-green-600 dark:text-green-500 text-sm inline-flex items-center gap-1">
                            10%
                            <ArrowUp className="w-3 h-3" />
                        </span>
                    </p>
                </div>

                <CandlestickChart chartHeight={350} />

            </CardContent>
        </Card>
    );
};

export default CoinAnalyticsCard;