import spentIcon1 from '@/assets/images/home-twelve/icons/spen-icon1.png';
import spentIcon2 from '@/assets/images/home-twelve/icons/spen-icon2.png';
import spentIcon3 from '@/assets/images/home-twelve/icons/spen-icon3.png';
import spentIcon4 from '@/assets/images/home-twelve/icons/spen-icon4.png';
import CustomSelect from '@/components/shared/CustomSelect';
import { Card, CardContent } from '@/components/ui/card';
import RadialProgressBarSmall from './RadialProgressSmall';

const SpendOverview = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-6">
                <div className="flex items-center flex-wrap gap-2 justify-between pb-6">
                    <h6 className="mb-0 font-bold text-lg">Spend Overview</h6>
                    <CustomSelect
                        placeholder="Yearly"
                        options={["Yearly", "Monthly", "Weekly", "Today"]}
                    />
                </div>

                <div className="flex flex-col gap-2.5">

                    <div className="flex items-center justify-between gap-10">
                        <div className="flex items-center gap-3">
                            <span
                                className="w-10 h-10 rounded-[50%] flex justify-center items-center dark:bg-slate-800 bg-[#E8EDFB]">
                                <img src={spentIcon1} alt="Icon" />
                            </span>
                            <div className="">
                                <h6 className="text-sm mb-2">Flights</h6>
                                <span className="text-xs text-neutral-600 dark:text-neutral-300">$70,570</span>
                            </div>
                        </div>
                        <div className="">
                            <span className="text-[#0a0a0a] dark:text-white text-sm block text-end">
                                <RadialProgressBarSmall percentage={20} color="#1e90ff" size={48} textColor="#1e90ff" strokeWidth={4} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-10">
                        <div className="flex items-center gap-3">
                            <span
                                className="w-10 h-10 rounded-[50%] flex justify-center items-center dark:bg-slate-800 bg-[#FDE4EA]">
                                <img src={spentIcon2} alt="Icon" />
                            </span>
                            <div className="">
                                <h6 className="text-sm mb-2">Hotels</h6>
                                <span className="text-xs text-neutral-600 dark:text-neutral-300">$85,570</span>
                            </div>
                        </div>
                        <div className="">
                            <span className="text-[#0a0a0a] dark:text-white text-sm block text-end">
                               <RadialProgressBarSmall percentage={20} color="#ef4a00" size={48} textColor="#ef4a00" strokeWidth={4} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-10">
                        <div className="flex items-center gap-3">
                            <span
                                className="w-10 h-10 rounded-[50%] flex justify-center items-center dark:bg-slate-800 bg-[#FDE4EA]">
                                <img src={spentIcon3} alt="Icon" />
                            </span>
                            <div className="">
                                <h6 className="text-sm mb-2">Trains</h6>
                                <span className="text-xs text-neutral-600 dark:text-neutral-300">$15,000</span>
                            </div>
                        </div>
                        <div className="">
                            <span className="text-[#0a0a0a] dark:text-white text-sm block text-end">
                               <RadialProgressBarSmall percentage={20} color="#ff9f29" size={48} textColor="#ff9f29" strokeWidth={4} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-10">
                        <div className="flex items-center gap-3">
                            <span
                                className="w-10 h-10 rounded-[50%] flex justify-center items-center dark:bg-slate-800 bg-[#E3F4E9]">
                                <img src={spentIcon4} alt="Icon" />
                            </span>
                            <div className="">
                                <h6 className="text-sm mb-2">Cars</h6>
                                <span className="text-xs text-neutral-600 dark:text-neutral-300">$90,000</span>
                            </div>
                        </div>
                        <div className="">
                            <span className="text-[#0a0a0a] dark:text-white text-sm block text-end">
                               <RadialProgressBarSmall percentage={20} color="#45b369" size={48} textColor="#45b369" strokeWidth={4} />
                            </span>
                        </div>
                    </div>

                </div>

            </CardContent>
        </Card>
    );
};

export default SpendOverview;