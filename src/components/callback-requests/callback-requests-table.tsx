"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2,
  Eye,
  ChevronLeft, 
  ChevronRight,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { ContentLoader } from "@/components/ui/loader";

interface CallbackRequest {
  id: string;
  mobileNumber: string;
  assignedTo: string;
  status: string;
}

interface CallbackRequestsTableProps {
  callbackRequests: CallbackRequest[];
  onView: (callbackRequest: CallbackRequest) => void;
  onEdit: (callbackRequest: CallbackRequest) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function CallbackRequestsTable({
  callbackRequests,
  onView,
  onEdit,
  onDelete,
  loading = false
}: CallbackRequestsTableProps) {
  const [sortField, setSortField] = useState<keyof CallbackRequest>("mobileNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Reset to page 1 when callbacks change
  useEffect(() => {
    setCurrentPage(1);
  }, [callbackRequests.length]);
  
  const handleSort = (field: keyof CallbackRequest) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Sort the callback requests
  const sortedCallbackRequests = [...callbackRequests].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  // Paginate the callback requests
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCallbackRequests = sortedCallbackRequests.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedCallbackRequests.length / itemsPerPage);
  
  const SortIcon = ({ field }: { field: keyof CallbackRequest }) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  const renderSortableHeader = (label: string, field: keyof CallbackRequest) => (
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'missed':
        return 'bg-purple-100 text-purple-800';
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
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ContentLoader text="Loading callback requests..." />
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader('Mobile Number', 'mobileNumber')}
              {renderSortableHeader('Assigned To', 'assignedTo')}
              {renderSortableHeader('Status', 'status')}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCallbackRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                  No callback requests found
                </td>
              </tr>
            ) : (
              paginatedCallbackRequests.map((callback) => {
                return (
                  <tr 
                    key={callback.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onView(callback)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{callback.mobileNumber}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {callback.assignedTo || <span className="text-gray-400 italic">Not assigned</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(callback.status)}`}>
                        {callback.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(callback);
                          }}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(callback);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(callback.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            <div className="hidden md:flex">
              {getPaginationNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    page === currentPage
                      ? 'border-teal-500 bg-teal-50 text-teal-600 z-10'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium mx-1 rounded-md`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 