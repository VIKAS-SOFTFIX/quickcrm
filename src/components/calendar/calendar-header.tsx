"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCreateEvent: () => void;
  viewOptions: string[];
  currentView: string;
  onChangeView: (view: string) => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onCreateEvent,
  viewOptions,
  currentView,
  onChangeView,
}: CalendarHeaderProps) {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center">
        <div className="p-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 mr-3">
          <CalendarIcon className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold">{formatMonthYear(currentMonth)}</h1>
        <div className="flex items-center ml-4">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          {viewOptions.map((view) => (
            <button
              key={view}
              onClick={() => onChangeView(view)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === view
                  ? "bg-white shadow-sm text-teal-700"
                  : "text-gray-600 hover:text-teal-700"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </button>
      </div>
    </div>
  );
} 