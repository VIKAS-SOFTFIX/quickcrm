"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2,
  Eye,
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { ContentLoader } from "@/components/ui/loader";
import { format } from "date-fns";

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

interface ConsultationsTableProps {
  consultations: Consultation[];
  onView: (consultation: Consultation) => void;
  onEdit: (consultation: Consultation) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function ConsultationsTable({
  consultations,
  onView,
  onEdit,
  onDelete,
  loading = false
}: ConsultationsTableProps) {
  const [sortField, setSortField] = useState<keyof Consultation>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Reset to page 1 when consultations change
  useEffect(() => {
    setCurrentPage(1);
  }, [consultations.length]);
  
  const handleSort = (field: keyof Consultation) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Sort the consultations
  const sortedConsultations = [...consultations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    if (sortField === "createdAt" || sortField === "scheduledDate") {
      const aDate = aValue as Date;
      const bDate = bValue as Date;
      return sortDirection === "asc" 
        ? aDate.getTime() - bDate.getTime() 
        : bDate.getTime() - aDate.getTime();
    }
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  // Paginate the consultations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConsultations = sortedConsultations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedConsultations.length / itemsPerPage);
  
  const SortIcon = ({ field }: { field: keyof Consultation }) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  const renderSortableHeader = (label: string, field: keyof Consultation) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // If near the start
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // If near the end
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy");
  };
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ContentLoader text="Loading consultation requests..." />
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader('Name', 'name')}
              {renderSortableHeader('Company', 'company')}
              {renderSortableHeader('Phone', 'phone')}
              {renderSortableHeader('Interested In', 'interestedIn')}
              {renderSortableHeader('Industry', 'industry')}
              {renderSortableHeader('Status', 'status')}
              {renderSortableHeader('Date', 'createdAt')}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedConsultations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                  No consultation requests found
                </td>
              </tr>
            ) : (
              paginatedConsultations.map((consultation) => (
                <tr 
                  key={consultation.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onView(consultation)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                    <div className="text-xs text-gray-500">{consultation.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultation.company}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultation.phone}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultation.interestedIn}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultation.industry}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(consultation.createdAt)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(consultation);
                        }}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(consultation);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this consultation request?")) {
                            onDelete(consultation.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, consultations.length)}
                </span>{" "}
                of <span className="font-medium">{consultations.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {getPaginationNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages 
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 