import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

export interface CalendarEvent {
    id: number;
    title: string;
    color: string;
    label: string;
    startTime: string;
    endTime: string;
    description: string;
}

interface ViewEventProps {
    addOnViewEvent: CalendarEvent;
}

const ViewEvent: React.FC<ViewEventProps> = ({ addOnViewEvent }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="cursor-pointer flex items-center gap-2 px-2 py-1 text-neutral-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm">
                    <Eye className="text-neutral-600 dark:text-white w-4" />
                    View
                </span>
            </DialogTrigger>

            <DialogContent className="!max-w-[600px] p-0 gap-0">
                <DialogHeader>
                    <div className="py-4 px-6 border-b border-neutral-200 dark:border-neutral-600">
                        <DialogTitle>View Event</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-6 flex flex-col gap-8">
                    <div className="">
                        <span className="text-neutral-500 dark:text-neutral-300 txt-sm font-medium">Title</span>
                        <h6 className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mb-0 mt-2">{addOnViewEvent.title}</h6>
                    </div>
                    <div className="">
                        <span className="text-neutral-500 dark:text-neutral-300 txt-sm font-medium">Start Date</span>
                        <h6 className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mb-0 mt-2">{addOnViewEvent.startTime}</h6>
                    </div>
                    <div className="">
                        <span className="text-neutral-500 dark:text-neutral-300 txt-sm font-medium">End Date</span>
                        <h6 className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mb-0 mt-2">{addOnViewEvent.endTime}</h6>
                    </div>
                    <div className="">
                        <span className="text-neutral-500 dark:text-neutral-300 txt-sm font-medium">Description</span>
                        <h6 className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mb-0 mt-2">{addOnViewEvent.description}</h6>
                    </div>
                    <div className="">
                        <span className="text-neutral-500 dark:text-neutral-300 txt-sm font-medium">Label</span>
                        <h6
                            className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mb-0 mt-2 flex items-center gap-2">
                            <span className={cn(`w-3 h-3 rounded-full ${addOnViewEvent.color}`)}></span>
                            {addOnViewEvent.label}
                        </h6>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewEvent;