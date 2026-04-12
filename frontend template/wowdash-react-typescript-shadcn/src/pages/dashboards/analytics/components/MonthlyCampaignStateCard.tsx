import SocialIcon1 from "@/assets/images/home-nine/socials1.png";
import SocialIcon2 from "@/assets/images/home-nine/socials2.png";
import SocialIcon3 from "@/assets/images/home-nine/socials3.png";
import SocialIcon4 from "@/assets/images/home-nine/socials4.png";
import SocialIcon5 from "@/assets/images/home-nine/socials5.png";
import { Card, CardContent } from "@/components/ui/card";

const MonthlyCampaignStateCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full">
                <div className="">
                    <h6 className="font-bold text-lg mb-2">Monthly Campaign State</h6>
                    <span className="text-neutral-600 dark:text-neutral-200">7.2k Social visitors</span>
                </div>

                <div className="flex flex-col gap-[22px] mt-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-purple-100 dark:bg-purple-600/20 shrink-0">
                                <img src={SocialIcon1} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Email</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">6,200</span>
                            <span className="text-green-500 text-base font-medium">0.3%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-yellow-100 dark:bg-yellow-600/20 shrink-0">
                                <img src={SocialIcon2} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Clicked</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">Clicked</span>
                            <span className="text-red-600 text-base font-medium">1.3%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-blue-100 dark:bg-primary/20 shrink-0">
                                <img src={SocialIcon3} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Subscribe</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">5,175</span>
                            <span className="text-green-500 text-base font-medium">0.3%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-green-100 dark:bg-green-500/20 shrink-0">
                                <img src={SocialIcon4} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Complaints </h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">3,780</span>
                            <span className="text-green-500 text-base font-medium">0.3%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-danger-100 dark:bg-red-600/20 shrink-0">
                                <img src={SocialIcon5} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Unsubscribe</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">4,120</span>
                            <span className="text-green-500 text-base font-medium">0.3%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[40px] h-[40px] rounded-[50%] flex justify-center items-center bg-blue-100 dark:bg-primary/20 shrink-0">
                                <img src={SocialIcon3} alt="Icon" className="" />
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="text-base mb-0 font-semibold">Subscribe</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-600 dark:text-neutral-200 text-base font-medium">5,175</span>
                            <span className="text-green-500 text-base font-medium">0.3%</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default MonthlyCampaignStateCard;