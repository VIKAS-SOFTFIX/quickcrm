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

interface ConsultationFormSheetProps {
  consultation?: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (consultation: Partial<Consultation>) => void;
}

export function ConsultationFormSheet({
  consultation,
  isOpen,
  onClose,
  onSave
}: ConsultationFormSheetProps) {
  const isEditing = !!consultation;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  const [formData, setFormData] = useState<Partial<Consultation>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    interestedIn: '',
    industry: '',
    notes: ''
  });

  // Industry options
  const industryOptions = [
    "Accounting & Finance",
    "Agriculture",
    "Automotive",
    "Banking & Financial Services",
    "Construction",
    "Consulting",
    "Education",
    "Energy & Utilities",
    "Entertainment & Media",
    "Healthcare",
    "Hospitality & Tourism",
    "Information Technology",
    "Insurance",
    "Legal",
    "Manufacturing",
    "Marketing & Advertising",
    "Non-Profit",
    "Real Estate",
    "Retail",
    "Software",
    "Telecommunications",
    "Transportation & Logistics",
    "Other"
  ];
  
  // Interested In options
  const interestedInOptions = [
    "CRM Implementation",
    "Email Marketing Setup",
    "Lead Generation Strategy",
    "Sales Process Optimization",
    "Marketing Automation",
    "WhatsApp Business Integration",
    "SEO Consultation",
    "Social Media Marketing",
    "Website Development",
    "Other"
  ];
  
  // Reset form when consultation changes
  useEffect(() => {
    if (consultation) {
      setFormData({
        ...consultation
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        interestedIn: '',
        industry: '',
        notes: ''
      });
    }
  }, [consultation]);
  
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
    startAIProcessing("Processing consultation request...");
    
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
              {isEditing ? 'Edit Consultation Request' : 'Get FREE Expert Consultation'}
            </SheetTitle>
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
                  placeholder="Enter your full name"
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
                  placeholder="your.email@example.com"
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
                  placeholder="Enter your mobile number"
                />
              </div>
              
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
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700 mb-1">
                  Interested In *
                </label>
                <select
                  id="interestedIn"
                  name="interestedIn"
                  required
                  value={formData.interestedIn || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Please select</option>
                  {interestedInOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  required
                  value={formData.industry || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Please select</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Any specific requirements or questions?"
                />
              </div>
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
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 