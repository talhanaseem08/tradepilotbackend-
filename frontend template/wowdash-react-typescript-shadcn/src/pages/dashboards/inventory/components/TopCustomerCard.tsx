import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


interface TopCustomersStatus {
    sl: string;
    name: string;
    amount: string;
};

const topCustomers: TopCustomersStatus[] = [
    {
        sl: "1",
        name: "Savannah Nguyen",
        amount: "$80,00.00",
    },
    {
        sl: "2",
        name: "Annette Black",
        amount: "$70,00.00",
    },
    {
        sl: "3",
        name: "Theresa Webb",
        amount: "$60,00.00",
    },
    {
        sl: "4",
        name: "Marvin McKinney",
        amount: "$50,00.00",
    },
    {
        sl: "5",
        name: "Brooklyn Simmons",
        amount: "$40,00.00",
    },
    {
        sl: "6",
        name: "Dianne Russell",
        amount: "$30,00.00",
    },
];


const TopCustomerCard: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Top Customer</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="flex flex-col gap-7 p-6">
                        <Table className="table-auto border-spacing-0 border-separate">
                            <TableHeader>
                                <TableRow className="border-0">
                                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-[56px] border-t border-neutral-200 dark:border-slate-600 text-start rounded-tl-lg">
                                        SL
                                    </TableHead>
                                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-[56px] border-t border-neutral-200 dark:border-slate-600 text-center">
                                        Name
                                    </TableHead>
                                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-[56px] border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topCustomers.map((order, index) => {
                                    const isLast = index === topCustomers.length - 1;
                                    return (
                                        <TableRow key={index}>
                                            <TableCell
                                                className={`py-4.5 px-4 text-neutral-500 dark:text-neutral-200 font-medium first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-start ${isLast ? "rounded-bl-lg" : ""
                                                    }`}
                                            >
                                                {order.sl}
                                            </TableCell>
                                            <TableCell
                                                className={`py-4.5 px-4 text-neutral-500 dark:text-neutral-200 font-medium first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "" : ""
                                                    }`}
                                            >
                                                {order.name}
                                            </TableCell>
                                            <TableCell
                                                className={`py-4.5 px-4 text-neutral-500 dark:text-neutral-200 font-medium first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-br-lg" : ""
                                                    }`}
                                            >
                                                {order.amount}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopCustomerCard;