import type { LucideIcon } from 'lucide-react';
import { Medal, UsersRound, Wallet } from 'lucide-react';

interface statCardsType {
    cardBg: string,
    iconBgColor: string,
    icon: LucideIcon,
    statistics: string,
    text: string,
    amount: string,
    amountColor: string,
    description: string,
}

const statsCards: statCardsType[] = [
    {
        cardBg: 'from-cyan-600/10',
        iconBgColor: 'bg-cyan-600/25 text-cyan-600 dark:text-cyan-500',
        icon: UsersRound,
        statistics: '650',
        text: 'Doctors',
        amount: '4',
        amountColor: 'text-cyan-600 dark:text-cyan-500',
        description: 'Doctors joined this week',
    },
    {
        cardBg: 'from-violet-600/10',
        iconBgColor: 'bg-violet-600/25 text-violet-600 dark:text-violet-500',
        icon: Medal,
        statistics: '570',
        text: 'Staffs',
        amount: '8',
        amountColor: 'text-violet-600 dark:text-violet-500',
        description: 'Staffs on vacation',
    },
    {
        cardBg: 'from-blue-600/10',
        iconBgColor: 'bg-primary/25 text-primary dark:text-primary',
        icon: UsersRound,
        statistics: '15,750',
        text: 'Patients',
        amount: '170',
        amountColor: '17text-primary dark:text-primary',
        description: 'New patients admitted',
    },
    {
        cardBg: 'from-green-600/10',
        iconBgColor: 'bg-green-600/25 text-green-600 dark:text-green-500',
        icon: Wallet,
        statistics: '$42,400',
        text: 'Pharmacies',
        amount: '60,000',
        amountColor: '60,00text-green-600 dark:text-green-500',
        description: 'Medicine on reserve',
    },
]

const StatCards = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {
                    statsCards.map(({ cardBg, iconBgColor, icon: Icon, statistics, text, amount, description, amountColor }, index) => {
                        return (
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3" key={index}>
                                <div className={`card !border border-white dark:border-slate-600 p-4 shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)] rounded-lg h-full bg-gradient-to-l ${cardBg} to-bg-white`}>
                                    <div className="card-body p-0">
                                        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-12 h-12 ${iconBgColor} flex-shrink-0 flex justify-center items-center rounded-full h6 mb-0`}>
                                                    <Icon />
                                                </span>
                                                <div>
                                                    <h6 className="font-semibold mb-0.5">{statistics}</h6>
                                                    <span className="font-medium text-gray-600 dark:text-neutral-100 text-sm">{text}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm mb-0 text-gray-600 dark:text-neutral-100">
                                            <span className={`${amountColor}`}>{amount} </span>
                                            {" "}{description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};

export default StatCards;