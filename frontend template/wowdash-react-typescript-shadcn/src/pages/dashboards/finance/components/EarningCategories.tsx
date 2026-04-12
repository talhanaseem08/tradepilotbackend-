import earnCatIcon1 from "@/assets/images/home-eleven/icons/earn-cat-icon1.svg";
import earnCatIcon2 from "@/assets/images/home-eleven/icons/earn-cat-icon2.svg";
import earnCatIcon3 from "@/assets/images/home-eleven/icons/earn-cat-icon3.svg";
import earnCatIcon4 from "@/assets/images/home-eleven/icons/earn-cat-icon4.svg";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

type Category = {
    id: number;
    title: string;
    amount: string;
    from: string;
    percentage: number;
    icon: string;
    iconBg: string;
    progressColor: string;
};

const categories: Category[] = [
    {
        id: 1,
        title: "Digital Assets",
        amount: "$50",
        from: "$1000",
        percentage: 80,
        icon: earnCatIcon1,
        iconBg: "bg-blue-100 dark:bg-blue-600/25",
        progressColor: "bg-blue-600",
    },
    {
        id: 2,
        title: "Side Project",
        amount: "$50",
        from: "$1000",
        percentage: 60,
        icon: earnCatIcon2,
        iconBg: "bg-red-100 dark:bg-red-600/25",
        progressColor: "bg-yellow-600",
    },
    {
        id: 3,
        title: "Investment",
        amount: "$50",
        from: "$1000",
        percentage: 49,
        icon: earnCatIcon3,
        iconBg: "bg-yellow-200 dark:bg-yellow-600/25",
        progressColor: "bg-yellow-500",
    },
    {
        id: 4,
        title: "Working Hard",
        amount: "$50",
        from: "$1000",
        percentage: 100,
        icon: earnCatIcon4,
        iconBg: "bg-green-200 dark:bg-green-600/25",
        progressColor: "bg-green-500",
    },
];

const EarningCategories: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Earning Categories</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="p-6">
                        <div className="flex flex-col gap-5">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center w-full gap-4 grow">
                                        <span
                                            className={`w-10 h-10 rounded-full flex justify-center items-center shrink-0 ${cat.iconBg}`}
                                        >
                                            <img
                                                src={cat.icon}
                                                alt={cat.title}
                                                width={20}
                                                height={20}
                                            />
                                        </span>
                                        <div className="grow">
                                            <h6 className="text-sm mb-0">{cat.title}</h6>
                                            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                                                {cat.amount} / from {cat.from}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="ms-auto">
                                            <div className="w-[66px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                                                <div className={`${cat.progressColor} h-2.5 rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                                            </div>
                                        </div>
                                        <span className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
                                            {cat.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EarningCategories;
