"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Edit, 
  Trash2,
  MessageCircle,
  FileText,
  Database,
  Server,
  HardDrive,
  Cpu,
  MapPin,
  Tag,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Receipt,
  FileSignature,
  CreditCard,
  BadgePercent,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";
import { useLoading } from "@/components/layout/loading-provider";
import { PaymentLinkModal } from "./payment-link-modal";
import { InvoiceModal } from "./invoice-modal";
import { ContractModal } from "./contract-modal";
import { OfferModal } from "./offer-modal";

interface OfferData {
  baseLicense: number;
  perCompanyFee: number;
  storagePrice: number;
  aiQueryPrice: number;
  discount: number;
  validUntil: string;
  gstType: "igst" | "sgst_cgst" | "none";
  revisedRequirements: {
    companies: number;
    devices: string;
    tenders: string;
    aiQueries: number;
    storageSpace: string;
  };
}

interface EnterpriseLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  gst: string;
  status: string;
  assignedTo?: string;
  createdAt: Date;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  requirements: {
    companies: number;
    devices: string;
    tenders: string;
    aiQueries: number;
    storageSpace: string;
    backupSpace: string;
  };
  notes?: string;
}

interface EnterpriseDetailSheetProps {
  enterpriseLead: EnterpriseLead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: EnterpriseLead) => void;
  onDelete: (id: string) => void;
}

export function EnterpriseDetailSheet({
  enterpriseLead,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: EnterpriseDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const { startApiRequest, endApiRequest } = useLoading();
  
  // Action states
  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionSuccess, setActionSuccess] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotesEditor, setShowNotesEditor] = useState(false);
  
  // Modal states
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showContractModal, setShowContractModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Reset notes when enterprise lead changes or component mounts
  useEffect(() => {
    if (enterpriseLead) {
      setNotes(enterpriseLead.notes || "");
    }
  }, [enterpriseLead]);
  
  // Reset modal states when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setShowPaymentLinkModal(false);
      setShowInvoiceModal(false);
      setShowContractModal(false);
      setShowOfferModal(false);
    }
  }, [isOpen]);
  
  const handleDelete = () => {
    if (!enterpriseLead) return;
    
    if (isDeleting) {
      setIsProcessingDelete(true);
      startApiRequest();
      
      // Simulate API call delay
      setTimeout(() => {
        onDelete(enterpriseLead.id);
        setIsProcessingDelete(false);
        endApiRequest();
        onClose();
      }, 1000);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleEdit = () => {
    if (!enterpriseLead) return;
    onEdit(enterpriseLead);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-800';
      case 'won':
        return 'bg-teal-100 text-teal-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!enterpriseLead) return 0;
    return 50000 + 
      (enterpriseLead.requirements.companies * 5000) + 
      15000 + 
      (enterpriseLead.requirements.aiQueries * 10);
  };
  
  // Generic function to handle button actions
  const handleAction = (action: string) => {
    console.log("Action triggered:", action); // Debug log
    setIsActionLoading(true);
    setShowActionFeedback(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsActionLoading(false);
      
      switch(action) {
        case 'email':
          setActionMessage(`Email sent successfully to ${enterpriseLead?.email}`);
          setActionSuccess(true);
          setShowActionFeedback(true);
          break;
        case 'whatsapp':
          setActionMessage(`WhatsApp message sent to ${enterpriseLead?.phone}`);
          setActionSuccess(true);
          setShowActionFeedback(true);
          break;
        case 'call':
          setActionMessage(`Call initiated to ${enterpriseLead?.phone}`);
          setActionSuccess(true);
          setShowActionFeedback(true);
          break;
        case 'offer':
          setShowOfferModal(true);
          break;
        case 'payment':
          const link = `https://pay.quickbid.co.in/${enterpriseLead?.id}?amount=${calculateTotalPrice()}`;
          setPaymentLink(link);
          setShowPaymentLinkModal(true);
          break;
        case 'invoice':
          const invNumber = `INV-${Date.now().toString().slice(-6)}`;
          setInvoiceNumber(invNumber);
          setShowInvoiceModal(true);
          break;
        case 'contract':
          setShowContractModal(true);
          break;
        case 'notes':
          setShowNotesEditor(true);
          break;
        case 'status':
          setActionMessage(`Status updated successfully for ${enterpriseLead?.company}`);
          setActionSuccess(true);
          setShowActionFeedback(true);
          break;
        default:
          setActionMessage("Action completed");
          setActionSuccess(true);
          setShowActionFeedback(true);
      }
      
      // Auto-hide feedback after 5 seconds
      if (showActionFeedback) {
        setTimeout(() => {
          setShowActionFeedback(false);
        }, 5000);
      }
    }, 1000);
  };
  
  const handleSaveNotes = () => {
    if (!notes.trim()) {
      setActionMessage("Notes cannot be empty");
      setActionSuccess(false);
      setShowActionFeedback(true);
      setTimeout(() => {
        setShowActionFeedback(false);
      }, 3000);
      return;
    }
    
    setIsActionLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsActionLoading(false);
      setShowNotesEditor(false);
      setShowActionFeedback(true);
      setActionMessage("Notes updated successfully");
      setActionSuccess(true);
      
      // Auto-hide feedback after 5 seconds
      setTimeout(() => {
        setShowActionFeedback(false);
      }, 5000);
    }, 1000);
  };
  
  const handleSendOffer = (offerData: OfferData) => {
    setActionMessage(`Offer created and sent to ${enterpriseLead?.email}`);
    setActionSuccess(true);
    setShowActionFeedback(true);
  };
  
  const handleSendInvoice = () => {
    setActionMessage(`Invoice #${invoiceNumber} sent to ${enterpriseLead?.email}`);
    setActionSuccess(true);
    setShowActionFeedback(true);
  };
  
  const handleSendContract = () => {
    setActionMessage(`Contract sent to ${enterpriseLead?.email} for signature`);
    setActionSuccess(true);
    setShowActionFeedback(true);
  };
  
  if (!enterpriseLead) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-xl font-bold">{enterpriseLead.company}</SheetTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(enterpriseLead.status)}`}>
              {enterpriseLead.status}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-700">Enterprise Lead</span>
            <span className="text-sm text-gray-500">
              Created on {formatDate(enterpriseLead.createdAt)}
            </span>
          </div>
          <SheetDescription className="sr-only">
            Enterprise lead details for {enterpriseLead.company}
          </SheetDescription>
        </SheetHeader>
        
        {/* Action Feedback */}
        {showActionFeedback && (
          <div className={`mt-4 p-3 rounded-md flex items-center justify-between ${
            actionSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {actionSuccess ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm">{actionMessage}</p>
            </div>
            <button onClick={() => setShowActionFeedback(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Modals */}
        <PaymentLinkModal 
          isOpen={showPaymentLinkModal}
          onClose={() => setShowPaymentLinkModal(false)}
          companyName={enterpriseLead.company}
          paymentLink={paymentLink}
        />
        
        <InvoiceModal 
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          companyName={enterpriseLead.company}
          email={enterpriseLead.email}
          invoiceNumber={invoiceNumber}
          amount={calculateTotalPrice()}
          onSend={handleSendInvoice}
        />
        
        <ContractModal 
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          companyName={enterpriseLead.company}
          email={enterpriseLead.email}
          amount={calculateTotalPrice()}
          onSend={handleSendContract}
        />
        
        <OfferModal 
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          companyName={enterpriseLead.company}
          email={enterpriseLead.email}
          onSend={handleSendOffer}
          requirements={{
            companies: enterpriseLead.requirements.companies,
            devices: enterpriseLead.requirements.devices,
            tenders: enterpriseLead.requirements.tenders,
            aiQueries: enterpriseLead.requirements.aiQueries,
            storageSpace: enterpriseLead.requirements.storageSpace
          }}
        />
        
        <div className="py-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.name}</p>
                  <p className="text-xs text-gray-500">Contact Person</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building2 className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.company}</p>
                  <p className="text-xs text-gray-500">Company</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.gst}</p>
                  <p className="text-xs text-gray-500">GST Number</p>
                </div>
              </div>
              
              <h4 className="text-xs text-gray-500 mt-4 mb-2">Contact Details</h4>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.phone}</p>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Billing Address */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Billing Address</h3>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm">
                  {enterpriseLead.billingAddress?.street}<br />
                  {enterpriseLead.billingAddress?.city}, {enterpriseLead.billingAddress?.state} {enterpriseLead.billingAddress?.postalCode}<br />
                  {enterpriseLead.billingAddress?.country}
                </p>
              </div>
            </div>
          </div>
          
          {/* Enterprise Requirements */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Enterprise Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Building2 className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.companies}</p>
                  <p className="text-xs text-gray-500">No. of Companies</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Cpu className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.devices}</p>
                  <p className="text-xs text-gray-500">No. of Devices</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.tenders}</p>
                  <p className="text-xs text-gray-500">No. of Tenders</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Database className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.aiQueries}</p>
                  <p className="text-xs text-gray-500">No. of AI Queries</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Server className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.storageSpace}</p>
                  <p className="text-xs text-gray-500">Storage Space</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HardDrive className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{enterpriseLead.requirements.backupSpace}</p>
                  <p className="text-xs text-gray-500">Backup Space</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pricing Details */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => setShowPricing(!showPricing)}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-3">Pricing Details</h3>
              {showPricing ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            
            {showPricing && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-600">Base License</span>
                  <span className="text-sm font-medium">₹50,000</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-600">Per Company Fee ({enterpriseLead.requirements.companies} companies)</span>
                  <span className="text-sm font-medium">₹{enterpriseLead.requirements.companies * 5000}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-600">Storage ({enterpriseLead.requirements.storageSpace})</span>
                  <span className="text-sm font-medium">₹15,000</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-600">AI Queries ({enterpriseLead.requirements.aiQueries})</span>
                  <span className="text-sm font-medium">₹{enterpriseLead.requirements.aiQueries * 10}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-bold">₹{calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
            {showNotesEditor ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={5}
                  placeholder="Add notes about this enterprise lead..."
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNotesEditor(false)}
                    disabled={isActionLoading}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isActionLoading}
                    type="button"
                  >
                    {isActionLoading ? "Saving..." : "Save Notes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {enterpriseLead.notes || "No notes added yet. Click 'Add Notes' to add notes."}
                </p>
              </div>
            )}
          </div>
          
          {/* Assigned Agent */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Agent</h3>
            <div className="flex items-start">
              <UserCheck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <p className="text-sm font-medium">
                {enterpriseLead.assignedTo || "No agent assigned yet"}
              </p>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="flex items-start">
              <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(enterpriseLead.status)}`}>
                {enterpriseLead.status}
              </span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('email')}
                disabled={isActionLoading}
                aria-label="Send email to contact"
                type="button"
              >
                <Mail className="h-5 w-5" />
                <span className="text-xs">Send Email</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('whatsapp')}
                disabled={isActionLoading}
                aria-label="Send WhatsApp message"
                type="button"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Send WhatsApp</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('call')}
                disabled={isActionLoading}
                aria-label="Call contact"
                type="button"
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">Call</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('offer')}
                disabled={isActionLoading}
                aria-label="Create offer"
                type="button"
              >
                <BadgePercent className="h-5 w-5" />
                <span className="text-xs">Create Offer</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('payment')}
                disabled={isActionLoading}
                aria-label="Generate payment link"
                type="button"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Payment Link</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('invoice')}
                disabled={isActionLoading}
                aria-label="Generate invoice"
                type="button"
              >
                <Receipt className="h-5 w-5" />
                <span className="text-xs">Generate Invoice</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('contract')}
                disabled={isActionLoading}
                aria-label="Create contract"
                type="button"
              >
                <FileSignature className="h-5 w-5" />
                <span className="text-xs">Create Contract</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => handleAction('notes')}
                disabled={isActionLoading}
                aria-label="Add notes"
                type="button"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Add Notes</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                onClick={() => handleAction('status')}
                disabled={isActionLoading}
                aria-label="Update status"
                type="button"
              >
                <Tag className="h-5 w-5" />
                <span className="text-xs">Update Status</span>
              </Button>
            </div>
          </div>
          
          {/* Activity Timeline */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-teal-500 pl-4 pb-4">
                <p className="text-xs text-gray-500">{formatDate(enterpriseLead.createdAt)}</p>
                <p className="text-sm">Enterprise lead created</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4 pb-4">
                <p className="text-xs text-gray-500">{formatDate(enterpriseLead.createdAt)}</p>
                <p className="text-sm">Requirements gathered</p>
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" onClick={handleEdit} type="button">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              className={isDeleting ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-red-600 hover:bg-red-50"} 
              onClick={handleDelete}
              type="button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Confirm Delete" : "Delete"}
            </Button>
          </div>
          <Button onClick={onClose} variant="outline" type="button">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 