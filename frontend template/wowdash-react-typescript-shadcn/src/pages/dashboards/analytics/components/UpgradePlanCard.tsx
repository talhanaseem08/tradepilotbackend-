import TrailBgImage from "@/assets/images/home-nine/trail-bg.png";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import StatCards from "./StatCards";

const UpgradePlanCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                    <div className="col-span-12 md:col-span-4">
                        <div className="trail-bg h-full text-center flex flex-col justify-between items-center p-4 rounded-lg bg-cover bg-no-repeat bg-center"
                            style={{ backgroundImage: `url(${TrailBgImage})` }}
                        >
                            <h6 className="text-white text-xl">Upgrade Your Plan</h6>
                            <div className="">
                                <p className="text-white mb-4">Your free trial expired in 7 days</p>
                                <Link
                                    to="#"
                                    className="w-full py-2 px-6 rounded-[50rem] bg-gradient-to-r from-[#CBFFF9] to-[#FFEEB1] text-sm justify-center dark:text-neutral-900 transform transition-transform duration-300 hover:scale-105 inline-flex items-center justify-center"
                                >
                                    Upgrade Now
                                </Link>

                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-8">
                        <StatCards />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UpgradePlanCard;