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
  Shield,
  Clock
} from "lucide-react";
import { ContentLoader } from "@/components/ui/loader";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastActive?: Date;
  createdAt: Date;
  department?: string;
}

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  currentUserRole: string;
  hasPermission: (permission: string) => boolean;
}

export function UsersTable({
  users,
  onView,
  onEdit,
  onDelete,
  loading = false,
  currentUserRole,
  hasPermission
}: UsersTableProps) {
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Reset to page 1 when users change
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);
  
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Sort the users
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    if (sortField === "lastActive" || sortField === "createdAt") {
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
  
  // Paginate the users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  
  const SortIcon = ({ field }: { field: keyof User }) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  const renderSortableHeader = (label: string, field: keyof User) => (
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
  
  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'support':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
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
    return format(new Date(date), "dd MMM yyyy");
  };

  // Format time for display
  const formatLastActive = (date?: Date) => {
    if (!date) return "Never";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ContentLoader text="Loading users..." />
      </div>
    );
  }
  
  // Check if user can view, edit, delete based on permissions
  const canView = hasPermission("users.view");
  const canEdit = (user: User): boolean => {
    if (!hasPermission("users.edit")) return false;
    if (user.role === "admin" && currentUserRole !== "admin") return false;
    return true;
  };
  
  const canDelete = (user: User): boolean => {
    if (!hasPermission("users.delete")) return false;
    if (user.role === "admin" && currentUserRole !== "admin") return false;
    return true;
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader('Name', 'name')}
              {renderSortableHeader('Email', 'email')}
              {renderSortableHeader('Role', 'role')}
              {renderSortableHeader('Department', 'department')}
              {renderSortableHeader('Status', 'status')}
              {renderSortableHeader('Last Active', 'lastActive')}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => canView && onView(user)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.department || "N/A"}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatLastActive(user.lastActive)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      {canView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(user);
                          }}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      {canEdit(user) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(user);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      
                      {canDelete(user) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(user.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
        <div className="px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, users.length)}
                </span>{" "}
                of <span className="font-medium">{users.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {getPaginationNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      page === currentPage 
                      ? 'bg-teal-50 border-teal-500 text-teal-600 z-10' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
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