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
  Edit, 
  Trash2,
  Phone,
  UserCheck,
  Tag,
  PhoneCall,
  Mail,
  MessageCircle
} from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

interface CallbackRequest {
  id: string;
  mobileNumber: string;
  assignedTo: string;
  status: string;
}

interface CallbackDetailSheetProps {
  callbackRequest: CallbackRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (callbackRequest: CallbackRequest) => void;
  onDelete: (id: string) => void;
}

export function CallbackDetailSheet({
  callbackRequest,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: CallbackDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { startApiRequest, endApiRequest } = useLoading();
  
  const handleDelete = () => {
    if (!callbackRequest) return;
    
    if (isDeleting) {
      setIsProcessingDelete(true);
      startApiRequest();
      
      // Simulate API call delay
      setTimeout(() => {
        onDelete(callbackRequest.id);
        setIsProcessingDelete(false);
        endApiRequest();
        onClose();
      }, 1000);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleEdit = () => {
    if (!callbackRequest) return;
    onEdit(callbackRequest);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'missed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!callbackRequest) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-xl font-bold">Callback Request</SheetTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(callbackRequest.status)}`}>
              {callbackRequest.status}
            </span>
          </div>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{callbackRequest.mobileNumber}</p>
                  <p className="text-xs text-gray-500">Mobile Number</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assigned Agent */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Agent</h3>
            <div className="flex items-start">
              <UserCheck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <p className="text-sm font-medium">
                {callbackRequest.assignedTo || "No agent assigned yet"}
              </p>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="flex items-start">
              <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(callbackRequest.status)}`}>
                {callbackRequest.status}
              </span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700">
                <PhoneCall className="h-5 w-5" />
                <span className="text-xs">Call Now</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <Mail className="h-5 w-5" />
                <span className="text-xs">Send Email</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Send WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <UserCheck className="h-5 w-5" />
                <span className="text-xs">Assign Agent</span>
              </Button>
            </div>
          </div>
          
          {/* Activity Timeline */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-teal-500 pl-4 pb-4">
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                <p className="text-sm">Callback request created</p>
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