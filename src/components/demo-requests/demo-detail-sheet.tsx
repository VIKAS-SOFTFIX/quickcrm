"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  Clock, 
  Edit, 
  Trash2,
  MessageCircle,
  Mail as MailIcon,
  CalendarClock,
  FileText,
  AlertCircle,
  UserCheck,
  Tag
} from "lucide-react";
import { format } from "date-fns";
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

interface DemoDetailSheetProps {
  demoRequest: DemoRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (demoRequest: DemoRequest) => void;
  onDelete: (id: string) => void;
}

export function DemoDetailSheet({
  demoRequest,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: DemoDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { startApiRequest, endApiRequest } = useLoading();
  
  const handleDelete = () => {
    if (!demoRequest) return;
    
    if (isDeleting) {
      setIsProcessingDelete(true);
      startApiRequest();
      
      // Simulate API call delay
      setTimeout(() => {
        onDelete(demoRequest.id);
        setIsProcessingDelete(false);
        endApiRequest();
        onClose();
      }, 1000);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleEdit = () => {
    if (!demoRequest) return;
    onEdit(demoRequest);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };
  
  const formatCreationDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  
  if (!demoRequest) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-xl font-bold">{demoRequest.name}'s Demo</SheetTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demoRequest.status)}`}>
              {demoRequest.status}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor('medium')}`}>
              medium
            </span>
            <span className="text-sm text-gray-500">
              Created on {formatCreationDate(demoRequest.createdAt)}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-700 mt-2">
            Product Demo
          </div>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{demoRequest.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{demoRequest.company}</p>
                </div>
              </div>
              
              <h4 className="text-xs text-gray-500 mt-4 mb-2">Contact Details</h4>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{demoRequest.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{demoRequest.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{demoRequest.phone}</p>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo Schedule */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Demo Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{formatDate(demoRequest.preferredDate)}</p>
                  <p className="text-xs text-gray-500">Demo Date</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{formatTime(demoRequest.preferredDate)}</p>
                  <p className="text-xs text-gray-500">Demo Time</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                {demoRequest.notes || "No notes added yet. Click Edit to add notes."}
              </p>
            </div>
          </div>
          
          {/* Assigned Agent */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Agent</h3>
            <div className="flex items-start">
              <UserCheck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <p className="text-sm font-medium">
                {demoRequest.assignedTo || "No agent assigned yet"}
              </p>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="flex items-start">
              <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demoRequest.status)}`}>
                {demoRequest.status}
              </span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <MailIcon className="h-5 w-5" />
                <span className="text-xs">Send Email</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Send WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <CalendarClock className="h-5 w-5" />
                <span className="text-xs">Reschedule</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Add Notes</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <UserCheck className="h-5 w-5" />
                <span className="text-xs">Assign Agent</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-xs">Cancel Demo</span>
              </Button>
            </div>
          </div>
          
          {/* Activity Timeline */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-teal-500 pl-4 pb-4">
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                <p className="text-sm">Demo request created</p>
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              className={isDeleting ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-red-600 hover:bg-red-50"} 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Confirm Delete" : "Delete"}
            </Button>
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 