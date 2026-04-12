import UserImage1 from "@/assets/images/users/user1.png";
import UserImage2 from "@/assets/images/users/user2.png";
import UserImage3 from "@/assets/images/users/user3.png";
import UserImage4 from "@/assets/images/users/user4.png";
import UserImage5 from "@/assets/images/users/user5.png";
import CommonLink from '@/components/shared/CommonLink';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from "lucide-react";
import React from "react";

interface Instructor {
    id: number;
    name: string;
    agentId: string;
    image: string;
    reviews: number;
    rating: number;
}

const instructors: Instructor[] = [
    {
        id: 1,
        name: "Dianne Russell",
        agentId: "36254",
        image: UserImage1,
        reviews: 25,
        rating: 5,
    },
    {
        id: 2,
        name: "Wade Warren",
        agentId: "36254",
        image: UserImage2,
        reviews: 25,
        rating: 5,
    },
    {
        id: 3,
        name: "Albert Flores",
        agentId: "36254",
        image: UserImage3,
        reviews: 25,
        rating: 5,
    },
    {
        id: 4,
        name: "Bessie Cooper",
        agentId: "36254",
        image: UserImage4,
        reviews: 25,
        rating: 5,
    },
    {
        id: 5,
        name: "Arlene McCoy",
        agentId: "36254",
        image: UserImage5,
        reviews: 25,
        rating: 5,
    },
    {
        id: 6,
        name: "Arlene McCoy",
        agentId: "36254",
        image: UserImage1,
        reviews: 25,
        rating: 5,
    },
];

const TopInstructorsCard: React.FC = () => {
    return (

        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div className="">
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Top Instructors</h6>
                            <CommonLink />
                        </div>
                    </div>

                    <div className="card-body py-4 px-6">
                        {instructors.map((instructor, index) => (
                            <div
                                key={instructor.id}
                                className={`flex items-center justify-between gap-3 ${index === instructors.length - 1 ? "" : "mb-6"
                                    }`}
                            >
                                {/* Instructor Info */}
                                <div className="flex items-center">
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden"
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="sm:text-base text-xs mb-0 font-medium">
                                            {instructor.name}
                                        </h6>
                                        <span className="text-sm text-neutral-600 dark:text-neutral-100 font-medium">
                                            Agent ID: {instructor.agentId}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating & Reviews */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        {Array.from({ length: instructor.rating }).map((_, i) => (
                                            <span
                                                key={i}
                                                className="text-lg text-yellow-500 dark:text-yellow-500 flex line-height-1"
                                            >
                                                <Star className="w-4 h-4" />
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-neutral-600 dark:text-neutral-100 text-sm block text-right">
                                        {instructor.reviews} Reviews
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopInstructorsCard;