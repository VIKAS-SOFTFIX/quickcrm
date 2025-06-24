"use client";

import React, { useState } from "react";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { DayView } from "@/components/calendar/day-view";
import { EventModal } from "@/components/calendar/event-modal";
import { TimeAvailability } from "@/components/calendar/time-availability";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: string;
  location?: string;
  description?: string;
  participants?: string[];
}

// Helper function to create dates for sample events
const createDate = (dayOffset: number, hours: number, minutes: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Sample event data
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Product Demo with TechGiant",
    start: createDate(0, 10, 0),
    end: createDate(0, 11, 0),
    color: "bg-teal-100 text-teal-800",
    type: "demo",
    location: "Zoom Meeting",
    description: "Present new AI features to their marketing team.",
  },
  {
    id: "2",
    title: "Client Call with Acme Corp",
    start: createDate(0, 14, 0),
    end: createDate(0, 14, 30),
    color: "bg-blue-100 text-blue-800",
    type: "call",
  },
  {
    id: "3",
    title: "Team Weekly Sync",
    start: createDate(0, 9, 0),
    end: createDate(0, 10, 0),
    color: "bg-purple-100 text-purple-800",
    type: "meeting",
    location: "Conference Room A",
  },
  {
    id: "4",
    title: "Follow-up with InnovateTech",
    start: createDate(1, 11, 0),
    end: createDate(1, 11, 30),
    color: "bg-amber-100 text-amber-800",
    type: "call",
  },
  {
    id: "5",
    title: "Quarterly Business Review",
    start: createDate(2, 13, 0),
    end: createDate(2, 15, 0),
    color: "bg-rose-100 text-rose-800",
    type: "meeting",
    location: "Main Conference Room",
    description: "Review Q2 performance and discuss Q3 goals.",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("Month");
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (currentView === "Month") {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (currentView === "Week") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() - 1);
      }
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (currentView === "Month") {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (currentView === "Week") {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsNewEvent(true);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsNewEvent(false);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (isNewEvent) {
      setEvents([...events, event]);
    } else {
      setEvents(events.map(e => e.id === event.id ? event : e));
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (event: Event) => {
    setEvents(events.filter(e => e.id !== event.id));
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <CalendarHeader
        currentMonth={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onCreateEvent={handleCreateEvent}
        viewOptions={["Month", "Week", "Day"]}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-3">
          {currentView === "Month" && (
            <MonthView
              currentMonth={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {currentView === "Week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {currentView === "Day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <TimeAvailability events={events} />
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .filter(event => event.start > new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 5)
                .map(event => (
                  <div 
                    key={event.id}
                    className={`p-3 rounded-lg cursor-pointer ${event.color}`}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs mt-1">
                      {event.start.toLocaleDateString()} at {event.start.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        isNewEvent={isNewEvent}
      />
    </div>
  );
} 