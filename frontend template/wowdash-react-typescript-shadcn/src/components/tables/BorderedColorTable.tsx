import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sellingProduct = [
    {
        id: "#526534",
        name: "Kathryn Murphy",
        date: "25 Jan 2024",
        amount: "$200.00",
        action: "View More",
    },
    {
        id: "#696589",
        name: "Annette Black",
        date: "25 Jan 2024",
        amount: "$200.00",
        action: "View More",
    },
    {
        id: "#256584",
        name: "Kathryn Murphy",
        date: "10 Feb 2024",
        amount: "$200.00",
        action: "View More",
    },
    {
        id: "#526587",
        name: "Eleanor Pena	",
        date: "10 Feb 2024",
        amount: "$200.00",
        action: "View More",
    },
    {
        id: "#105986",
        name: "Leslie Alexander",
        date: "15 Mar 2024",
        amount: "$200.00",
        action: "View More",
    },
    {
        id: "#256584",
        name: "Kathryn Murphy",
        date: "10 Feb 2024",
        amount: "$200.00",
        action: "View More",
    },
];

const BorderedColorTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="px-4 h-12 border-e last:border-e-0 text-center bg-neutral-100 dark:bg-slate-700 border-t border-primary first:border-s last:border-e dark:border-slate-600 rounded-tl-lg">
                        Invoice
                    </TableHead>
                    <TableHead className="px-4 h-12 border-e last:border-e-0 text-center bg-neutral-100 dark:bg-slate-700 border-t border-primary first:border-s last:border-e dark:border-slate-600">
                        Name
                    </TableHead>
                    <TableHead className="px-4 h-12 border-e last:border-e-0 text-center bg-neutral-100 dark:bg-slate-700 border-t border-primary first:border-s last:border-e dark:border-slate-600">
                        Issued Date
                    </TableHead>
                    <TableHead className="px-4 h-12 border-e last:border-e-0 text-center bg-neutral-100 dark:bg-slate-700 border-t border-primary first:border-s last:border-e dark:border-slate-600">
                        Amount
                    </TableHead>
                    <TableHead className="px-4 h-12 border-e last:border-e-0 text-center bg-neutral-100 dark:bg-slate-700 border-t border-primary first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {sellingProduct.map((product, index) => {
                    const isLast = index === sellingProduct.length - 1;
                    return (
                        <TableRow key={index}>
                            {/* Item */}
                            <TableCell
                                className={`py-4 px-4 border-e last:border-e-0 border-b text-center text-primary first:border-s last:border-e border-primary dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {product.id}
                            </TableCell>

                            {/* name */}
                            <TableCell className="py-4 px-4 border-e last:border-e-0 border-b text-center first:border-s last:border-e border-primary dark:border-slate-600">
                                {product.name}
                            </TableCell>

                            {/* date */}
                            <TableCell className="py-4 px-4 border-e last:border-e-0 border-b text-center first:border-s last:border-e border-primary dark:border-slate-600">
                                {product.date}
                            </TableCell>

                            {/* amount */}
                            <TableCell className="py-4 px-4 border-e last:border-e-0 border-b text-center first:border-s last:border-e border-primary dark:border-slate-600">
                                {product.amount}
                            </TableCell>

                            {/* action */}
                            <TableCell className="py-4 px-4 border-e last:border-e-0 border-b text-center text-primary first:border-s last:border-e border-primary dark:border-slate-600">
                                <Link
                                    to="#"
                                    className="inline-flex items-center gap-1 text-primary dark:text-primary hover:text-blue-400 text-sm"
                                >
                                    {product.action}
                                    <ChevronRight width={16} height={16} />
                                </Link>
                            </TableCell>

                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default BorderedColorTable;
