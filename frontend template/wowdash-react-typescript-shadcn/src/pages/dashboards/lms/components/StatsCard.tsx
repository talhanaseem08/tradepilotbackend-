import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { DollarSign, UsersRound, Youtube } from "lucide-react";

export interface StatCardData {
  id: number;
  title: string;
  value: string;
  difference: string;
  changeType: string;
  iconBgColor: string;
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon?: LucideIcon;
}

const statsData: StatCardData[] = [
  {
    id: 1,
    title: "Total Students",
    value: "15,000",
    difference: "+2.5k",
    changeType: "This Month",
    icon: UsersRound,
    iconBgColor: "bg-white dark:bg-neutral-900",
    textColor: "text-[#de3ace] dark:text-[#de3ace]",
    gradientFrom: "from-[#ffeaf480] dark:from-[#ffeaf41c]",
    gradientTo: "to-[#ffe2f0] dark:to-[#ffe2f018]",
  },
  {
    id: 2,
    title: "Total Courses",
    value: "420",
    difference: "+30",
    changeType: "This Month",
    icon: Youtube,
    iconBgColor: "bg-white dark:bg-neutral-900",
    textColor: "text-violet-600 dark:text-violet-600",
    gradientFrom: "from-[#ecddff4d] dark:from-[#ecddff17]",
    gradientTo: "to-[#ecddff] dark:to-[#ecddff26]",
  },
  {
    id: 3,
    title: "Overall Revenue",
    value: "$50,000",
    difference: "+1.5k",
    changeType: "This Month",
    icon: DollarSign,
    iconBgColor: "bg-white dark:bg-neutral-900",
    textColor: "text-cyan-600 dark:text-cyan-600",
    gradientFrom: "from-[#ebfaff] dark:from-[#ebfaff2c]",
    gradientTo: "to-[#c0f0ff] dark:to-[#c0f0ff23]",
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
          changeType,
          icon: Icon,
          iconBgColor,
          textColor,
          gradientFrom,
          gradientTo,
        }) => (
          <div
            key={id}
            className={cn(
              "card border-0 !p-4 rounded-lg shadow-none bg-gradient-to-l !h-[unset]",
              gradientFrom,
              gradientTo
            )}
          >
            <div className="card-body p-0">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "mb-0 w-11 h-11 text-2xl flex-shrink-0 flex justify-center items-center rounded-full h6",
                      iconBgColor,
                      textColor
                    )}
                  >
                    {Icon ? <Icon className={cn(textColor)} /> : ""}
                  </span>
                  <div>
                    <span className="mb-0 font-medium text-neutral-600 dark:text-neutral-100 text-lg">
                      {title}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-8">
                <h5 className="font-semibold mb-0">{value}</h5>
                <p className="text-sm mb-0 flex items-center gap-2 text-neutral-500 dark:text-neutral-200">
                  <span className="text-white px-1 rounded font-medium bg-green-600 text-sm">
                    {difference}
                  </span>
                  {changeType}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default StatsCard;