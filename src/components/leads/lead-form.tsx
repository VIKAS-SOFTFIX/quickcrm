"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/hooks/useLeads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LeadFormProps {
  lead?: Lead;
  isEditing?: boolean;
  onSubmit: (lead: Partial<Lead>) => void;
}

export function LeadForm({ lead, isEditing = false, onSubmit }: LeadFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    status: "new",
    source: "",
    value: 0,
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (lead && isEditing) {
      setFormData({
        name: lead.name,
        company: lead.company,
        contact: lead.contact,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        source: lead.source,
        value: lead.value,
        notes: lead.notes || ""
      });
    }
  }, [lead, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.company?.trim()) {
      newErrors.company = "Company is required";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    
    if (!formData.source?.trim()) {
      newErrors.source = "Source is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        onSubmit(formData);
        router.push('/leads');
      } catch (error) {
        console.error("Error submitting lead:", error);
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/leads')}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-500">{errors.company}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status*
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source*
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.source ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select a source</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Conference">Conference</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Google Ads">Google Ads</option>
              </select>
              {errors.source && (
                <p className="mt-1 text-sm text-red-500">{errors.source}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Value ($)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => router.push('/leads')}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 