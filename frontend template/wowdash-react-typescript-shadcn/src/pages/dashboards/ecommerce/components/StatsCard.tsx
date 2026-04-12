import type { LucideIcon } from 'lucide-react';
import { BadgePercent, Box, ShoppingCart, UsersRound } from 'lucide-react';

interface StatsCardData {
    title: string;
    value: string;
    icon: LucideIcon;
    textColor: string;
    bgColor: string;
    borderColor: string;
    change: string;
    changeType: 'increase' | 'decrease';
    changeColor: string;
};

const statsData: StatsCardData[] = [
    {
        title: 'Total Products',
        value: '300',
        icon: Box,
        textColor: 'text-primary dark:text-primary',
        bgColor: 'bg-primary/20',
        borderColor: 'border-primary/50 dark:border-primary/50',
        change: '+200',
        changeType: 'increase',
        changeColor: 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-600/25',
    },
    {
        title: 'Total Customer',
        value: '50,000',
        icon: UsersRound,
        textColor: 'text-orange-600 dark:text-orange-500',
        bgColor: 'bg-orange-600/20',
        borderColor: 'border-orange-300 dark:border-orange-600/50',
        change: '-5k',
        changeType: 'decrease',
        changeColor: 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-600/25',
    },
    {
        title: 'Total Orders',
        value: '1400',
        icon: ShoppingCart,
        textColor: 'text-purple-600 dark:text-purple-500',
        bgColor: 'bg-purple-600/20',
        borderColor: 'border-purple-300 dark:border-purple-600/50',
        change: '+1k',
        changeType: 'increase',
        changeColor: 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-600/25',
    },
    {
        title: 'Total Sales',
        value: '$25,000.00',
        icon: BadgePercent,
        textColor: 'text-pink-600 dark:text-pink-500',
        bgColor: 'bg-pink-600/20',
        borderColor: 'border-pink-300 dark:border-pink-600/50',
        change: '+$10k',
        changeType: 'increase',
        changeColor: 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-600/25',
    },
];

const StatsCard = () => {
    return (
        <>
            {
                statsData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className={`card-body p-6 h-full flex flex-col border-b sm:border-e border-neutral-200 dark:border-slate-600 
                            ${(index === statsData.length - 1 || index === statsData.length - 3) ? '!border-e-0' : ''} 
                            ${(index === statsData.length - 1 || index === statsData.length - 2) ? '!border-b-0' : ''}`
                            }
                        >
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                                <div>
                                    <span
                                        className={`w-[44px] h-[44px] border ${item.textColor} ${item.bgColor} ${item.borderColor} shrink-0 flex justify-center items-center rounded-lg h6 mb-4`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </span>
                                    <span className="mb-1 font-medium text-neutral-500 dark:text-neutral-300 text-base">{item.title}</span>
                                    <h6 className="font-semibold text-neutral-900 dark:text-white mt-2 mb-px">{item.value}</h6>
                                </div>
                            </div>
                            <p className="text-sm mb-0 mt-3">
                                Increase by{' '}
                                <span
                                    className={`px-1 py-0.5 rounded-sm font-medium text-sm ${item.changeColor}`}
                                >
                                    {item.change}
                                </span>{' '}
                                this week
                            </p>
                        </div>
                    )
                })
            }
        </>
    );
};

export default StatsCard;