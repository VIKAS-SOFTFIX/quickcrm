"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: string;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export function WeekView({ currentDate, events, onSelectEvent }: WeekViewProps) {
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekDates = [];
    
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(diff + i);
      weekDates.push(newDate);
    }
    
    return weekDates;
  };
  
  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };
  
  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="p-4 overflow-auto">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="text-center py-2 text-sm font-medium text-gray-500 border-r border-gray-200">
          Time
        </div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={`text-center py-2 text-sm font-medium ${
              isToday(date) ? "bg-teal-50 text-teal-700" : "text-gray-700"
            }`}
          >
            <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`text-lg font-semibold ${isToday(date) ? "text-teal-700" : ""}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-8">
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-xs text-gray-500 p-2 border-r border-gray-200 h-20">
              {formatHour(hour)}
            </div>
            
            {weekDates.map((date, dateIndex) => {
              const hourEvents = getEventsForDateAndHour(date, hour);
              
              return (
                <div 
                  key={dateIndex}
                  className="border-b border-r border-gray-200 p-1 h-20"
                >
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer mb-1 ${event.color}`}
                      onClick={() => onSelectEvent(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
} 