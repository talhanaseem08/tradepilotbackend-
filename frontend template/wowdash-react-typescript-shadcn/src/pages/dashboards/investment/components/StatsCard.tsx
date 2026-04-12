import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  LucideIcon,
} from "lucide-react";
import {
  DollarSign,
  FileBarChart2,
  Users,
  Wallet,
} from "lucide-react";

export interface StatCardData {
  id: number;
  title: string;
  value: string;
  difference: string;
  Icon: LucideIcon;
  iconBgColor: string;
  gradientFrom: string;
  changeType: "increase" | "decrease";
};

const statsData: StatCardData[] = [
  {
    id: 1,
    title: "New Users",
    value: "4000",
    difference: "+200",
    Icon: Users,
    iconBgColor: "bg-primary",
    gradientFrom: "from-blue-600/10",
    changeType: "increase",
  },
  {
    id: 2,
    title: "Total Deposit",
    value: "15,000",
    difference: "-200",
    Icon: Wallet,
    iconBgColor: "bg-purple-600",
    gradientFrom: "from-purple-600/10",
    changeType: "decrease",
  },
  {
    id: 3,
    title: "Total Expense",
    value: "15,000",
    difference: "+200",
    Icon: FileBarChart2,
    iconBgColor: "bg-red-600",
    gradientFrom: "from-red-600/10",
    changeType: "increase",
  },
  {
    id: 4,
    title: "Total Earning",
    value: "15,000",
    difference: "+200",
    Icon: DollarSign,
    iconBgColor: "bg-green-600",
    gradientFrom: "from-green-600/10",
    changeType: "increase",
  },
];

const StatsCard = () => {
  return (
    <>
      {statsData.map(
        ({
          id,
          title,
          value,
          difference,
          Icon,
          iconBgColor,
          gradientFrom,
          changeType,
        }) => (
          <Card
            key={id}
            className={cn(
              "px-4 py-4 rounded-lg border border-neutral-200/75 dark:border-neutral-600 h-full bg-gradient-to-r shadow-none",
              gradientFrom,
              "to-white dark:to-slate-700"
            )}
          >
            <CardContent className="flex items-center space-x-4 p-0">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 flex justify-center items-center shrink-0">
                <span
                  className={cn(
                    "w-10 h-10 text-white flex justify-center items-center rounded-lg",
                    iconBgColor
                  )}
                >
                  <Icon size={20} />
                </span>
              </div>
              <div>
                <p className="text-muted-foreground text-sm text-neutral-700 dark:text-neutral-300">
                  {title}
                </p>
                <h4 className="font-semibold text-lg mb-1 mt-4">{value}</h4>
                <p className="text-sm">
                  Increase by{" "}
                  <span
                    className={cn(
                      "px-1 py-0.5 rounded-sm font-medium text-sm",
                      changeType === "increase"
                        ? "bg-green-100 text-green-600 dark:bg-green-600/50 dark:text-green-400"
                        : "bg-destructive/10 text-destructive dark:bg-red-600/50 dark:text-red-400"
                    )}
                  >
                    {difference}
                  </span>{" "}
                  this week
                </p>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </>
  );
};

export default StatsCard;
