import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";


import UserImg1 from "@/assets/images/users/user1.png";
import UserImg2 from "@/assets/images/users/user2.png";
import UserImg3 from "@/assets/images/users/user3.png";
import UserImg4 from "@/assets/images/users/user4.png";
import UserImg5 from "@/assets/images/users/user5.png";

interface TransactionsDataType {
  name: string;
  email: string;
  image: string;
  registered: string;
  plan: string;
  status: "Active" | "Inactive";
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

const users: TransactionsDataType[] = [
  {
    name: "Jonathan Miller",
    email: "jonathan.miller@example.com",
    image: UserImg1,
    registered: "12 Dec 2024",
    plan: "Premium",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Sophia Bennett",
    email: "sophia.bennett@mail.com",
    image: UserImg2,
    registered: "10 Dec 2024",
    plan: "Standard",
    statusVariant: "warning",
    status: "Active",
  },
  {
    name: "Carlos Ramirez",
    email: "carlos.ramirez@outlook.com",
    image: UserImg3,
    registered: "08 Dec 2024",
    plan: "Free",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Emma Thompson",
    email: "emma.tpsn@gmail.com",
    image: UserImg4,
    registered: "05 Dec 2024",
    plan: "Business",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Michael Anderson",
    email: "michael.anderson@mail.ru",
    image: UserImg5,
    registered: "02 Dec 2024",
    plan: "Enterprise",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Laura Collins",
    email: "laura.c@company.com",
    image: UserImg2,
    registered: "30 Nov 2024",
    plan: "Standard",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Samuel Clark",
    email: "samuel.clark@gmail.com",
    image: UserImg3,
    registered: "28 Nov 2024",
    plan: "Premium",
    statusVariant: "danger",
    status: "Inactive",
  },
  {
    name: "Ava Mitchell",
    email: "ava.mitchell@example.com",
    image: UserImg4,
    registered: "26 Nov 2024",
    plan: "Business",
    statusVariant: "success",
    status: "Active",
  },
  {
    name: "Oliver Brown",
    email: "oliver.brown@mail.com",
    image: UserImg5,
    registered: "24 Nov 2024",
    plan: "Free",
    statusVariant: "warning",
    status: "Active",
  },
  {
    name: "Isabella Carter",
    email: "isabella.carter@gmail.com",
    image: UserImg1,
    registered: "22 Nov 2024",
    plan: "Enterprise",
    statusVariant: "success",
    status: "Active",
  },
];


const LatestSubscribeTable = () => {
  const slicedUsers = users.slice(0, 5);

  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
            Users
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
            Registered On
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
            Plan
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {slicedUsers.map((user, index) => {
          const isLastRow = index === slicedUsers.length - 1;
          return (
            <TableRow key={index}>
              <TableCell
                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full shrink-0 me-2 overflow-hidden"
                  />
                  <div>
                    <h6 className="text-base mb-0 font-medium">{user.name}</h6>
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell
                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                {user.registered}
              </TableCell>
              <TableCell
                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                  isLastRow ? "rounded-bl-lg" : ""
                }`}
              >
                {user.plan}
              </TableCell>
              <TableCell
                className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                  isLastRow ? "rounded-br-lg" : ""
                } text-center`}
              >
                <Badge variant={user.statusVariant} className="rounded-[50rem]">
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LatestSubscribeTable;
