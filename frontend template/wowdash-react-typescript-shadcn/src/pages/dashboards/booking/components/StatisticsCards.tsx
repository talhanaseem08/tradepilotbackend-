import bookingIcon1 from "@/assets/images/home-twelve/icons/booking-card-icon1.png";
import bookingIcon2 from "@/assets/images/home-twelve/icons/booking-card-icon2.png";
import bookingIcon3 from "@/assets/images/home-twelve/icons/booking-card-icon3.png";
import bookingIcon4 from "@/assets/images/home-twelve/icons/booking-card-icon4.png";
import { Card } from "@/components/ui/card";

import bookingBigIcon1 from "@/assets/images/home-twelve/icons/booking-card-big-icon1.png";
import bookingBigIcon2 from "@/assets/images/home-twelve/icons/booking-card-big-icon2.png";
import bookingBigIcon3 from "@/assets/images/home-twelve/icons/booking-card-big-icon3.png";
import bookingBigIcon4 from "@/assets/images/home-twelve/icons/booking-card-big-icon4.png";

const statisticsData = [
  {
    id: 1,
    title: "New Booking",
    value: "170",
    bg: "bg-[#A8C9F4]",
    icon: bookingIcon1,
    bigIcon: bookingBigIcon1,
  },
  {
    id: 2,
    title: "Schedule Room",
    value: "285",
    bg: "bg-[#A4E7BC]",
    icon: bookingIcon2,
    bigIcon: bookingBigIcon2,
  },
  {
    id: 3,
    title: "Total Customers",
    value: "175",
    bg: "bg-[#FFBAAA]",
    icon: bookingIcon3,
    bigIcon: bookingBigIcon3,
  },
  {
    id: 4,
    title: "Total Revenue",
    value: "$750.00",
    bg: "bg-[#FFDD96]",
    icon: bookingIcon4,
    bigIcon: bookingBigIcon4,
  },
];

const StatisticsCards = () => {
    return (
        <Card className="card rounded-xl p-4 bg-white dark:bg-[#273142]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                {statisticsData.map((item) => (
                    <div
                        key={item.id}
                        className="col-span-12 xs:col-span-6 sm:col-span-6"
                    >
                        <div
                            className={`relative h-full rounded-lg px-6 py-5 ${item.bg}`}
                        >
                            <img
                                src={item.bigIcon}
                                alt="Background Icon"
                                width={90}
                                height={90}
                                className="absolute bottom-0 right-2 opacity-60"
                            />

                            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white">
                                <img src={item.icon} alt={item.title} width={24} height={24} />
                            </span>

                            <span className="mt-3 block text-neutral-800 text-sm">
                                {item.title}
                            </span>

                            <h6 className="mt-1 text-lg font-semibold text-black">
                                {item.value}
                            </h6>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default StatisticsCards;
