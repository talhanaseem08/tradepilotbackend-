import UserGridImage1 from "@/assets/images/user-grid/user-grid-img1.png";
import UserGridImage2 from "@/assets/images/user-grid/user-grid-img2.png";
import UserGridImage3 from "@/assets/images/user-grid/user-grid-img3.png";
import UserGridImage4 from "@/assets/images/user-grid/user-grid-img4.png";
import UserGridImage5 from "@/assets/images/user-grid/user-grid-img5.png";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ActivityStatus {
    label: string;
    type: "success" | "warning" | "purple";
}

interface RecentActivityItem {
    customer: {
        name: string;
        email: string;
        image: string;
    };
    id: string;
    retained: string;
    amount: string;
    status: ActivityStatus;
}

const recentActivityTableContents: RecentActivityItem[] = [
    {
        customer: {
            name: "Kristin Watson",
            email: "ulfaha@mail.ru",
            image: UserGridImage1,
        },
        id: "#63254",
        retained: "5 min ago",
        amount: "$12,408.12",
        status: { label: "Member", type: "success" },
    },
    {
        customer: {
            name: "Theresa Webb",
            email: "joie@gmail.com",
            image: UserGridImage2,
        },
        id: "#63254",
        retained: "12 min ago",
        amount: "$12,408.12",
        status: { label: "New Customer", type: "purple" },
    },
    {
        customer: {
            name: "Brooklyn Simmons",
            email: "warn@mail.ru",
            image: UserGridImage3,
        },
        id: "#63254",
        retained: "15 min ago",
        amount: "$12,408.12",
        status: { label: "Signed Up", type: "warning" },
    },
    {
        customer: {
            name: "Robert Fox",
            email: "fellora@mail.ru",
            image: UserGridImage4,
        },
        id: "#63254",
        retained: "17 min ago",
        amount: "$12,408.12",
        status: { label: "Member", type: "success" },
    },
    {
        customer: {
            name: "Jane Cooper",
            email: "zitka@mail.ru",
            image: UserGridImage5,
        },
        id: "#63254",
        retained: "25 min ago",
        amount: "$12,408.12",
        status: { label: "Signed Up", type: "warning" },
    },
];

const RecentActivityTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-start">
                        Customer
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        ID
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Retained
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Amount
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 text-base px-6 h-16 text-center">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentActivityTableContents.map((item, index) => (
                    <TableRow key={index}>
                        {/* Customer */}
                        <TableCell className="py-3.5 px-6 text-start">
                            <div className="flex items-center">
                                <img
                                    src={item.customer.image}
                                    alt={item.customer.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full me-3"
                                />
                                <div>
                                    <h6 className="text-base mb-0">{item.customer.name}</h6>
                                    <span className="text-sm text-neutral-600 dark:text-neutral-200 font-medium">
                                        {item.customer.email}
                                    </span>
                                </div>
                            </div>
                        </TableCell>

                        {/* ID */}
                        <TableCell className="py-3.5 px-6 text-center">{item.id}</TableCell>

                        {/* Retained */}
                        <TableCell className="py-3.5 px-6 text-center">{item.retained}</TableCell>

                        {/* Amount */}
                        <TableCell className="py-3.5 px-6 text-center">{item.amount}</TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5 px-6 text-center">
                            <span
                                className={`px-2.5 py-1 rounded-lg font-medium text-sm
                                    ${item.status.type === "success" && "bg-green-500/15 text-green-600 dark:text-green-600"}
                                    ${item.status.type === "warning" && "bg-yellow-500/15 text-yellow-600 dark:text-yellow-600"}
                                    ${item.status.type === "purple" && "bg-purple-500/15 text-purple-600 dark:text-purple-600"}
                                `}
                            >
                                {item.status.label}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RecentActivityTable;
