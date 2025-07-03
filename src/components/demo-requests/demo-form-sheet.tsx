"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Save, Calendar, Clock } from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

interface DemoRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessName: string;
  preferredDate: Date;
  status: string;
  assignedTo?: string;
  createdAt: Date;
  notes?: string;
}

interface DemoFormSheetProps {
  demoRequest?: DemoRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (demoRequest: Partial<DemoRequest>) => void;
}

export function DemoFormSheet({
  demoRequest,
  isOpen,
  onClose,
  onSave
}: DemoFormSheetProps) {
  const isEditing = !!demoRequest;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  const [formData, setFormData] = useState<Partial<DemoRequest>>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    preferredDate: new Date(),
    status: 'pending',
  });
  
  const [dateString, setDateString] = useState('');
  const [timeString, setTimeString] = useState('');
  
  // Reset form when demoRequest changes
  useEffect(() => {
    if (demoRequest) {
      const date = new Date(demoRequest.preferredDate);
      
      setFormData({
        ...demoRequest
      });
      
      setDateString(formatDateForInput(date));
      setTimeString(formatTimeForInput(date));
    } else {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        preferredDate: now,
        status: 'pending',
      });
      
      setDateString(formatDateForInput(now));
      setTimeString(formatTimeForInput(now));
    }
  }, [demoRequest]);
  
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const formatTimeForInput = (date: Date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const parseDateTime = (dateStr: string, timeStr: string) => {
    // Parse DD/MM/YYYY format
    const [day, month, year] = dateStr.split('/').map(Number);
    
    // Parse HH:MM format
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(hours, minutes, 0, 0);
    
    return date;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateString(e.target.value);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeString(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine date and time
      const preferredDate = parseDateTime(dateString, timeString);
      
      setIsSubmitting(true);
      
      // Simulate API call delay
      startAIProcessing("Processing demo request...");
      
      setTimeout(() => {
        endAIProcessing();
        setIsSubmitting(false);
        onSave({
          ...formData,
          preferredDate,
        });
      }, 1500);
    } catch (err) {
      console.error("Error parsing date/time:", err);
      alert("Please enter a valid date and time.");
      setIsSubmitting(false);
      endAIProcessing();
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="pb-4 border-b border-gray-200">
            <SheetTitle>{isEditing ? 'Edit Demo Request' : 'Book A Demo'}</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of Your Business *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date & Time for Demo *
                </label>
                <div className="flex space-x-4 items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="preferredDate"
                      placeholder="dd/mm/yyyy"
                      required
                      value={dateString}
                      onChange={handleDateChange}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="preferredTime"
                      placeholder="--:-- --"
                      required
                      value={timeString}
                      onChange={handleTimeChange}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || 'pending'}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To
                    </label>
                    <input
                      type="text"
                      id="assignedTo"
                      name="assignedTo"
                      value={formData.assignedTo || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update' : 'Schedule'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 