"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsTabs } from "@/components/leads/leads-tabs";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { LeadFormSheet } from "@/components/leads/lead-form-sheet";
import { useLeads, Lead } from "@/hooks/useLeads";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

export default function LeadsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  const { 
    leads, 
    loading, 
    totalLeads, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    searchQuery,
    setSearchQuery
  } = useLeads();
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Show API loading state when fetching leads
  useEffect(() => {
    if (loading) {
      startApiRequest();
    } else {
      endApiRequest();
    }
    
    return () => {
      endApiRequest();
    };
  }, [loading, startApiRequest, endApiRequest]);
  
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddLead = () => {
    setEditingLead(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteLead = (id: string) => {
    // In a real app, you would call an API to delete the lead
    // For now, we'll just close the sheet
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveLead = (leadData: Partial<Lead>) => {
    // In a real app, you would call an API to save the lead
    // For now, we'll just close the sheet
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-gray-500">Manage and track your leads</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          
          <Button onClick={handleAddLead}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
      
      <LeadsTabs />
      
      <div className="mt-6">
        <LeadsTable 
          leads={leads}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          loading={loading}
        />
      </div>
      
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
      />
      
      <LeadFormSheet
        lead={editingLead}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveLead}
      />
    </div>
  );
} 