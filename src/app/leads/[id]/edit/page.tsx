"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeads, Lead } from "@/hooks/useLeads";
import { LeadForm } from "@/components/leads/lead-form";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const { getLeadById, updateLead } = useLeads();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (params.id) {
      const leadId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundLead = getLeadById(leadId);
      
      if (foundLead) {
        setLead(foundLead);
      }
      
      setLoading(false);
    }
  }, [params.id, getLeadById]);
  
  const handleSubmit = (leadData: Partial<Lead>) => {
    if (lead) {
      updateLead(lead.id, {
        ...leadData,
        updatedAt: new Date()
      });
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Lead not found</h2>
          <p className="text-gray-500 mt-2">The lead you're trying to edit doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/leads')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }
  
  return <LeadForm lead={lead} isEditing={true} onSubmit={handleSubmit} />;
} 