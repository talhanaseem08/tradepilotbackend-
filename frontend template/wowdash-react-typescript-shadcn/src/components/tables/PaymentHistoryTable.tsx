import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

import UserImg1 from "@/assets/images/users/user1.png";
import UserImg2 from "@/assets/images/users/user2.png";
import UserImg3 from "@/assets/images/users/user3.png";
import UserImg4 from "@/assets/images/users/user4.png";
import UserImg5 from "@/assets/images/users/user5.png";

interface PaymentHistoryTableDataType {
    name: string;
    email: string;
    transactionId: string,
    amount: string,
    paymentMethod: string,
    image: string;
    date: string;
    status: "Active" | "Inactive";
    statusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "danger";
}

const users: PaymentHistoryTableDataType[] = [
    {
        name: "Dianne Russell",
        image: UserImg1,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
    {
        name: "Wade Warren",
        image: UserImg2,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "danger",
        status: "Inactive",
    },
    {
        name: "Albert Flores",
        image: UserImg3,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
    {
        name: "Bessie Cooper",
        image: UserImg4,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "danger",
        status: "Inactive",
    },
    {
        name: "Arlene McCoy",
        image: UserImg5,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
    {
        name: "Bessie Cooper",
        image: UserImg4,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "danger",
        status: "Inactive",
    },
    {
        name: "Arlene McCoy",
        image: UserImg5,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
    {
        name: "Albert Flores",
        image: UserImg3,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
    {
        name: "Bessie Cooper",
        image: UserImg4,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "danger",
        status: "Inactive",
    },
    {
        name: "Dianne Russell",
        image: UserImg1,
        email: "osgoodwy@gmail.com",
        transactionId: "9562415412263",
        amount: "$29.00",
        paymentMethod: "Bank",
        date: "27 Mar 2024",
        statusVariant: "success",
        status: "Active",
    },
];


const PaymentHistoryTable = () => {
    const slicedUsers = users.slice(0, 5);

    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                        Users
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                        Email
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                        Transaction ID
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                        Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                        Payment Method
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                        Date
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {slicedUsers.map((user, index) => {
                    const isLastRow = index === slicedUsers.length - 1;
                    return (
                        <TableRow key={index}>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full shrink-0 me-2 overflow-hidden"
                                    />
                                    <div>
                                        <h6 className="text-base mb-0 font-medium">{user.name}</h6>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {user.email}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {user.transactionId}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {user.amount}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {user.paymentMethod}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {user.date}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-br-lg" : ""
                                    } text-center`}
                            >
                                <Badge variant={user.statusVariant} className="rounded-[50rem]">
                                    {user.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default PaymentHistoryTable;
