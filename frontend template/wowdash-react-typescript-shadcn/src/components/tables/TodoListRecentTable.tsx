import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "../ui/badge";

interface TransactionsDataType {
  name: string;
  id: string;
  assignedTo: string;
  dueDate: string;
  status: "Active" | "Rejected" | "Pending";
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
    name: "Hotel Management System",
    id: "#5632",
    assignedTo: "Kathryn Murphy",
    dueDate: "27 Mar 2024",
    status: "Active",
    statusVariant: "success",
  },
  {
    name: "Hotel Management System",
    id: "#5632",
    assignedTo: "Darlene Robertson",
    dueDate: "27 Mar 2024",
    status: "Rejected",
    statusVariant: "danger",
  },
  {
    name: "Hotel Management System",
    id: "#5632",
    assignedTo: "Courtney Henry",
    dueDate: "27 Mar 2024",
    status: "Pending",
    statusVariant: "warning",
  },
  {
    name: "Hotel Management System",
    id: "#5632",
    assignedTo: "Jenny Wilson",
    dueDate: "27 Mar 2024",
    status: "Active",
    statusVariant: "success",
  },
];

const TodoListRecentTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg">
            Task Name
          </TableHead>
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Assigned To
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Due Date
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Status
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((txn, index) => {
          const isLast = index === transactions.length - 1;
          return (
            <TableRow key={index}>
              {/* Task Name */}
              <TableCell
                className={`py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${
                  isLast ? "rounded-bl-lg" : ""
                }`}
              >
                <div>
                  <span className="block font-medium text-base text-neutral-700 dark:text-neutral-200">
                    {txn.name}
                  </span>
                  <span className="block text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                    {txn.id}
                  </span>
                </div>
              </TableCell>

              {/* Assigned To */}
              <TableCell className="py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                {txn.assignedTo}
              </TableCell>

              {/* Due Date */}
              <TableCell className="py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center">
                {txn.dueDate}
              </TableCell>

              {/* Status */}
              <TableCell className="py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center">
                <Badge variant={txn.statusVariant} className="rounded-[50rem]">
                  {txn.status}
                </Badge>
              </TableCell>

              {/* Action */}
              <TableCell
                className={`py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 text-center ${
                  isLast ? "rounded-br-lg" : ""
                }`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-2xl px-2.5 py-2.5 rounded-lg text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-slate-700 data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-600 cursor-pointer">
                    <EllipsisVertical className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TodoListRecentTable;
