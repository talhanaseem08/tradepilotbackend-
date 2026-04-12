import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { ChevronRight, EllipsisVertical } from "lucide-react";

import UserGridBg1 from "@/assets/images/user-grid/user-grid-bg1.png";
import UserGridBg10 from "@/assets/images/user-grid/user-grid-bg10.png";
import UserGridBg11 from "@/assets/images/user-grid/user-grid-bg11.png";
import UserGridBg12 from "@/assets/images/user-grid/user-grid-bg12.png";
import UserGridBg2 from "@/assets/images/user-grid/user-grid-bg2.png";
import UserGridBg3 from "@/assets/images/user-grid/user-grid-bg3.png";
import UserGridBg4 from "@/assets/images/user-grid/user-grid-bg4.png";
import UserGridBg5 from "@/assets/images/user-grid/user-grid-bg5.png";
import UserGridBg6 from "@/assets/images/user-grid/user-grid-bg6.png";
import UserGridBg7 from "@/assets/images/user-grid/user-grid-bg7.png";
import UserGridBg8 from "@/assets/images/user-grid/user-grid-bg8.png";
import UserGridBg9 from "@/assets/images/user-grid/user-grid-bg9.png";

import UserGridImg1 from "@/assets/images/user-grid/user-grid-img1.png";
import UserGridImg10 from "@/assets/images/user-grid/user-grid-img10.png";
import UserGridImg11 from "@/assets/images/user-grid/user-grid-img11.png";
import UserGridImg12 from "@/assets/images/user-grid/user-grid-img12.png";
import UserGridImg2 from "@/assets/images/user-grid/user-grid-img2.png";
import UserGridImg3 from "@/assets/images/user-grid/user-grid-img3.png";
import UserGridImg4 from "@/assets/images/user-grid/user-grid-img4.png";
import UserGridImg5 from "@/assets/images/user-grid/user-grid-img5.png";
import UserGridImg6 from "@/assets/images/user-grid/user-grid-img6.png";
import UserGridImg7 from "@/assets/images/user-grid/user-grid-img7.png";
import UserGridImg8 from "@/assets/images/user-grid/user-grid-img8.png";
import UserGridImg9 from "@/assets/images/user-grid/user-grid-img9.png";

export interface UserData {
    id: number;
    name: string;
    email: string;
    department: string;
    designation: string;
    bgImage: string;
    avatar: string;
}

const usersData: UserData[] = [
    {
        id: 1,
        name: "Jacob Jones",
        email: "jacob.jones@example.com",
        department: "Design",
        designation: "UI UX Designer",
        bgImage: UserGridBg1,
        avatar: UserGridImg1,
    },
    {
        id: 2,
        name: "Darrell Steward",
        email: "darrell.steward@example.com",
        department: "Marketing",
        designation: "Content Strategist",
        bgImage: UserGridBg2,
        avatar: UserGridImg2,
    },
    {
        id: 3,
        name: "Jerome Bell",
        email: "jerome.bell@example.com",
        department: "Engineering",
        designation: "Frontend Developer",
        bgImage: UserGridBg3,
        avatar: UserGridImg3,
    },
    {
        id: 4,
        name: "Marvin McKinney",
        email: "marvin.mckinney@example.com",
        department: "Engineering",
        designation: "Backend Developer",
        bgImage: UserGridBg4,
        avatar: UserGridImg4,
    },
    {
        id: 5,
        name: "Kristin Watson",
        email: "kristin.watson@example.com",
        department: "HR",
        designation: "Recruiter",
        bgImage: UserGridBg5,
        avatar: UserGridImg5,
    },
    {
        id: 6,
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        department: "Design",
        designation: "Graphic Designer",
        bgImage: UserGridBg6,
        avatar: UserGridImg6,
    },
    {
        id: 7,
        name: "Ronald Richards",
        email: "ronald.richards@example.com",
        department: "Finance",
        designation: "Accountant",
        bgImage: UserGridBg7,
        avatar: UserGridImg7,
    },
    {
        id: 8,
        name: "Kathryn Murphy",
        email: "kathryn.murphy@example.com",
        department: "Operations",
        designation: "Operations Manager",
        bgImage: UserGridBg8,
        avatar: UserGridImg8,
    },
    {
        id: 9,
        name: "Cody Fisher",
        email: "cody.fisher@example.com",
        department: "Support",
        designation: "Support Engineer",
        bgImage: UserGridBg9,
        avatar: UserGridImg9,
    },
    {
        id: 10,
        name: "Annette Black",
        email: "annette.black@example.com",
        department: "Legal",
        designation: "Legal Advisor",
        bgImage: UserGridBg10,
        avatar: UserGridImg10,
    },
    {
        id: 11,
        name: "Eleanor Pena",
        email: "eleanor.pena@example.com",
        department: "Admin",
        designation: "Office Admin",
        bgImage: UserGridBg11,
        avatar: UserGridImg11,
    },
    {
        id: 12,
        name: "Guy Hawkins",
        email: "guy.hawkins@example.com",
        department: "IT",
        designation: "IT Support",
        bgImage: UserGridBg12,
        avatar: UserGridImg12,
    },
];

const UsersGridCard = () => {
    return (
        usersData.map((userItem, index) => {
            return (
                <div className="user-grid-card" key={index}>
                    <div className="relative border border-neutral-200 dark:border-neutral-600 rounded-2xl overflow-hidden">
                        <div className="relative h-[127px]">
                            <img src={userItem.bgImage} alt="Image" className="w-full object-fit-cover" />

                        </div>

                        <div className="dropdown absolute top-0 end-0 me-4 mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='bg-gradient-to-r from-white/50 w-8 h-8 rounded-lg border border-light-white flex justify-center items-center text-white'>
                                    <EllipsisVertical className="h-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="pe-6 pb-4 ps-6 text-center mt--50 relative z-[1]">
                            <img src={userItem.avatar} alt="Image" width={100} height={100} className="border br-white border-width-2-px w-[100px] h-[100px] ms-auto me-auto -mt-[50px] rounded-full object-fit-cover" />
                            <h6 className="text-lg mb-0 mt-1.5">{userItem.name}</h6>
                            <span className="text-neutral-500 dark:text-neutral-300 mb-4 block">{userItem.email}</span>

                            <div className="center-border relative bg-gradient-to-r from-red-500/10 to-red-50/25 rounded-lg p-3 flex items-center gap-4 before:absolute before:w-px before:h-full before:z-[1] before:bg-neutral-200 dark:before:bg-neutral-500 before:start-1/2">
                                <div className="text-center w-1/2">
                                    <h6 className="text-base mb-0">{userItem.department}</h6>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-0">Department</span>
                                </div>
                                <div className="text-center w-1/2">
                                    <h6 className="text-base mb-0">{userItem.designation}</h6>
                                    <span className="text-neutral-500 dark:text-neutral-300 text-sm mb-0">Designation</span>
                                </div>
                            </div>
                            <Button className={cn(`bg-blue-50 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white dark:bg-primary/25 text-primary dark:text-blue-400 text-sm px-3 py-3 rounded-lg flex items-center justify-center mt-4 font-medium gap-2 w-full h-12`)}>
                                View Profile
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )
        })
    );
};

export default UsersGridCard;