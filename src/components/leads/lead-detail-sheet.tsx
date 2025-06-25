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
  MapPin, 
  Globe, 
  Tag, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2,
  MessageCircle,
  Mail as MailIcon,
  CalendarClock,
  FileText,
  AlertCircle
} from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  source: string;
  status: string;
  tags: string[];
  createdAt: Date;
  lastContactedAt?: Date;
  notes: string;
}

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadDetailSheet({
  lead,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: LeadDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { startApiRequest, endApiRequest } = useLoading();
  
  const handleDelete = () => {
    if (!lead) return;
    
    if (isDeleting) {
      setIsProcessingDelete(true);
      startApiRequest();
      
      // Simulate API call delay
      setTimeout(() => {
        onDelete(lead.id);
        setIsProcessingDelete(false);
        endApiRequest();
        onClose();
      }, 1000);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleEdit = () => {
    if (!lead) return;
    onEdit(lead);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-teal-100 text-teal-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (!lead) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-xl font-bold">{lead.name}</SheetTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Building className="w-4 h-4 mr-1" />
            {lead.company}
          </div>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{lead.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{lead.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              
              {lead.address && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{lead.address}</p>
                    <p className="text-xs text-gray-500">Address</p>
                  </div>
                </div>
              )}
              
              {lead.website && (
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <a 
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-teal-600 hover:underline"
                    >
                      {lead.website}
                    </a>
                    <p className="text-xs text-gray-500">Website</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Lead Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Lead Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{lead.source}</p>
                  <p className="text-xs text-gray-500">Source</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{formatDate(lead.createdAt)}</p>
                  <p className="text-xs text-gray-500">Created</p>
                </div>
              </div>
              
              {lead.lastContactedAt && (
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{formatDate(lead.lastContactedAt)}</p>
                    <p className="text-xs text-gray-500">Last Contacted</p>
                  </div>
                </div>
              )}
              
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex items-start">
                  <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tags</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
              </div>
            </div>
          )}
          
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
                <span className="text-xs">Send Message</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <CalendarClock className="h-5 w-5" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <Phone className="h-5 w-5" />
                <span className="text-xs">Call</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Add Note</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 space-y-1">
                <Tag className="h-5 w-5" />
                <span className="text-xs">Add Tag</span>
              </Button>
            </div>
          </div>
        </div>
        
        <SheetFooter className="border-t border-gray-200 pt-4">
          <div className="flex justify-between w-full">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              isLoading={isProcessingDelete}
              disabled={isProcessingDelete}
            >
              {isDeleting && !isProcessingDelete && <AlertCircle className="mr-2 h-4 w-4" />}
              {isDeleting ? 'Confirm Delete' : 'Delete'}
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={isProcessingDelete}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 