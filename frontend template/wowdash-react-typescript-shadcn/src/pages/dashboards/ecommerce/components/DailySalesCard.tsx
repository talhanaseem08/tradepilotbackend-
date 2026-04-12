import AreaChartBigChart from '@/components/charts/AreaChartBigChart';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp } from 'lucide-react';

const DailySalesCard = () => {
    return (
        <Card className="card h-full border-0 rounded-lg">
            <CardContent className="card-body p-0">
                <h6 className="mb-3 font-bold text-lg">Daily Sales</h6>
                <div className="flex items-center gap-2">
                    <h6 className="font-semibold mb-0">$27,200</h6>
                    <p className="text-sm mb-0">
                        <span className="bg-green-600/25 border border-green-600/25 px-2 py-1 rounded-full font-semibold text-green-600 dark:text-green-400 text-sm inline-flex items-center gap-1">
                            10%
                            <ArrowUp className='w-3 h-3' />
                        </span> 
                       {" "} Increases 
                    </p>
                </div>

                <div className="mt-7">
                    <AreaChartBigChart chartHeight={370} chartColor="#487fff" />
                </div>

            </CardContent>
        </Card>
    );
};

export default DailySalesCard;