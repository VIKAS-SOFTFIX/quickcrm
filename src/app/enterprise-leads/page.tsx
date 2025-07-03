"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, Building2, Users, Database, Server, Cpu, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnterpriseLeadsTable } from "@/components/enterprise-leads/enterprise-leads-table";
import { EnterpriseLeadsTabs } from "@/components/enterprise-leads/enterprise-leads-tabs";
import { EnterpriseDetailSheet } from "@/components/enterprise-leads/enterprise-detail-sheet";
import { EnterpriseFormSheet } from "@/components/enterprise-leads/enterprise-form";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Enterprise lead interface
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

// Mock data for enterprise leads
const mockEnterpriseLeads: EnterpriseLead[] = [
  {
    id: "1",
    name: "VIKAS KUMAR VERMA",
    email: "vikas@quickbid.co.in",
    phone: "6370102556",
    company: "QUICKBID SYSTEMS PRIVATE LIMITED",
    gst: "33AABCQ1234A1Z5",
    status: "qualified",
    createdAt: new Date("2025-06-18"),
    billingAddress: {
      street: "123 Main Street",
      city: "Lucknow",
      state: "Uttar Pradesh",
      postalCode: "226016",
      country: "India"
    },
    requirements: {
      companies: 10,
      devices: "5 to 50",
      tenders: "15 to 50",
      aiQueries: 500,
      storageSpace: "5 to 50 GB",
      backupSpace: "5 to 50 GB"
    },
    notes: "Interested in full enterprise solution"
  }
];

export default function EnterpriseLeadsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [enterpriseLeads, setEnterpriseLeads] = useState<EnterpriseLead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<EnterpriseLead | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<EnterpriseLead | null>(null);
  
  // Load enterprise leads (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setEnterpriseLeads(mockEnterpriseLeads);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleViewLead = (lead: EnterpriseLead) => {
    setSelectedLead(lead);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddLead = () => {
    setEditingLead(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditLead = (lead: EnterpriseLead) => {
    setEditingLead(lead);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteLead = (id: string) => {
    // Delete the lead
    setEnterpriseLeads(enterpriseLeads.filter(lead => lead.id !== id));
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveLead = (leadData: Partial<EnterpriseLead>) => {
    if (editingLead) {
      // Update existing lead
      setEnterpriseLeads(enterpriseLeads.map(lead => 
        lead.id === editingLead.id ? { ...lead, ...leadData } : lead
      ));
    } else {
      // Add new lead
      const newLead: EnterpriseLead = {
        id: `${enterpriseLeads.length + 1}`,
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        company: leadData.company || '',
        gst: leadData.gst || '',
        status: 'new',
        createdAt: new Date(),
        billingAddress: leadData.billingAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        requirements: leadData.requirements || {
          companies: 0,
          devices: '',
          tenders: '',
          aiQueries: 0,
          storageSpace: '',
          backupSpace: ''
        },
        notes: leadData.notes || ''
      };
      setEnterpriseLeads([...enterpriseLeads, newLead]);
    }
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter enterprise leads based on search
  const filteredLeads = enterpriseLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.gst.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate stats
  const totalLeads = enterpriseLeads.length;
  const newLeads = enterpriseLeads.filter(lead => lead.status === 'new').length;
  const qualifiedLeads = enterpriseLeads.filter(lead => lead.status === 'qualified').length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Enterprise Leads</h1>
      
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
                  <Building2 className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-teal-500 mr-1">
                    <Users className="h-3 w-3 mr-1" />
                    Enterprise Leads
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">New</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{newLeads}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <FileStack className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    <Users className="h-3 w-3 mr-1" />
                    New Leads
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-purple-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Qualified</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{qualifiedLeads}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Server className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-purple-500 mr-1">
                    <Database className="h-3 w-3 mr-1" />
                    Qualified Leads
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
              placeholder="Search by name, company, GST..."
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
              Add Enterprise Lead
            </Button>
          </div>
        </div>
      </div>
      
      <EnterpriseLeadsTabs />
      
      <div className="mt-6">
        <EnterpriseLeadsTable 
          enterpriseLeads={filteredLeads}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          loading={loading}
        />
      </div>
      
      <EnterpriseDetailSheet
        enterpriseLead={selectedLead}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
      />
      
      <EnterpriseFormSheet
        enterpriseLead={editingLead}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveLead}
      />
    </div>
  );
} 