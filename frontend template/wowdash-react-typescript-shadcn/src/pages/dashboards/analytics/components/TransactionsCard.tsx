import PaymentIcon1 from "@/assets/images/home-nine/payment1.png";
import PaymentIcon2 from "@/assets/images/home-nine/payment2.png";
import PaymentIcon3 from "@/assets/images/home-nine/payment3.png";
import PaymentIcon4 from "@/assets/images/home-nine/payment4.png";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

interface Transaction {
    id: number;
    title: string;
    subtitle: string;
    amount: string;
    icon: string;
    bgColor: string;
}

const transactions: Transaction[] = [
    {
        id: 1,
        title: "Wallet",
        subtitle: "Payment",
        amount: "+$6200",
        icon: PaymentIcon1,
        bgColor: "bg-green-200 dark:bg-green-600/20",
    },
    {
        id: 2,
        title: "PayPal",
        subtitle: "Payment",
        amount: "+$6200",
        icon: PaymentIcon2,
        bgColor: "bg-cyan-200 dark:bg-cyan-600/20",
    },
    {
        id: 3,
        title: "Credit Card",
        subtitle: "Bill Payment",
        amount: "-$6200",
        icon: PaymentIcon3,
        bgColor: "bg-yellow-200 dark:bg-yellow-600/20",
    },
    {
        id: 4,
        title: "Bank",
        subtitle: "Bill Payment",
        amount: "+$6200",
        icon: PaymentIcon4,
        bgColor: "bg-violet-200 dark:bg-violet-600/20",
    },
];

const TransactionsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center flex-wrap gap-2 justify-between">
                    <h6 className="font-bold text-lg mb-0">Transactions</h6>
                    <CommonLink />
                </div>

                {/* Transactions List */}
                <div className="mt-8">
                    {transactions.map((tx, index) => (
                        <div
                            key={tx.id}
                            className={`flex items-center justify-between gap-4 ${index === transactions.length - 1 ? "mb-0" : "mb-8"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-[40px] h-[40px] rounded-full flex justify-center items-center shrink-0 ${tx.bgColor}`}
                                >
                                    <img src={tx.icon} alt={tx.title} />
                                </div>
                                <div className="flex-grow">
                                    <h6 className="text-base mb-0 font-normal">{tx.title}</h6>
                                    <span className="text-sm text-neutral-600  dark:text-neutral-200 font-normal">
                                        {tx.subtitle}
                                    </span>
                                </div>
                            </div>
                            <span className="text-neutral-600  dark:text-neutral-200 text-base font-medium">
                                {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionsCard;
