import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface recentTransactionType {
    sl: string;
    date: string;
    paymentType: string;
    paidAmount: string;
    dueAmount: string;
    payableAmount: string;
};

const recentTransactionContents: recentTransactionType[] = [
    {
        sl: "1",
        date: "02 Jan 2025",
        paymentType: "Credit Card",
        paidAmount: "$320.00",
        dueAmount: "$0.00",
        payableAmount: "$320.00",
    },
    {
        sl: "2",
        date: "15 Feb 2025",
        paymentType: "Bank Transfer",
        paidAmount: "$1,200.00",
        dueAmount: "$300.00",
        payableAmount: "$1,500.00",
    },
    {
        sl: "3",
        date: "28 Feb 2025",
        paymentType: "Cash",
        paidAmount: "$450.00",
        dueAmount: "$50.00",
        payableAmount: "$500.00",
    },
    {
        sl: "4",
        date: "10 Mar 2025",
        paymentType: "UPI",
        paidAmount: "$0.00",
        dueAmount: "$900.00",
        payableAmount: "$900.00",
    },
    {
        sl: "5",
        date: "18 Mar 2025",
        paymentType: "PayPal",
        paidAmount: "$600.00",
        dueAmount: "$0.00",
        payableAmount: "$600.00",
    },
];


const InventoryRecentTransactionsTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-start rounded-tl-lg">
                        SL
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Date
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Payment Type
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Paid Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
                        Due Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
                        Payable Amount
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentTransactionContents.map((coursesContent, index) => {
                    const isLast = index === recentTransactionContents.length - 1;
                    return (
                        <TableRow key={index}>
                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-start ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.sl}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "" : ""
                                    }`}
                            >
                                {coursesContent.date}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "" : ""
                                    }`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-100">
                                    {coursesContent.paymentType}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "" : ""
                                    }`}
                            >
                                {coursesContent.paidAmount}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "" : ""
                                    }`}
                            >
                                {coursesContent.dueAmount}
                            </TableCell>

                            <TableCell
                                className={`py-4 px-4 first:border-s last:border-e font-medium text-neutral-500 dark:text-neutral-200 border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-br-lg" : ""
                                    }`}
                            >
                                {coursesContent.payableAmount}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default InventoryRecentTransactionsTable;
