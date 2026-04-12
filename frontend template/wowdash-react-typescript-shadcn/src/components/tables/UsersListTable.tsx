import UserList1 from "@/assets/images/user-list/user-list1.png";
import UserList10 from "@/assets/images/user-list/user-list10.png";
import UserList2 from "@/assets/images/user-list/user-list2.png";
import UserList3 from "@/assets/images/user-list/user-list3.png";
import UserList4 from "@/assets/images/user-list/user-list4.png";
import UserList5 from "@/assets/images/user-list/user-list5.png";
import UserList6 from "@/assets/images/user-list/user-list6.png";
import UserList7 from "@/assets/images/user-list/user-list7.png";
import UserList8 from "@/assets/images/user-list/user-list8.png";
import UserList9 from "@/assets/images/user-list/user-list9.png";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    department: string;
    designation: string;
    status: "Active" | "Inactive";
    joinDate: string;
    avatar: string;
};

const users: User[] = [
    {
        id: "1",
        name: "Kathryn Murphy",
        email: "osgoodwy@gmail.com",
        department: "HR",
        designation: "Manager",
        status: "Active",
        joinDate: "25 Jan 2024",
        avatar: UserList1,
    },
    {
        id: "2",
        name: "Annette Black",
        email: "redaniel@gmail.com",
        department: "Design",
        designation: "UI UX Designer",
        status: "Inactive",
        joinDate: "25 Jan 2024",
        avatar: UserList2,
    },
    {
        id: "3",
        name: "Darlene Robertson",
        email: "darlene.robertson@example.com",
        department: "Engineering",
        designation: "Frontend Developer",
        status: "Active",
        joinDate: "12 Mar 2023",
        avatar: UserList3,
    },
    {
        id: "4",
        name: "Cameron Williamson",
        email: "cameron.williamson@example.com",
        department: "Engineering",
        designation: "Backend Developer",
        status: "Inactive",
        joinDate: "08 Aug 2022",
        avatar: UserList4,
    },
    {
        id: "5",
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        department: "Finance",
        designation: "Accountant",
        status: "Active",
        joinDate: "15 Oct 2023",
        avatar: UserList5,
    },
    {
        id: "6",
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        department: "Marketing",
        designation: "Marketing Specialist",
        status: "Active",
        joinDate: "01 Jun 2023",
        avatar: UserList6,
    },
    {
        id: "7",
        name: "Brooklyn Simmons",
        email: "brooklyn.simmons@example.com",
        department: "Operations",
        designation: "Operations Manager",
        status: "Inactive",
        joinDate: "20 Feb 2022",
        avatar: UserList7,
    },
    {
        id: "8",
        name: "Jerome Bell",
        email: "jerome.bell@example.com",
        department: "Sales",
        designation: "Sales Executive",
        status: "Active",
        joinDate: "30 Nov 2023",
        avatar: UserList8,
    },
    {
        id: "9",
        name: "Floyd Miles",
        email: "floyd.miles@example.com",
        department: "Customer Support",
        designation: "Support Specialist",
        status: "Active",
        joinDate: "10 Sep 2023",
        avatar: UserList9,
    },
    {
        id: "10",
        name: "Savannah Nguyen",
        email: "savannah.nguyen@example.com",
        department: "Legal",
        designation: "Legal Advisor",
        status: "Inactive",
        joinDate: "18 Dec 2022",
        avatar: UserList10,
    },
    {
        id: "11",
        name: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        department: "Admin",
        designation: "Office Administrator",
        status: "Active",
        joinDate: "05 May 2024",
        avatar: UserList4,
    },
    {
        id: "12",
        name: "Devon Lane",
        email: "devon.lane@example.com",
        department: "IT",
        designation: "System Analyst",
        status: "Inactive",
        joinDate: "22 Jul 2021",
        avatar: UserList2,
    },
];

export default function UsersListTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">S.L</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Join Date</TableHead>
                    <TableHead className="px-4 h-12 text-start bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Name</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Email</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Department</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Designation</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 text-center">Status</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 text-center rounded-tr-lg">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user, index) => {
                    const isLast = index === users.length - 1;
                    return (
                        <TableRow key={user.id}>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{String(index + 1).padStart(2, "0")}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.joinDate}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span>{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.email}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.department}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.designation}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <span
                                    className={`px-3 py-1.5 rounded text-sm font-medium border ${user.status === "Active"
                                        ? "bg-green-600/15 text-green-600 border-green-600"
                                        : "bg-gray-600/15 text-gray-600 dark:text-white border-gray-400"
                                        }`}
                                >
                                    {user.status}
                                </span>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex justify-center gap-2">
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10">
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-green-600 bg-green-600/10">
                                        <Edit className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-red-500 bg-red-500/10">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
}
