"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Check, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: string;
  location?: string;
  description?: string;
}

interface TimeAvailabilityProps {
  events: Event[];
}

export function TimeAvailability({ events }: TimeAvailabilityProps) {
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [date, setDate] = useState<string>(formatDateForInput(new Date()));
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [availability, setAvailability] = useState<"free" | "busy" | null>(null);

  const checkAvailability = () => {
    // Parse the selected date and times
    const [year, month, day] = date.split('-').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
    const endDateTime = new Date(year, month - 1, day, endHour, endMinute);
    
    // Check for conflicts with existing events
    const conflict = events.some(event => {
      // Check if the selected time overlaps with any event
      return (
        (startDateTime >= event.start && startDateTime < event.end) ||
        (endDateTime > event.start && endDateTime <= event.end) ||
        (startDateTime <= event.start && endDateTime >= event.end)
      );
    });
    
    setAvailability(conflict ? "busy" : "free");
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Check Availability</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={checkAvailability}
          className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-md hover:from-teal-600 hover:to-emerald-600 transition-colors"
        >
          Check Availability
        </button>
        
        {availability && (
          <div className={`mt-4 p-3 rounded-lg flex items-center ${
            availability === "free" 
              ? "bg-emerald-100 text-emerald-800" 
              : "bg-rose-100 text-rose-800"
          }`}>
            {availability === "free" ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                <span>This time slot is available!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 mr-2" />
                <span>This time slot conflicts with an existing event.</span>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 