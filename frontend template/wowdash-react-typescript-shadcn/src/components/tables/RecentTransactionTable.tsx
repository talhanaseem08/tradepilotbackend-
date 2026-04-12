import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { LucideIcon } from "lucide-react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

export interface Transaction {
  id: string;
  asset: string;
  time: string;
  date: string;
  amount: string;
  usdValue: string;
  address: string;
  status: "Completed" | "Terminated";
  direction: "in" | "out";
  icon: LucideIcon;
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

const transactions: Transaction[] = [
  {
    id: "1",
    asset: "Bitcoin",
    time: "10:34 AM",
    date: "27 Mar 2024",
    amount: "+ 0.431 BTC",
    usdValue: "$3,480.90",
    address: "Abc.........np562",
    status: "Completed",
    statusVariant: "success",
    direction: "in",
    icon: ArrowUpRight,
  },
  {
    id: "2",
    asset: "Bitcoin",
    time: "10:34 AM",
    date: "27 Mar 2024",
    amount: "+ 0.431 BTC",
    usdValue: "$3,480.90",
    address: "Abc.........np562",
    status: "Terminated",
    statusVariant: "danger",
    direction: "out",
    icon: ArrowDownLeft,
  },
  {
    id: "3",
    asset: "Bitcoin",
    time: "10:34 AM",
    date: "27 Mar 2024",
    amount: "+ 0.431 BTC",
    usdValue: "$3,480.90",
    address: "Abc.........np562",
    status: "Completed",
    statusVariant: "success",
    direction: "in",
    icon: ArrowUpRight,
  },
  {
    id: "4",
    asset: "Bitcoin",
    time: "10:34 AM",
    date: "27 Mar 2024",
    amount: "+ 0.431 BTC",
    usdValue: "$3,480.90",
    address: "Abc.........np562",
    status: "Terminated",
    statusVariant: "danger",
    direction: "out",
    icon: ArrowDownLeft,
  },
  {
    id: "5",
    asset: "Bitcoin",
    time: "10:34 AM",
    date: "27 Mar 2024",
    amount: "+ 0.431 BTC",
    usdValue: "$3,480.90",
    address: "Abc.........np562",
    status: "Completed",
    statusVariant: "success",
    direction: "in",
    icon: ArrowUpRight,
  },
];

const RecentTransactionTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg">
            Ast
          </TableHead>
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Date & Time
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Amount
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Address
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((txn, index) => {
          const isLast = index === transactions.length - 1;
          const Icon = txn.icon;

          const iconColor =
            txn.direction === "in"
              ? "text-green-600 bg-green-100 dark:bg-green-600/25 dark:text-green-400"
              : "text-red-600 bg-red-100 dark:bg-red-600/25 dark:text-red-400";

          return (
            <TableRow key={txn.id}>
              {/* Asset */}
              <TableCell
                className={`py-3 px-4 text-base border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xl ${iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">
                    {txn.asset}
                  </span>
                </div>
              </TableCell>

              {/* Date & Time */}
              <TableCell className="py-3 px-4 text-base border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                <div>
                  <div className="text-neutral-600 dark:text-neutral-200 font-medium">
                    {txn.time}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-300 text-sm">{txn.date}</div>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell className="py-3 px-4 text-base border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center">
                <div className="text-neutral-600 dark:text-neutral-200 font-medium">
                  {txn.amount}
                </div>
                <div className="text-neutral-500 dark:text-neutral-300 text-sm">
                  {txn.usdValue}
                </div>
              </TableCell>

              {/* Address */}
              <TableCell className="py-3 px-4 text-base border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center">
                {txn.address}
              </TableCell>

              {/* Status */}
              <TableCell
                className={`py-3 px-4 text-base border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-br-lg" : ""
                  }`}
              >
                <Badge variant={txn.statusVariant}>{txn.status}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RecentTransactionTable;
