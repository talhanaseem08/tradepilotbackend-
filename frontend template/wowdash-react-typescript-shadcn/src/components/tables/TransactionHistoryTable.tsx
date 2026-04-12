import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

import Img1 from "@/assets/images/home-twelve/transaction-img1.png";
import Img2 from "@/assets/images/home-twelve/transaction-img2.png";
import Img3 from "@/assets/images/home-twelve/transaction-img3.png";
import Img4 from "@/assets/images/home-twelve/transaction-img4.png";
import Img5 from "@/assets/images/home-twelve/transaction-img5.png";

interface TransactionHistoryDataType {
    place: string;
    id: string;
    duration: string;
    amount: string;
    date: string;
    image: string;
    status: "Completed" | "Pending";
    statusVariant: "success" | "warning";
}

const data: TransactionHistoryDataType[] = [
    {
        place: "Grand Palace",
        image: Img1,
        id: "#1250",
        duration: "5 Days, 6 Nights",
        amount: "$209.00",
        date: "21/09/2025",
        status: "Completed",
        statusVariant: "success",
    },
    {
        place: "Paris France",
        image: Img2,
        id: "#6523",
        duration: "2 Days, 3 Nights",
        amount: "$570.00",
        date: "21/09/2025",
        status: "Pending",
        statusVariant: "warning",
    },
    {
        place: "Khaosan Road",
        image: Img3,
        id: "#1250",
        duration: "5 Days, 6 Nights",
        amount: "$870.00",
        date: "21/09/2025",
        status: "Completed",
        statusVariant: "success",
    },
    {
        place: "Wat Phra Kaew",
        image: Img4,
        id: "#6523",
        duration: "2 Days, 3 Nights",
        amount: "$450.00",
        date: "21/09/2025",
        status: "Pending",
        statusVariant: "warning",
    },
    {
        place: "Wat Pho",
        image: Img5,
        id: "#1250",
        duration: "3 Days, 4 Nights",
        amount: "$120.00",
        date: "21/09/2025",
        status: "Completed",
        statusVariant: "success",
    },
];

const TransactionHistoryTable = () => {
    const slicedData = data.slice(0, 5);

    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12 rounded-tl-lg">
                        Place
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12">
                        ID
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12">
                        Duration
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12">
                        Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12">
                        Date
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 overflow-hidden px-4 h-12 rounded-tr-lg text-center">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {slicedData.map((item, index) => {
                    const isLastRow = index === slicedData.length - 1;
                    return (
                        <TableRow key={index}>
                            <TableCell className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 last:border-e ${isLastRow ? "rounded-bl-lg" : ""}`}>
                                <div className="flex items-center">
                                    <img
                                        src={item.image}
                                        alt={item.place}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded shrink-0 me-2 overflow-hidden"
                                    />
                                    <h6 className="text-base mb-0 font-medium">{item.place}</h6>
                                </div>
                            </TableCell>

                            <TableCell className="py-3 px-4 border-b border-neutral-200 dark:border-slate-600">
                                {item.id}
                            </TableCell>

                            <TableCell className="py-3 px-4 border-b border-neutral-200 dark:border-slate-600">
                                {item.duration}
                            </TableCell>

                            <TableCell className="py-3 px-4 border-b border-neutral-200 dark:border-slate-600">
                                {item.amount}
                            </TableCell>

                            <TableCell className="py-3 px-4 border-b border-neutral-200 dark:border-slate-600">
                                {item.date}
                            </TableCell>

                            <TableCell className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 text-center ${isLastRow ? "rounded-br-lg" : ""}`}>
                                <Badge variant={item.statusVariant} className="rounded-[4px]">
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default TransactionHistoryTable;