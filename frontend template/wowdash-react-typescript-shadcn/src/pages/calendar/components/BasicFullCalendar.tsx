import { Card, CardContent } from "@/components/ui/card";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import type { EventClickArg, EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function BasicFullCalendar() {
  const [events, setEvents] = useState<EventInput[]>([
    {
      id: uuidv4(),
      title: "Team Meeting",
      start: "2025-08-13T10:00:00",
    },
    {
      id: uuidv4(),
      title: "Project Deadline",
      start: "2025-08-15",
    },
  ]);

  // Add event
  const handleDateClick = (arg: DateClickArg) => {
    const title = window.prompt("Enter Event Title");
    if (!title) return;

    setEvents((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title,
        start: arg.dateStr,
      },
    ]);
  };

  // Edit / Delete event
  const handleEventClick = (arg: EventClickArg) => {
    const newTitle = window.prompt(
      "Edit Event Title",
      arg.event.title
    );

    if (newTitle === null) return;

    if (newTitle.trim() === "") {
      if (window.confirm("Delete this event?")) {
        setEvents((prev) =>
          prev.filter((e) => e.id !== arg.event.id)
        );
      }
      return;
    }

    setEvents((prev) =>
      prev.map((e) =>
        e.id === arg.event.id ? { ...e, title: newTitle } : e
      )
    );
  };

  return (
    <Card className="h-full rounded-lg border-0 py-0">
      <CardContent className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable
          editable
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </CardContent>
    </Card>
  );
}
