import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowDownRight,
    ArrowUpRight,
    CircleDollarSign,
    ScrollText,
    ShoppingBag,
    ShoppingCart,
} from "lucide-react";

interface StateCardData {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: "cyan" | "violet" | "green" | "red"; // restrict to known keys
    change: number;
    trend: "up" | "down";
}

const colorClasses: Record<
    StateCardData["color"],
    { bg: string; gradient: string; border: string; text: string }
> = {
    cyan: {
        bg: "bg-cyan-600/25",
        gradient: "bg-gradient-to-l from-cyan-500/10 to-cyan-500/20",
        border: "line-bg-cyan",
        text: "text-cyan-600 dark:text-cyan-600",
    },
    violet: {
        bg: "bg-violet-600/25",
        gradient: "bg-gradient-to-l from-violet-500/10 to-violet-500/20",
        border: "line-bg-violet",
        text: "text-violet-600 dark:text-violet-600",
    },
    green: {
        bg: "bg-green-600/25",
        gradient: "bg-gradient-to-l from-green-500/10 to-green-500/20",
        border: "line-bg-green",
        text: "text-green-600 dark:text-green-600",
    },
    red: {
        bg: "bg-yellow-500/25",
        gradient: "bg-gradient-to-l from-yellow-500/10 to-yellow-500/20",
        border: "line-bg-yellow",
        text: "text-yellow-500 dark:text-yellow-500",
    },
};

const stateCardsData: StateCardData[] = [
    {
        title: "Gross Sales",
        value: "$40,000",
        icon: <ShoppingCart />,
        color: "cyan",
        change: 80,
        trend: "up",
    },
    {
        title: "Total Purchase",
        value: "$35,000",
        icon: <ShoppingBag />,
        color: "violet",
        change: 95,
        trend: "up",
    },
    {
        title: "Total Income",
        value: "$30,000",
        icon: <CircleDollarSign />,
        color: "green",
        change: 30,
        trend: "down",
    },
    {
        title: "Total Expense",
        value: "$7,000",
        icon: <ScrollText />,
        color: "red",
        change: 60,
        trend: "up",
    },
];

const StateCards: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    {stateCardsData.map((item, index) => {
                        const isUp = item.trend === "up";
                        const color = colorClasses[item.color];

                        return (
                            <div
                                key={index}
                                className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
                            >
                                <div
                                    className={`px-5 py-4 rounded-[8px] h-full relative overflow-hidden shadow-none ${color.gradient} left-line ${color.border}`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-1 mb-2">
                                        <div>
                                            <span className="mb-0.5 font-medium text-neutral-600 dark:text-neutral-200 text-base">
                                                {item.title}
                                            </span>
                                            <h6 className="font-semibold mb-1">{item.value}</h6>
                                        </div>
                                        <span
                                            className={`w-11 h-11 rounded-[8px] inline-flex justify-center items-center text-2xl ${color.bg} ${color.text}`}
                                        >
                                            {item.icon}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-0 flex items-center gap-2">
                                        <span
                                            className={`px-1 rounded-[2px] font-medium text-sm inline-flex items-center gap-1 ${isUp
                                                ? "bg-green-600/15 text-green-600 dark:text-green-600"
                                                : "bg-red-500/15 text-red-500 dark:text-red-500"
                                                }`}
                                        >
                                            {isUp ? (
                                                <ArrowUpRight width={14} />
                                            ) : (
                                                <ArrowDownRight width={14} />
                                            )}
                                            {item.change}%
                                        </span>
                                        From last month
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default StateCards;
