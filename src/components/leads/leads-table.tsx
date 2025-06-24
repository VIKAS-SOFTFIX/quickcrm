"use client";

import { useState } from "react";
import { Lead } from "@/hooks/useLeads";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  totalLeads: number;
  currentPage: number;
  totalPages: number;
  sortField: keyof Lead;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Lead) => void;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onAssign: (leadId: string, assigneeId: string, assigneeName: string, assigneeAvatar?: string) => void;
}

export function LeadsTable({
  leads,
  loading,
  totalLeads,
  currentPage,
  totalPages,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onSearch,
  searchQuery,
  onAssign
}: LeadsTableProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock team members for assignment
  const teamMembers = [
    { id: '101', name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg' },
    { id: '102', name: 'Michael Chen', avatar: '/avatars/michael.jpg' },
    { id: '103', name: 'Jessica Lee', avatar: '/avatars/jessica.jpg' },
  ];
  
  const handleAssignClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setAssignModalOpen(true);
  };
  
  const handleAssign = (assigneeId: string, assigneeName: string, assigneeAvatar?: string) => {
    if (selectedLeadId) {
      onAssign(selectedLeadId, assigneeId, assigneeName, assigneeAvatar);
      setAssignModalOpen(false);
      setSelectedLeadId(null);
    }
  };
  
  const SortIcon = ({ field }: { field: keyof Lead }) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  const renderSortableHeader = (label: string, field: keyof Lead) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );
  
  const getStatusBadgeClass = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'proposal':
        return 'bg-indigo-100 text-indigo-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
          <Link
            href="/leads/new"
            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>
      
      {filterOpen && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Leads</h3>
            <button onClick={() => setFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">All Sources</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Conference">Conference</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Google Ads">Google Ads</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">All Team Members</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Reset
            </button>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
              Apply Filters
            </button>
          </div>
        </Card>
      )}
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {renderSortableHeader('Name', 'name')}
                {renderSortableHeader('Company', 'company')}
                {renderSortableHeader('Contact', 'contact')}
                {renderSortableHeader('Assigned To', 'assignedTo')}
                {renderSortableHeader('Status', 'status')}
                {renderSortableHeader('Source', 'source')}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => window.location.href = `/leads/${lead.id}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.contact}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {lead.assignedTo.avatar ? (
                              <img 
                                src={lead.assignedTo.avatar} 
                                alt={lead.assignedTo.name} 
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              lead.assignedTo.name.charAt(0)
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.assignedTo.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignClick(lead.id);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/leads/${lead.id}/edit`}
                          className="text-gray-400 hover:text-gray-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{leads.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * 10, totalLeads)}
              </span>{" "}
              of <span className="font-medium">{totalLeads}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                  currentPage === 1
                    ? "border-gray-300 bg-white text-gray-300 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                
                if (page <= 0 || page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === currentPage
                        ? "bg-teal-50 border-teal-500 text-teal-600 z-10"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-300 bg-white text-gray-300 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Assign Lead</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-500">
                Select a team member to assign this lead to:
              </p>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    className="flex items-center w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => handleAssign(member.id, member.name, member.avatar)}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{member.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 