import SmallAreaChart from "@/components/charts/SmallAreaChart";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';
import { BarChart3, DollarSign, LineChart, TrendingUp, UserCheck, Users } from 'lucide-react';

interface StatItem {
    id: string;
    title: string;
    value: string;
    change: string;
    changeColor: "success" | "danger";
    gradientFrom: string;
    bgCircle: string;
    icon: LucideIcon;
    chartId: string;
}

const stats: StatItem[] = [
    {
        id: "new-users",
        title: "New Users",
        value: "15,000",
        change: "+200",
        changeColor: "success",
        gradientFrom: "from-blue-600/10",
        bgCircle: "#487fff",
        icon: Users,
        chartId: "new-user-chart",
    },
    {
        id: "active-users",
        title: "Active Users",
        value: "8,000",
        change: "+200",
        changeColor: "success",
        gradientFrom: "from-green-600/10",
        bgCircle: "#45b369",
        icon: UserCheck,
        chartId: "active-user-chart",
    },
    {
        id: "total-sales",
        title: "Total Sales",
        value: "$5,00,000",
        change: "-$10k",
        changeColor: "danger",
        gradientFrom: "from-yellow-500/10",
        bgCircle: "#f4941e",
        icon: DollarSign,
        chartId: "total-sales-chart",
    },
    {
        id: "conversion",
        title: "Conversion",
        value: "25%",
        change: "+5%",
        changeColor: "success",
        gradientFrom: "from-purple-600/10",
        bgCircle: "#8252e9",
        icon: BarChart3,
        chartId: "conversion-user-chart",
    },
    {
        id: "leads",
        title: "Leads",
        value: "250",
        change: "+20",
        changeColor: "success",
        gradientFrom: "from-pink-600/10",
        bgCircle: "#de3ace",
        icon: LineChart,
        chartId: "leads-chart",
    },
    {
        id: "total-profit",
        title: "Total Profit",
        value: "$3,00,700",
        change: "+$15k",
        changeColor: "success",
        gradientFrom: "from-cyan-600/10",
        bgCircle: "#00b8f2",
        icon: TrendingUp,
        chartId: "total-profit-chart",
    },
];

const StatsCard = () => {
    return (
        <>
            {
                stats.map((item) => {
                    const Icon = item.icon;
                    const colorClass =
                        item.changeColor === "success"
                            ? "bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400";

                    return (
                        <Card
                            key={item.id}
                            className={`card !px-4 !py-5 shadow-none rounded-lg !border border-gray-200 dark:border-neutral-600 h-full bg-gradient-to-l ${item.gradientFrom} to-bg-white`}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            style={{ backgroundColor: item.bgCircle }}
                                            className={`w-[44px] h-[44px] text-white flex justify-center items-center rounded-full ${item.bgCircle}`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </span>
                                        <div>
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-100">
                                                {item.title}
                                            </span>
                                            <h6 className="font-semibold">{item.value}</h6>
                                        </div>
                                    </div>
                                    <div className="remove-tooltip-title rounded-tooltip-value remove-tooltip-marker">
                                        <SmallAreaChart chartColor={item.bgCircle} chartWidth={80} chartHeight={42} />
                                    </div>
                                </div>
                                <p className="text-sm mb-0 text-neutral-600 dark:text-neutral-100">
                                    Increase by{" "}
                                    <span className={`px-1 py-px rounded font-medium text-sm ${colorClass}`}>
                                        {item.change}
                                    </span>{" "}
                                    this week
                                </p>
                            </CardContent>
                        </Card>
                    );
                })
            }
        </>
    );
};

export default StatsCard;
