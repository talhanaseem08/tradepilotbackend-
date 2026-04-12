import UserGridImage1 from "@/assets/images/user-grid/user-grid-img1.png";
import UserGridImage2 from "@/assets/images/user-grid/user-grid-img2.png";
import UserGridImage3 from "@/assets/images/user-grid/user-grid-img3.png";
import UserGridImage4 from "@/assets/images/user-grid/user-grid-img4.png";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

interface UserData {
    name: string;
    role: string;
    status: "Active" | "Pending" | "Inactive";
    image: string;
}

const usersData: UserData[] = [
    {
        name: "Psychiatry",
        role: "Super Admin",
        status: "Pending",
        image: UserGridImage1,
    },
    {
        name: "Orthopedic",
        role: "Admin",
        status: "Active",
        image: UserGridImage2,
    },
    {
        name: "Cardiology",
        role: "Manager",
        status: "Active",
        image: UserGridImage3,
    },
    {
        name: "Pediatrics",
        role: "Admin",
        status: "Active",
        image: UserGridImage4,
    },
    {
        name: "Neurology",
        role: "Manager",
        status: "Active",
        image: UserGridImage1,
    },
];

// Status colors mapping
const statusClasses: Record<UserData["status"], string> = {
    Active: "text-green-500 dark:text-green-500",
    Pending: "text-yellow-500 dark:text-yellow-500",
    Inactive: "text-neutral-400 dark:text-neutral-400",
};

const UsersCard: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Users</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="flex flex-col gap-7 p-6">
                        {usersData.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={user.image}
                                        alt={`${user.name} Image`}
                                        className="w-10 h-10 rounded-circle shrink-0 me-3 overflow-hidden"
                                    />
                                    <div className="grow">
                                        <h6 className="text-base mb-0">{user.name}</h6>
                                        <span className="text-sm text-neutral-600 dark:text-neutral-300 font-normal">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`${statusClasses[user.status]} font-medium text-base`}
                                >
                                    {user.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UsersCard;