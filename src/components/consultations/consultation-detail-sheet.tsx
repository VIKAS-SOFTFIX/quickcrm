"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2, Calendar, Phone, Mail, Building, Tag, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  interestedIn: string;
  industry: string;
  status: string;
  assignedTo?: string;
  createdAt: Date;
  scheduledDate?: Date;
  notes?: string;
}

interface ConsultationDetailSheetProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (consultation: Consultation) => void;
  onDelete: (id: string) => void;
}

export function ConsultationDetailSheet({
  consultation,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: ConsultationDetailSheetProps) {
  if (!consultation) return null;
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <SheetTitle>Consultation Request Details</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(consultation.status)}`}>
              {consultation.status}
            </span>
            
            <div className="text-sm text-gray-500">
              Request Date: {format(new Date(consultation.createdAt), "MMM d, yyyy")}
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{consultation.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{consultation.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{consultation.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-sm font-medium">{consultation.company}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-sm font-medium">{consultation.industry}</p>
                </div>
              </div>
              
              <div className="flex items-start md:col-span-2">
                <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Interested In</p>
                  <p className="text-sm font-medium">{consultation.interestedIn}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scheduled Date */}
          {consultation.scheduledDate && (
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="text-sm font-medium">
                  {format(new Date(consultation.scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
          
          {/* Notes */}
          {consultation.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Notes</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{consultation.notes}</p>
              </div>
            </div>
          )}
          
          {/* Assignment */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Assignment</h4>
            <p className="text-sm text-gray-600">
              {consultation.assignedTo ? `Assigned to: ${consultation.assignedTo}` : "Not assigned yet"}
            </p>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this consultation request?")) {
                onDelete(consultation.id);
              }
            }}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <Button
            onClick={() => onEdit(consultation)}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 