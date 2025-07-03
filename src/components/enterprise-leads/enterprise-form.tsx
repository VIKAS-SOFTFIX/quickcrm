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
import { X, Save } from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

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

interface EnterpriseFormSheetProps {
  enterpriseLead?: EnterpriseLead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<EnterpriseLead>) => void;
}

export function EnterpriseFormSheet({
  enterpriseLead,
  isOpen,
  onClose,
  onSave
}: EnterpriseFormSheetProps) {
  const isEditing = !!enterpriseLead;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  const [formData, setFormData] = useState<Partial<EnterpriseLead>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    gst: '',
    status: 'new',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    requirements: {
      companies: 10,
      devices: '5 to 50',
      tenders: '15 to 50',
      aiQueries: 500,
      storageSpace: '5 to 50 GB',
      backupSpace: '5 to 50 GB'
    },
    notes: ''
  });
  
  // Reset form when enterpriseLead changes
  useEffect(() => {
    if (enterpriseLead) {
      setFormData({
        ...enterpriseLead
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        gst: '',
        status: 'new',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        requirements: {
          companies: 10,
          devices: '5 to 50',
          tenders: '15 to 50',
          aiQueries: 500,
          storageSpace: '5 to 50 GB',
          backupSpace: '5 to 50 GB'
        },
        notes: ''
      });
    }
  }, [enterpriseLead]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested requirements fields
    if (name.startsWith('requirements.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements!,
          [field]: field === 'companies' || field === 'aiQueries' ? parseInt(value) || 0 : value
        }
      }));
    } 
    // Handle nested billing address fields
    else if (name.startsWith('billingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress!,
          [field]: value
        }
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    startAIProcessing("Processing enterprise lead...");
    
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
            <SheetTitle>
              {isEditing ? 'Edit Enterprise Lead' : 'Add Enterprise Lead'}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* Billing Details Section */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Billing Details</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="gst" className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number *
                  </label>
                  <input
                    type="text"
                    id="gst"
                    name="gst"
                    required
                    value={formData.gst || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 33AABCQ1234A1Z5"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
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
                    Mobile Number *
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
              </div>
            </div>
            
            {/* Billing Address Section */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Billing Address</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="billingAddress.street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.street"
                    name="billingAddress.street"
                    required
                    value={formData.billingAddress?.street || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="billingAddress.city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.city"
                    name="billingAddress.city"
                    required
                    value={formData.billingAddress?.city || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="billingAddress.state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.state"
                    name="billingAddress.state"
                    required
                    value={formData.billingAddress?.state || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="billingAddress.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.postalCode"
                    name="billingAddress.postalCode"
                    required
                    value={formData.billingAddress?.postalCode || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="billingAddress.country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="billingAddress.country"
                    name="billingAddress.country"
                    required
                    value={formData.billingAddress?.country || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Requirements Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Enterprise Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requirements.companies" className="block text-sm font-medium text-gray-700 mb-1">
                    No. of Companies *
                  </label>
                  <input
                    type="number"
                    id="requirements.companies"
                    name="requirements.companies"
                    required
                    value={formData.requirements?.companies || 10}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements.devices" className="block text-sm font-medium text-gray-700 mb-1">
                    No. of Devices *
                  </label>
                  <input
                    type="text"
                    id="requirements.devices"
                    name="requirements.devices"
                    required
                    value={formData.requirements?.devices || ''}
                    onChange={handleChange}
                    placeholder="e.g., 5 to 50"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements.tenders" className="block text-sm font-medium text-gray-700 mb-1">
                    No. of Tenders *
                  </label>
                  <input
                    type="text"
                    id="requirements.tenders"
                    name="requirements.tenders"
                    required
                    value={formData.requirements?.tenders || ''}
                    onChange={handleChange}
                    placeholder="e.g., 15 to 50"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements.aiQueries" className="block text-sm font-medium text-gray-700 mb-1">
                    No. of AI Queries *
                  </label>
                  <input
                    type="number"
                    id="requirements.aiQueries"
                    name="requirements.aiQueries"
                    required
                    value={formData.requirements?.aiQueries || 500}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements.storageSpace" className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Space *
                  </label>
                  <input
                    type="text"
                    id="requirements.storageSpace"
                    name="requirements.storageSpace"
                    required
                    value={formData.requirements?.storageSpace || ''}
                    onChange={handleChange}
                    placeholder="e.g., 5 to 50 GB"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements.backupSpace" className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Space *
                  </label>
                  <input
                    type="text"
                    id="requirements.backupSpace"
                    name="requirements.backupSpace"
                    required
                    value={formData.requirements?.backupSpace || ''}
                    onChange={handleChange}
                    placeholder="e.g., 5 to 50 GB"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Status Section */}
            {isEditing && (
              <div className="pt-4 border-t border-gray-200">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || 'new'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            )}
            
            {/* Notes Section */}
            <div className="pt-4 border-t border-gray-200">
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
                placeholder="Any additional information about this enterprise lead"
              />
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-gray-200 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 