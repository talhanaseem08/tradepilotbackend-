import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, UsersRound } from "lucide-react";
import React from "react";

type TrendingBidItem = {
    id: number;
    value: string;
    label: string;
    percentage: string;
    icon: React.ReactNode;
    iconBg: string;
    trend: "up" | "down";
    bgGradientClass: string;
    percentageBgClass: string;
    percentageTextClass: string;
};

const trendingBids: TrendingBidItem[] = [
    {
        id: 1,
        value: "24,000",
        label: "Artworks",
        percentage: "+168.001%",
        icon: <UsersRound />,
        iconBg: "bg-primary",
        trend: "up",
        bgGradientClass: "bg-linear-to-r from-blue-600/10 to-bg-transparent",
        percentageBgClass: "bg-green-100 dark:bg-green-600/25",
        percentageTextClass: "text-green-600 dark:text-green-500",
    },
    {
        id: 2,
        value: "82,000",
        label: "Auction",
        percentage: "+168.001%",
        icon: <UsersRound />,
        iconBg: "bg-red-600",
        trend: "down",
        bgGradientClass: "bg-linear-to-r from-red-600/10 to-bg-transparent",
        percentageBgClass: "bg-red-100 dark:bg-red-600/25",
        percentageTextClass: "text-red-600 dark:text-red-500",
    },
    {
        id: 3,
        value: "800",
        label: "Creators",
        percentage: "+168.001%",
        icon: <UsersRound />,
        iconBg: "bg-violet-600",
        trend: "up",
        bgGradientClass: "bg-linear-to-r from-violet-600/10 to-bg-transparent",
        percentageBgClass: "bg-green-100 dark:bg-green-600/25",
        percentageTextClass: "text-green-600 dark:text-green-500",
    },
];

const TrendingBidWidgets: React.FC = () => {
    return (
        <>
            <h6 className="mb-4">Trending Bids</h6>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-12">
                {trendingBids.map((item) => (
                    <div
                        key={item.id}
                        className="col-span-12 sm:col-span-6 lg:col-span-4"
                    >
                        <div
                            className={`card !border border-slate-300/50 dark:border-slate-600 px-6 py-4 shadow-none rounded-xl h-full ${item.bgGradientClass}`}
                        >
                            <div className="card-body p-0">
                                <div className="flex flex-wrap items-center justify-between gap-1">
                                    <div className="flex items-center flex-wrap gap-4">
                                        <span className={cn(`w-10 h-10 ${item.iconBg} flex-shrink-0 text-white flex justify-center items-center rounded-full h6 mb-0`)}>
                                            {item.icon}
                                        </span>

                                        <div className="flex-grow-1">
                                            <h6 className="font-semibold mb-0">{item.value}</h6>
                                            <span className="font-medium text-neutral-500 dark:text-neutral-300 text-base">
                                                {item.label}
                                            </span>
                                            <p className="text-sm mb-0 flex items-center flex-wrap gap-3 mt-3 text-neutral-500 dark:text-white">
                                                <span
                                                    className={`${item.percentageBgClass} px-1.5 py-0.5 rounded-sm font-medium ${item.percentageTextClass} text-sm flex items-center gap-2`}
                                                >
                                                    {item.percentage}
                                                    {
                                                        item.trend === "up"
                                                            ? <ArrowUp width={14} />
                                                            : <ArrowDown width={14} />
                                                    }
                                                </span>
                                                This week
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TrendingBidWidgets;
