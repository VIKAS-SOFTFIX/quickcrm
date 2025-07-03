"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Shield,
  Clock, 
  Edit, 
  Trash2,
  FileText,
  AlertCircle,
  UserCheck,
  Tag,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { useLoading } from "@/components/layout/loading-provider";

interface Role {
  name: string;
  label: string;
  permissions: string[];
}

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

interface UserDetailSheetProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  currentUserRole: string;
  roles: Record<string, Role>;
  hasPermission: (permission: string) => boolean;
}

export function UserDetailSheet({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  currentUserRole,
  roles,
  hasPermission
}: UserDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const { startApiRequest, endApiRequest } = useLoading();
  
  const handleDelete = () => {
    if (!user) return;
    
    // Check if user has delete permission
    if (!hasPermission('users.delete')) {
      alert("You don't have permission to delete users.");
      return;
    }
    
    if (isDeleting) {
      setIsProcessingDelete(true);
      startApiRequest();
      
      // Simulate API call delay
      setTimeout(() => {
        onDelete(user.id);
        setIsProcessingDelete(false);
        endApiRequest();
        onClose();
      }, 1000);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleEdit = () => {
    if (!user) return;
    
    // Check if user has edit permission
    if (!hasPermission('users.edit')) {
      alert("You don't have permission to edit users.");
      return;
    }
    
    // Additional check - only admin can edit admin users
    if (user.role === 'admin' && currentUserRole !== 'admin') {
      alert("Only administrators can edit admin users.");
      return;
    }
    
    onEdit(user);
  };
  
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
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return "Never";
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };
  
  if (!user) return null;
  
  // Get role information and permissions
  const roleInfo = roles[user.role] || { name: user.role, label: user.role, permissions: [] };
  
  // Check if current user has permissions to edit/delete this user
  const canEdit = hasPermission('users.edit') && 
    (currentUserRole === 'admin' || user.role !== 'admin');
    
  const canDelete = hasPermission('users.delete') && 
    (currentUserRole === 'admin' || user.role !== 'admin');
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-xl font-bold">{user.name}</SheetTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
              {roleInfo.label}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
              {user.status}
            </span>
            <span className="text-sm text-gray-500">
              Created on {formatDate(user.createdAt)}
            </span>
          </div>
          {user.department && (
            <div className="text-sm font-medium text-gray-700 mt-2">
              {user.department} Department
            </div>
          )}
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{user.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Role Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Role & Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{roleInfo.label}</p>
                  <p className="text-xs text-gray-500">Role</p>
                </div>
              </div>
              
              {user.department && (
                <div className="flex items-start">
                  <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{user.department}</p>
                    <p className="text-xs text-gray-500">Department</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">Permissions</p>
                  </div>
                  {roleInfo.permissions && roleInfo.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {roleInfo.permissions.includes('all') ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          All Permissions
                        </span>
                      ) : (
                        roleInfo.permissions.map((permission, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {permission}
                          </span>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No specific permissions</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{formatLastActive(user.lastActive)}</p>
                  <p className="text-xs text-gray-500">Last Active</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {user.status === 'active' ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        Inactive
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Account Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t border-gray-200">
          <div className="flex justify-between w-full">
            {canDelete ? (
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={isProcessingDelete}
                className="flex items-center"
              >
                {isDeleting ? 'Confirm Delete?' : 'Delete User'}
                <Trash2 className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
            
            {canEdit && (
              <Button
                onClick={handleEdit}
                className="flex items-center"
              >
                Edit User
                <Edit className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 