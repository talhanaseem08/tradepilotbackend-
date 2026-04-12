import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

import radialBg1 from "@/assets/images/home-eleven/bg/radial-bg1.png";
import radialBg2 from "@/assets/images/home-eleven/bg/radial-bg2.png";
import radialBg3 from "@/assets/images/home-eleven/bg/radial-bg3.png";

const InvestmentCard: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-3 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Expense Statistics</h6>
                            <CustomSelect
                                placeholder="Yearly"
                                options={["Yearly", "Monthly", "Weekly", "Today"]}
                            />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="p-6">
                        <div className="">
                            <p className="text-center text-neutral-600 dark:text-neutral-300 flex items-center gap-2 justify-center">Total Investment: <span className="font-semibold text-neutral-600 dark:text-neutral-300">$500</span> </p>

                            <div className="mt-10 mb-6 text-center pe-[110px] relative max-w-[282px] mx-auto">
                                <div className="w-[170px] h-[170px] rounded-full z-[1] relative inline-flex justify-center items-center border border-white border-width-2-px">
                                    <img src={radialBg1} alt="Image" className="absolute top-0 start-0 -z-[1] w-full h-full object-cover" />
                                    <h5 className="text-white"> 60% </h5>
                                </div>
                                <div className="w-[144px] h-[144px] rounded-full z-[1] inline-flex justify-center items-center border border-white border-width-3-px absolute top-0 end-0 -mt-9">
                                    <img src={radialBg2} alt="Image" className="absolute top-0 start-0 -z-[1] w-full h-full object-cover" />
                                    <h5 className="text-white"> 30% </h5>
                                </div>
                                <div className="w-[110px] h-[110px] rounded-full z-[1] inline-flex justify-center items-center border border-white border-width-3-px absolute bottom-0 start-[50%] translate-x-[-50%] ms-12">
                                    <img src={radialBg3} alt="Image" className="absolute top-0 start-0 -z-[1] w-full h-full object-cover" />
                                    <h5 className="text-white"> 10% </h5>
                                </div>
                            </div>

                            <div className="flex items-center flex-wrap gap-2 justify-between">
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-[50rem] bg-blue-600"></span>
                                        <span className="text-neutral-600 dark:text-neutral-300 text-sm font-normal">Net Income</span>
                                    </div>
                                    <h6 className="text-neutral-600 dark:text-neutral-300 font-semibold mb-0 mt-1.5 text-lg">$50,000</h6>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-[50rem] bg-purple-600"></span>
                                        <span className="text-neutral-600 dark:text-neutral-300 text-sm font-normal">Real State</span>
                                    </div>
                                    <h6 className="text-neutral-600 dark:text-neutral-300 font-semibold mb-0 mt-1.5 text-lg">$150</h6>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-[50rem] bg-green-600"></span>
                                        <span className="text-neutral-600 dark:text-neutral-300 text-sm font-normal">Business</span>
                                    </div>
                                    <h6 className="text-neutral-600 dark:text-neutral-300 font-semibold mb-0 mt-1.5 text-lg">$100</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvestmentCard;
