"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, Users, UserCheck, Star, Tag } from "lucide-react";
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
  
  // Calculate stats
  const qualifiedLeads = leads.filter(lead => 
    lead.status === "Qualified" || lead.status === "Proposal" || lead.status === "Negotiation"
  ).length;
  
  const wonLeads = leads.filter(lead => 
    lead.status === "Won"
  ).length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      
      <div className="flex flex-col gap-4">
        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-teal-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalLeads}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-teal-500 mr-1">
                    <Tag className="h-3 w-3 mr-1" />
                    All leads
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Qualified</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{qualifiedLeads}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Active pipeline
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-green-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Won</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{wonLeads}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-green-500 mr-1">
                    <Star className="h-3 w-3 mr-1" />
                    Converted leads
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and action buttons row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button onClick={handleAddLead} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
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