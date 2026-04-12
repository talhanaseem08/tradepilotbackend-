import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { toast } from 'react-toastify';
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";
import ViewEvent from "./ViewEvent";

export interface CalendarEvent {
    id: number;
    title: string;
    label: string;
    color: string;
    startTime: string;
    endTime: string;
    description: string;
}

const eventsData: CalendarEvent[] = [
    { id: 1, title: 'Design Conference', label: 'Holiday', color: 'bg-red-500', startTime: 'Today, 09:00 AM', endTime: "11:00 AM", description: "Discussing new UI/UX trends for Q3" },
    { id: 2, title: 'Weekend Festival', label: 'Personal', color: 'bg-green-600', startTime: 'Today, 01:30 PM', endTime: "04:00 PM", description: "Local music and art festival with friends" },
    { id: 3, title: 'Design Conference', label: 'Business', color: 'bg-cyan-600', startTime: 'Today, 10:15 AM', endTime: "12:45 PM", description: "Team meeting to finalize product roadmap" },
    { id: 4, title: 'Ultra Europe 2019', label: 'Family', color: 'bg-yellow-500', startTime: 'Today, 03:00 PM', endTime: "05:30 PM", description: "Family gathering and weekend planning" },
    { id: 5, title: 'Design Conference', label: 'Important', color: 'bg-violet-600', startTime: 'Today, 06:00 PM', endTime: "08:15 PM", description: "Presentation prep for client pitch" },
];


const CalendarSidebar: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>(eventsData);

    // Add new event
    const handleAddEvent = (newEvent: CalendarEvent) => {
        setEvents((prev) => [...prev, newEvent]);
    };

    // Remove event
    const handleRemoveEvent = (id: number) => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success("Event deleted successfully!");
    };

    // Update event
    const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
    };

    return (
        <Card className="h-full border-0 !p-0 rounded-lg">
            <CardContent className="p-0">
                <div className="p-6">
                    <AddEvent onAddEvent={handleAddEvent} />
                </div>

                <div className="space-y-4 max-h-[700px] overflow-y-auto p-6 pt-0">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-600"
                            >
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <span className={cn("w-3 h-3 rounded-full", event.color)} />
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-800 dark:text-gray-200">
                                                {event.startTime}
                                            </span>
                                            <span>-</span>
                                            <span className="text-gray-800 dark:text-gray-200">
                                                {event.endTime}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-neutral-600 dark:text-neutral-200 font-semibold text-base mt-1.5">
                                        {event.title}
                                    </span>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <EllipsisVertical width={18} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <ViewEvent addOnViewEvent={event} />
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <EditEvent onEditEvent={handleUpdateEvent} event={event} />
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => handleRemoveEvent(event.id)}
                                        >
                                            <Trash /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <span className="text-xl text-neutral-800 ">Event not found!</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CalendarSidebar;