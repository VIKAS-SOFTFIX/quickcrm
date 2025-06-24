"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlignLeft, 
  Tag,
  X,
  Trash2,
} from "lucide-react";

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

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (event: Event) => void;
  isNewEvent?: boolean;
}

export function EventModal({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  isNewEvent = false
}: EventModalProps) {
  const [formData, setFormData] = useState<Event>({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    color: 'bg-teal-100 text-teal-800',
    type: 'meeting',
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else if (isNewEvent) {
      // Set default values for new event
      const now = new Date();
      const oneHourLater = new Date(now);
      oneHourLater.setHours(now.getHours() + 1);
      
      setFormData({
        id: `event-${Date.now()}`,
        title: '',
        start: now,
        end: oneHourLater,
        color: 'bg-teal-100 text-teal-800',
        type: 'meeting',
      });
    }
  }, [event, isNewEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const value = e.target.value;
    const [datePart, timePart] = value.split('T');
    
    const newDate = new Date(formData[field]);
    if (datePart) {
      const [year, month, day] = datePart.split('-').map(Number);
      newDate.setFullYear(year);
      newDate.setMonth(month - 1);
      newDate.setDate(day);
    }
    
    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: newDate
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event);
    }
  };

  if (!isOpen) return null;

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {isNewEvent ? "Create New Event" : "Edit Event"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Add title"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="start"
                    value={formatDateForInput(formData.start)}
                    onChange={(e) => handleDateChange(e, 'start')}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="end"
                    value={formatDateForInput(formData.end)}
                    onChange={(e) => handleDateChange(e, 'end')}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add location"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px]"
                  placeholder="Add description"
                ></textarea>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="call">Call</option>
                    <option value="demo">Demo</option>
                    <option value="task">Task</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="bg-teal-100 text-teal-800">Teal</option>
                  <option value="bg-blue-100 text-blue-800">Blue</option>
                  <option value="bg-purple-100 text-purple-800">Purple</option>
                  <option value="bg-amber-100 text-amber-800">Amber</option>
                  <option value="bg-rose-100 text-rose-800">Rose</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            {!isNewEvent && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 mr-1 text-gray-500" />
                Delete
              </button>
            )}
            {isNewEvent && (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-md text-sm font-medium hover:from-teal-600 hover:to-emerald-600"
              >
                {isNewEvent ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 