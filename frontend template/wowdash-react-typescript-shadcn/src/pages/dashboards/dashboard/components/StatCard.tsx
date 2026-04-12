import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, FileText, Medal, UsersRound, Wallet } from "lucide-react";
import React from "react";

interface CardData {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  gradientFrom: string;
  growth: string;
  growthIcon: React.ElementType;
  growthColor: string;
  description: string;
};

const cardsDatas: CardData[] = [
  {
    title: "Total Users",
    value: "20,000",
    icon: UsersRound,
    iconBg: "bg-cyan-600",
    gradientFrom: "from-cyan-600/10",
    growth: "+4000",
    growthIcon: ArrowUp,
    growthColor: "text-green-600 dark:text-green-400",
    description: "Last 30 days users",
  },
  {
    title: "Total Subscription",
    value: "15,000",
    icon: Medal,
    iconBg: "bg-purple-600",
    gradientFrom: "from-purple-600/10",
    growth: "-800",
    growthIcon: ArrowDown,
    growthColor: "text-red-600 dark:text-red-400",
    description: "Last 30 days subscription",
  },
  {
    title: "Total Free Users",
    value: "5,000",
    icon: UsersRound,
    iconBg: "bg-primary",
    gradientFrom: "from-primary/10",
    growth: "+200",
    growthIcon: ArrowUp,
    growthColor: "text-green-600 dark:text-green-400",
    description: "Last 30 days users",
  },
  {
    title: "Total Income",
    value: "$42,000",
    icon: Wallet,
    iconBg: "bg-green-600",
    gradientFrom: "from-green-600/10",
    growth: "+$20,000",
    growthIcon: ArrowUp,
    growthColor: "text-green-600 dark:text-green-400",
    description: "Last 30 days income",
  },
  {
    title: "Total Expense",
    value: "$30,000",
    icon: FileText,
    iconBg: "bg-red-600",
    gradientFrom: "from-red-600/10",
    growth: "+$5,000",
    growthIcon: ArrowUp,
    growthColor: "text-green-600 dark:text-green-400",
    description: "Last 30 days expense",
  },
];

const StatCard = () => {
  return (
    cardsDatas.map((card, index) => (
      <Card
        key={index}
        className={`bg-gradient-to-r ${card.gradientFrom} to-white dark:to-slate-700 p-0 border border-gray-200 dark:border-slate-700 rounded-md shadow-none`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{card.title}</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center`}>
              <card.icon className="text-white" size={24} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mt-4">
            <span className={`flex items-center gap-1 ${card.growthColor}`}>
              <card.growthIcon fill="currentColor" stroke="none" width={14} height={14} />
              {card.growth}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 text-[13px]">{card.description}</span>
          </div>
        </CardContent>
      </Card>
    ))
  );
};

export default StatCard;
