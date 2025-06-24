"use client";

import { useLeads, Lead } from "@/hooks/useLeads";
import { LeadForm } from "@/components/leads/lead-form";
import { v4 as uuidv4 } from "uuid";

export default function NewLeadPage() {
  const { updateLead } = useLeads();
  
  const handleSubmit = (leadData: Partial<Lead>) => {
    // Create a new lead with a unique ID
    const newLead: Lead = {
      id: uuidv4(),
      name: leadData.name || "",
      company: leadData.company || "",
      contact: leadData.contact || "",
      email: leadData.email || "",
      phone: leadData.phone || "",
      assignedTo: {
        id: "101", // Default to first team member
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
      },
      status: leadData.status as Lead["status"] || "new",
      source: leadData.source || "",
      value: leadData.value || 0,
      notes: leadData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save the new lead
    updateLead(newLead.id, newLead);
  };
  
  return <LeadForm onSubmit={handleSubmit} />;
} 