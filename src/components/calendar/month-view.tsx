"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: string;
}

interface MonthViewProps {
  currentMonth: Date;
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export function MonthView({ currentMonth, events, onSelectEvent }: MonthViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const rows = Math.ceil((daysCount + firstDayOfMonth) / 7);
    const cells = [];

    let day = 1;
    const today = new Date();
    const isToday = (date: Date) => {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const getEventsForDate = (date: Date) => {
      return events.filter(
        (event) =>
          event.start.getDate() === date.getDate() &&
          event.start.getMonth() === date.getMonth() &&
          event.start.getFullYear() === date.getFullYear()
      );
    };

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > daysCount) {
          row.push(<div key={`empty-${i}-${j}`} className="border border-gray-200 h-28"></div>);
        } else {
          const date = new Date(year, month, day);
          const dateEvents = getEventsForDate(date);
          const isSelected = selectedDate && 
            date.getDate() === selectedDate.getDate() && 
            date.getMonth() === selectedDate.getMonth() && 
            date.getFullYear() === selectedDate.getFullYear();

          row.push(
            <div
              key={day}
              className={`border border-gray-200 h-28 p-1 overflow-hidden transition-colors ${
                isToday(date) ? "bg-teal-50" : ""
              } ${isSelected ? "ring-2 ring-teal-500 ring-inset" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                    isToday(date) ? "bg-teal-500 text-white" : ""
                  }`}
                >
                  {day}
                </span>
                {dateEvents.length > 3 && (
                  <span className="text-xs text-gray-500">+{dateEvents.length - 2} more</span>
                )}
              </div>
              <div className="space-y-1">
                {dateEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded truncate cursor-pointer ${event.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
          day++;
        }
      }
      cells.push(
        <div key={`row-${i}`} className="grid grid-cols-7">
          {row}
        </div>
      );
    }
    return cells;
  };

  return (
    <Card className="p-4">
      {renderDays()}
      <div className="grid gap-px">{renderCells()}</div>
    </Card>
  );
} 