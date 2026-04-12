import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const sellingProduct = [
    {
        sl: "01",
        id: "#526534",
        name: "Kathryn Murphy",
        date: "25 Jan 2024",
        amount: "$200.00",
    },
    {
        sl: "02",
        id: "#696589",
        name: "Annette Black",
        date: "25 Jan 2024",
        amount: "$200.00",
    },
    {
        sl: "03",
        id: "#256584",
        name: "Kathryn Murphy",
        date: "10 Feb 2024",
        amount: "$200.00",
    },
    {
        sl: "04",
        id: "#526587",
        name: "Eleanor Pena	",
        date: "10 Feb 2024",
        amount: "$200.00",
    },
    {
        sl: "05",
        id: "#105986",
        name: "Leslie Alexander",
        date: "15 Mar 2024",
        amount: "$200.00",
    },
];

const DefaultTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 rounded-tl-lg">
                        S.L
                    </TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 rounded-tl-lg">
                        Invoice
                    </TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700">
                        Name
                    </TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700">
                        Issued Date
                    </TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700">
                        Amount
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {sellingProduct.map((product, index) => {
                    const isLast = index === sellingProduct.length - 1;
                    return (
                        <TableRow key={index}>
                            {/* sl */}
                            <TableCell
                                className={`py-4 px-4 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {product.sl}
                            </TableCell>
                            {/* Item */}
                            <TableCell
                                className={`py-4 px-4 text-center text-primary ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {product.id}
                            </TableCell>

                            {/* name */}
                            <TableCell className="py-4 px-4 text-center">
                                {product.name}
                            </TableCell>

                            {/* date */}
                            <TableCell className="py-4 px-4 text-center">
                                {product.date}
                            </TableCell>

                            {/* amount */}
                            <TableCell className="py-4 px-4 text-center">
                                {product.amount}
                            </TableCell>

                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default DefaultTable;
