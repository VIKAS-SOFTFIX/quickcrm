"use client";

import { useState, useEffect, useMemo } from "react";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsTabs } from "@/components/leads/leads-tabs";
import { useLeads, Lead } from "@/hooks/useLeads";

export default function LeadsPage() {
  // Main leads hook for the filtered/paginated data
  const {
    leads,
    loading,
    totalLeads,
    currentPage,
    setCurrentPage,
    totalPages,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    assignLead
  } = useLeads();
  
  // Get all leads for counting status totals
  const allLeadsHook = useLeads({ initialStatus: 'all' });
  const allLeads = allLeadsHook.leads;
  
  // Calculate counts for tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      won: 0,
      lost: 0,
    };
    
    if (loading) return counts;
    
    counts.all = allLeads.length;
    
    allLeads.forEach(lead => {
      if (counts[lead.status] !== undefined) {
        counts[lead.status]++;
      }
    });
    
    return counts;
  }, [loading, allLeads]);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-gray-500 mt-1">
          Manage and track your sales pipeline
        </p>
      </div>
      
      <LeadsTabs
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        counts={statusCounts}
      />
      
      <div className="mt-6">
        <LeadsTable
          leads={leads}
          loading={loading}
          totalLeads={totalLeads}
          currentPage={currentPage}
          totalPages={totalPages}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onAssign={assignLead}
        />
      </div>
    </div>
  );
} 