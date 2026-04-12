

import { ShoppingCart, SwitchCamera, Tag, Users, type LucideIcon } from "lucide-react";

interface StatCardData {
    id: number;
    title: string;
    value: string;
    icon: LucideIcon;
    bgColor: string;
    iconBg: string;
    textColor: string;
}

const cardsData: StatCardData[] = [
    {
        id: 1,
        title: "Total Sales",
        value: "$170,500.09",
        icon: Tag,
        bgColor: "bg-violet-100 dark:bg-violet-500/10",
        iconBg: "bg-violet-200 dark:bg-violet-500/20 border border-violet-400",
        textColor: "text-violet-500",
    },
    {
        id: 2,
        title: "Total Orders",
        value: "1,500",
        icon: ShoppingCart,
        bgColor: "bg-green-100 dark:bg-green-500/10",
        iconBg: "bg-green-200 dark:bg-green-500/20 border border-green-400",
        textColor: "text-green-500",
    },
    {
        id: 3,
        title: "Visitor",
        value: "12,300",
        icon: Users,
        bgColor: "bg-blue-100 dark:bg-blue-500/10",
        iconBg: "bg-blue-200 dark:bg-blue-500/20 border border-blue-400",
        textColor: "text-blue-500",
    },
    {
        id: 4,
        title: "Refunded",
        value: "2,756",
        icon: SwitchCamera,
        bgColor: "bg-red-100 dark:bg-red-500/10",
        iconBg: "bg-red-200 dark:bg-red-500/20 border border-red-400",
        textColor: "text-red-500",
    },
];

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {cardsData.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.id} className="col-span-12 sm:col-span-6">
                        <div className={`rounded-lg h-full text-center p-5 ${card.bgColor}`}>
                            <span
                                className={`w-[44px] h-[44px] rounded-lg inline-flex justify-center items-center text-xl mb-3 ${card.iconBg} ${card.textColor}`}
                            >
                                <Icon size={20} />
                            </span>
                            <span className="text-neutral-700 block dark:text-neutral-100">{card.title}</span>
                            <h6 className="mb-0 mt-1">{card.value}</h6>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
