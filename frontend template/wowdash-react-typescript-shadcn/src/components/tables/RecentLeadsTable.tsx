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

import { Badge } from "@/components/ui/badge";
import { EllipsisVertical } from "lucide-react";

interface RecentLeadType {
    id: string;
    name: string;
    email: string;
    phone: string;
    leadSource: string;
    assignedTo: string;
    status: "New" | "Contacted" | "Qualified" | "Cold" | "Lost";
    statusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "danger";
    date: string;
}

const recentLeads: RecentLeadType[] = [
    {
        id: "LD-1023",
        name: "John Carter",
        email: "john.carter@example.com",
        phone: "+1 202-450-7890",
        leadSource: "Website",
        assignedTo: "Sarah Johnson",
        status: "New",
        statusVariant: "info",
        date: "2024-12-01",
    },
    {
        id: "LD-1024",
        name: "Emily Watson",
        email: "emily.watson@example.com",
        phone: "+1 312-889-2234",
        leadSource: "Facebook Ads",
        assignedTo: "Michael Brown",
        status: "Contacted",
        statusVariant: "warning",
        date: "2024-12-02",
    },
    {
        id: "LD-1025",
        name: "David Miller",
        email: "david.miller@example.com",
        phone: "+1 415-764-1123",
        leadSource: "Google Ads",
        assignedTo: "Jessica Lee",
        status: "Qualified",
        statusVariant: "success",
        date: "2024-12-03",
    },
    {
        id: "LD-1026",
        name: "Sophia Turner",
        email: "sophia.turner@example.com",
        phone: "+1 503-123-7788",
        leadSource: "LinkedIn",
        assignedTo: "Robert Davis",
        status: "Cold",
        statusVariant: "secondary",
        date: "2024-12-04",
    },
];

const RecentLeadsTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 rounded-tl-lg">
                        Lead Info
                    </TableHead>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600">
                        Contact
                    </TableHead>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 text-center border-t border-neutral-200 dark:border-slate-600">
                        Lead Source
                    </TableHead>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 text-center border-t border-neutral-200 dark:border-slate-600">
                        Assigned To
                    </TableHead>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 text-center border-t border-neutral-200 dark:border-slate-600">
                        Status
                    </TableHead>
                    <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 text-center border-t border-neutral-200 dark:border-slate-600 rounded-tr-lg">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {recentLeads.map((lead, index) => {
                    const isLast = index === recentLeads.length - 1;

                    return (
                        <TableRow key={lead.id}>
                            {/* Lead Info */}
                            <TableCell
                                className={`py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <span className="block font-medium text-base text-neutral-700 dark:text-neutral-200">
                                    {lead.name}
                                </span>
                                <span className="block text-sm text-neutral-500 dark:text-neutral-300">
                                    {lead.id}
                                </span>
                            </TableCell>

                            {/* Contact */}
                            <TableCell className="py-6 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                <div className="text-neutral-700 dark:text-neutral-200">
                                    {lead.email}
                                </div>
                                <div className="text-sm text-neutral-500">{lead.phone}</div>
                            </TableCell>

                            {/* Lead Source */}
                            <TableCell className="py-6 px-4 border-b text-center border-neutral-200 dark:border-slate-600">
                                {lead.leadSource}
                            </TableCell>

                            {/* Assigned To */}
                            <TableCell className="py-6 px-4 border-b text-center border-neutral-200 dark:border-slate-600">
                                {lead.assignedTo}
                            </TableCell>

                            {/* Status */}
                            <TableCell className="py-6 px-4 border-b text-center border-neutral-200 dark:border-slate-600">
                                <Badge variant={lead.statusVariant} className="rounded-full px-5">
                                    {lead.status}
                                </Badge>
                            </TableCell>

                            {/* Action */}
                            <TableCell
                                className={`py-6 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-br-lg" : ""
                                    }`}
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-2xl px-2.5 py-2.5 rounded-lg text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-slate-700 cursor-pointer">
                                        <EllipsisVertical className="w-5 h-5" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default RecentLeadsTable;