import TicketIcon1 from "@/assets/images/home-nine/ticket1.png";
import TicketIcon2 from "@/assets/images/home-nine/ticket2.png";
import TicketIcon3 from "@/assets/images/home-nine/ticket3.png";
import DonutThreeSeriesChart from "@/components/charts/DonutThreeSeriesChart";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card, CardContent } from "@/components/ui/card";

const SupportTrackerCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="font-bold text-lg mb-0">Support Tracker</h6>
                    <CustomSelect
                        placeholder="Monthly"
                        options={["Monthly", "Weekly", "Yearly",]}
                    />
                </div>

                <div className="mt-8 flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-blue-100 dark:bg-primary/20 shrink-0">
                                <img src={TicketIcon1} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-bold">172</h6>
                                <span className="text-sm text-neutral-600 dark:text-neutral-200 font-normal">New Tickets </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-yellow-100 dark:bg-yellow-600/20 shrink-0">
                                <img src={TicketIcon2} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-bold">172</h6>
                                <span className="text-sm text-neutral-600 dark:text-neutral-200 font-normal">Open Tickets</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-violet-100 dark:bg-violet-600/20 shrink-0">
                                <img src={TicketIcon3} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-bold">172</h6>
                                <span className="text-sm text-neutral-600 dark:text-neutral-200 font-normal">Response Time</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* <SupportTrackerChart /> */}
                        <DonutThreeSeriesChart chartColors = {["#F59E0B", "#3B82F6", "#45b369"]} />
                        <div className="text-center max-w-[135px] max-h-[135px] bg-yellow-500/15 rounded-[50%] p-4 aspect-ratio-1 flex flex-col justify-center items-center absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[1] rtl:translate-x-1/2">
                            <h6 className="font-bold">120</h6>
                            <span className="text-neutral-600 dark:text-neutral-200">Total Tickets</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default SupportTrackerCard;