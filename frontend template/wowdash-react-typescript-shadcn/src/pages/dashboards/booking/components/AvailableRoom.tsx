import homeIcon from "@/assets/images/home-twelve/icons/home.png";
import { Card } from "@/components/ui/card";
import SemiCircleGauge from "@/pages/chart/circle-chart/SemiCircleGauge";

const AvailableRoom = () => {
    return (
        <Card className="card p-6 rounded-xl bg-white dark:bg-[#273142] h-full">
            <div className="text-center">
                <div className="relative">
                    <div className="big-semi-circle-gauge flex justify-center">
                        <SemiCircleGauge />
                    </div>
                    <span
                        className="w-[90px] h-[90px] rounded-[50%] bg-primary-50 flex justify-center items-center absolute start-[50%] bottom-0 translate-x-[-50%] rtl:translate-x-[50%]">
                        <img src={homeIcon} alt="Home Icon" />
                    </span>
                </div>
                <h3 className="mt-10 mb-0 leading-none">35</h3>
                <span className="text-neutral-800 dark:text-neutral-300 mt-4">Available Room Today</span>
            </div>
        </Card>
    );
};

export default AvailableRoom;