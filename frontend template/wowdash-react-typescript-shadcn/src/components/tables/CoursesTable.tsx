import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface coursesTableContent {
    registered: string;
    instructors: string;
    usersTitle: string;
    usersLesson: string;
    enrolled: string;
    price: string;
};

const coursesContents: coursesTableContent[] = [
    {
        registered: "30 Jun 2024",
        instructors: "Ronald Richards",
        usersTitle: "3d Illustration & Art Design",
        usersLesson: "34 Lessons",
        enrolled: "257",
        price: "$29.00",
    },
    {
        registered: "13 Jun 2024",
        instructors: "Jerome Bell",
        usersTitle: "3dAdvanced JavaScript Development",
        usersLesson: "20 Lessons",
        enrolled: "375",
        price: "$12.00",
    },
    {
        registered: "24 Jun 2024",
        instructors: "Cody Fisher",
        usersTitle: "Portrait Drawing Fundamentals",
        usersLesson: "16 Lessons",
        enrolled: "220",
        price: "$61.00",
    },
    {
        registered: "23 Jun 2024",
        instructors: "Floyd Miles",
        usersTitle: "Advanced App Development",
        usersLesson: "25 Lessons",
        enrolled: "57",
        price: "$14.00",
    },
    {
        registered: "31 Jun 2024",
        instructors: "Ralph Edwards",
        usersTitle: "HTML Fundamental Course",
        usersLesson: "17 Lessons ",
        enrolled: "27",
        price: "$62.00",
    },
];

const CoursesTable = () => {
    return (
        <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
                <TableRow className="border-0">
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-start rounded-tl-lg">
                        Registered On
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Instructors
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Users
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
                        Enrolled
                    </TableHead>
                    <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
                        Price
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {coursesContents.map((coursesContent, index) => {
                    const isLast = index === coursesContents.length - 1;
                    return (
                        <TableRow key={index}>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-start ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.registered}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                {coursesContent.instructors}
                            </TableCell>
                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-100">
                                    <h6 className="text-base mb-0 font-normal">{coursesContent.usersTitle}</h6>
                                    <span className="text-sm font-normal">{coursesContent.usersLesson}</span>
                                </div>
                            </TableCell>

                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-100">
                                    <span className="text-sm font-normal">{coursesContent.enrolled}</span>
                                </div>
                            </TableCell>

                            <TableCell
                                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-100">
                                    <span className="text-sm font-normal">{coursesContent.price}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default CoursesTable;
