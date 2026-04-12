import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

interface TransactionsDataType {
  id: string;
  date: string;
  amount: string;
  status: "Pending" | "Rejected" | "Completed";
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

const transactions: TransactionsDataType[] = [
  {
    id: "5986124445445",
    date: "27 Mar 2024",
    status: "Pending",
    statusVariant: "warning",
    amount: "$20,000.00",
  },
  {
    id: "5986124445445",
    date: "27 Mar 2024",
    status: "Rejected",
    statusVariant: "danger",
    amount: "$20,000.00",
  },
  {
    id: "5986124445445",
    date: "27 Mar 2024",
    status: "Completed",
    statusVariant: "success",
    amount: "$20,000.00",
  },
  {
    id: "5986124445445",
    date: "27 Mar 2024",
    status: "Completed",
    statusVariant: "success",
    amount: "$20,000.00",
  },
  {
    id: "5986124445445",
    date: "27 Mar 2024",
    status: "Completed",
    statusVariant: "success",
    amount: "$20,000.00",
  },
];

const LastTransactionTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 px-4 h-12 border-s rounded-tl-lg">
            Transaction ID
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 px-4 h-12">
            Date
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 px-4 h-12 text-center">
            Status
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 px-4 h-12 border-e rounded-tr-lg text-center">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((txn, index) => {
          const isLastRow = index === transactions.length - 1;

          return (
            <TableRow key={index}>
              <TableCell
                className={`py-4.5 px-4 border-b border-neutral-200 dark:border-slate-600 text-base first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                {txn.id}
              </TableCell>

              <TableCell
                className={`py-4.5 px-4 border-b border-neutral-200 dark:border-slate-600 text-base first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                {txn.date}
              </TableCell>

              <TableCell
                className={`py-4.5 px-4 border-b border-neutral-200 dark:border-slate-600 text-base text-center first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                <Badge variant={txn.statusVariant} className="rounded-[50rem]">
                  {txn.status}
                </Badge>
              </TableCell>

              <TableCell
                className={`py-4.5 px-4 border-b border-neutral-200 dark:border-slate-600 text-base first:border-s last:border-e ${
                  isLastRow ? "rounded-br-lg" : ""
                } text-center`}
              >
                {txn.amount}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LastTransactionTable;