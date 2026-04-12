import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface AppointmentTableContent {
    name: string;
    id: string;
    date: string;
    status: {
        label: string;
        type: "success" | "danger";
    };
}
const latestAppointmentContents: AppointmentTableContent[] = [
    {
        name: "General Checkup",
        id: "#63254",
        date: "27 Mar 2024",
        status: {
            label: "Completed",
            type: "success"
        },
    },
    {
        name: "Blood test results",
        id: "3.053 ETH",
        date: "2h 5m 40s",
        status: {
            label: "Canceled",
            type: "danger"
        },
    },
    {
        name: "Heart Checkup",
        id: "3.053 ETH",
        date: "2h 5m 40s",
        status: {
            label: "Completed",
            type: "success"
        },
    },
    {
        name: "Vaccination",
        id: "3.053 ETH",
        date: "2h 5m 40s",
        status: {
            label: "Canceled",
            type: "danger"
        },
    },
    {
        name: "Dental Cleanup",
        id: "3.053 ETH",
        date: "2h 5m 40s",
        status: {
            label: "Completed",
            type: "success"
        },
    },
    {
        name: "Follow up Appointment",
        id: "3.053 ETH",
        date: "2h 5m 40s",
        status: {
            label: "Canceled",
            type: "danger"
        },
    },
    {
        name: "General Checkup",
        id: "#63254",
        date: "27 Mar 2024",
        status: {
            label: "Completed",
            type: "success"
        },
    },
];

const LatestAppointmentsTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-start rounded-tl-lg">
                        Name
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        ID
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Date
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {latestAppointmentContents.map((coursesContent, index) => {
                    const isLast = index === latestAppointmentContents.length - 1;
                    return (
                        <TableRow key={index}>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-start ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.name}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.id}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.date}
                            </TableCell>

                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-100">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg font-medium text-sm ${coursesContent.status.type === "success"
                                            ? "bg-green-500/15 text-green-600 dark:text-green-600"
                                            : "bg-red-500/15 text-red-600 dark:text-red-600"
                                            }`}
                                    >
                                        {coursesContent.status.label}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default LatestAppointmentsTable;






