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
import { X, PhoneCall, UserCheck } from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

interface CallbackRequest {
  id: string;
  mobileNumber: string;
  assignedTo: string;
  status: string;
}

interface CallbackFormSheetProps {
  callbackRequest?: CallbackRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (callbackRequest: Partial<CallbackRequest>) => void;
}

export function CallbackFormSheet({
  callbackRequest,
  isOpen,
  onClose,
  onSave
}: CallbackFormSheetProps) {
  const isEditing = !!callbackRequest;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  const [formData, setFormData] = useState<Partial<CallbackRequest>>({
    mobileNumber: '',
    assignedTo: '',
    status: 'pending'
  });
  
  // Reset form when callbackRequest changes
  useEffect(() => {
    if (callbackRequest) {
      setFormData({
        ...callbackRequest
      });
    } else {
      setFormData({
        mobileNumber: '',
        assignedTo: '',
        status: 'pending'
      });
    }
  }, [callbackRequest]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    startAIProcessing("Processing callback request...");
    
    setTimeout(() => {
      endAIProcessing();
      setIsSubmitting(false);
      onSave(formData);
    }, 1500);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="pb-4 border-b border-gray-200">
            <SheetTitle>{isEditing ? 'Edit Callback Request' : 'Add Callback Request'}</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
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
              
              {isEditing && (
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
                    <option value="missed">Missed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <PhoneCall className="h-4 w-4 mr-2" />
              {isEditing ? 'Update' : 'Add Callback'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 