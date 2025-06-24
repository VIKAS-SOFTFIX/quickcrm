"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: string;
  description?: string;
  location?: string;
  participants?: string[];
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export function DayView({ currentDate, events, onSelectEvent }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };
  
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };
  
  const formatEventTime = (event: Event) => {
    const startTime = event.start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const endTime = event.end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${startTime} - ${endTime}`;
  };

  return (
    <Card className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
      </div>
      
      <div className="space-y-4">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          if (hourEvents.length === 0) {
            return (
              <div key={hour} className="flex items-start gap-4 py-2 border-b border-gray-100">
                <div className="w-16 text-sm text-gray-500 font-medium">
                  {formatHour(hour)}
                </div>
                <div className="flex-1 h-12 border-l-2 border-gray-100 pl-4"></div>
              </div>
            );
          }
          
          return (
            <div key={hour} className="flex items-start gap-4 py-2 border-b border-gray-100">
              <div className="w-16 text-sm text-gray-500 font-medium">
                {formatHour(hour)}
              </div>
              <div className="flex-1 space-y-2">
                {hourEvents.map(event => (
                  <div 
                    key={event.id}
                    className={`p-3 rounded-lg cursor-pointer ${event.color} hover:opacity-90 transition-opacity`}
                    onClick={() => onSelectEvent(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs flex items-center mt-1 opacity-80">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatEventTime(event)}
                    </div>
                    {event.location && (
                      <div className="text-xs mt-1 opacity-80">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 