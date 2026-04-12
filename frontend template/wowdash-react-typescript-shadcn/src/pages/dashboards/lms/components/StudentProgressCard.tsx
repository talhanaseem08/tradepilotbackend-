import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

import StudentImage1 from "@/assets/images/home-six/student-img1.png";
import StudentImage2 from "@/assets/images/home-six/student-img2.png";
import StudentImage3 from "@/assets/images/home-six/student-img3.png";
import StudentImage4 from "@/assets/images/home-six/student-img4.png";
import StudentImage5 from "@/assets/images/home-six/student-img5.png";
import StudentImage6 from "@/assets/images/home-six/student-img6.png";

type Student = {
    id: number;
    name: string;
    course: string;
    image: string;
    progress: number;
};

const students: Student[] = [
    { id: 1, name: "Theresa Webb", course: "UI/UX Design Course", image: StudentImage1, progress: 33 },
    { id: 2, name: "Robert Fox", course: "Graphic Design Course", image: StudentImage2, progress: 70 },
    { id: 3, name: "Guy Hawkins", course: "Web Developer Course", image: StudentImage3, progress: 80 },
    { id: 4, name: "Cody Fisher", course: "UI/UX Design Course", image: StudentImage4, progress: 20 },
    { id: 5, name: "Jacob Jones", course: "UI/UX Design Course", image: StudentImage5, progress: 40 },
    { id: 6, name: "Darlene Robertson", course: "UI/UX Design Course", image: StudentImage6, progress: 24 },
];

const CIRCUMFERENCE = 2 * Math.PI * 35; // 2πr for r=35

const StudentProgressCard: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Student's Progress</h6>
                            <CommonLink />
                        </div>
                    </div>
                    <div className="card-body py-4 px-6">
                        {students.map((student) => {
                            const offset = CIRCUMFERENCE - (CIRCUMFERENCE * student.progress) / 100;
                            return (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between gap-3 mb-6 last:mb-0"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={student.image}
                                            alt={student.name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-lg flex-shrink-0 me-3 overflow-hidden"
                                        />
                                        <div>
                                            <h6 className="sm:text-base text-xs mb-0 font-medium">
                                                {student.name}
                                            </h6>
                                            <span className="text-sm text-neutral-600 dark:text-neutral-100 font-medium">
                                                {student.course}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <svg
                                            className="radial-progress"
                                            viewBox="0 0 80 80"
                                            width={40}
                                            height={40}
                                        >
                                            {/* Background circle */}
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                fill="transparent"
                                                stroke="#e5e7eb" // light gray
                                                strokeWidth="5"
                                            />
                                            {/* Progress circle */}
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                fill="transparent"
                                                stroke="#3b82f6" // blue
                                                strokeWidth="5"
                                                strokeDasharray={CIRCUMFERENCE}
                                                strokeDashoffset={offset}
                                                strokeLinecap="round"
                                                transform="rotate(-90 40 40)" // start at top
                                            />
                                            {/* Percentage text */}
                                            <text
                                                x="50%"
                                                y="50%"
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                fontSize="22"
                                                className="fill-gray-900 dark:fill-white"
                                            >
                                                {student.progress}%
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StudentProgressCard;
