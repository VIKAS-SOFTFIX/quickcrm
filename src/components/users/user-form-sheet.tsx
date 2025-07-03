"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Save, User, Shield } from "lucide-react";
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

interface UserFormSheetProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  currentUserRole: string;
  roles: Record<string, Role>;
  hasPermission: (permission: string) => boolean;
}

export function UserFormSheet({
  user,
  isOpen,
  onClose,
  onSave,
  currentUserRole,
  roles,
  hasPermission
}: UserFormSheetProps) {
  const isEditing = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  // Define roles that can be assigned based on current user's role and permissions
  const assignableRoles = Object.values(roles)
    .filter(role => {
      // Only admin can assign admin role
      if (role.name === 'admin') return currentUserRole === 'admin';
      // Managers can assign support and marketing roles
      if (currentUserRole === 'manager') return role.name === 'support' || role.name === 'marketing';
      // Admin can assign any role
      return currentUserRole === 'admin';
    });
    
  const departments = [
    'Management',
    'Sales',
    'Marketing',
    'Support',
    'Development',
    'Finance',
    'HR'
  ];
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'support',
    status: 'active',
    department: '',
  });
  
  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        ...user
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'support',
        status: 'active',
        department: '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill out all required fields.");
      return;
    }
    
    // Make sure the selected role is valid
    if (!Object.keys(roles).includes(formData.role || '')) {
      alert("Please select a valid role.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    startAIProcessing("Processing user data...");
    
    setTimeout(() => {
      endAIProcessing();
      setIsSubmitting(false);
      onSave({
        ...formData,
      });
    }, 1500);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="pb-4 border-b border-gray-200">
            <SheetTitle>{isEditing ? 'Edit User' : 'Add New User'}</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Basic Info Section */}
              <h3 className="text-sm font-medium text-gray-500 mb-1">Basic Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Role & Access</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role || 'support'}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {assignableRoles.map(role => (
                        <option key={role.name} value={role.name}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    
                    {formData.role && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Permissions: {roles[formData.role]?.permissions.includes('all') 
                            ? 'All Permissions' 
                            : roles[formData.role]?.permissions.join(', ') || 'None'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status || 'active'}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Role permission explanation */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">About Roles and Permissions</h4>
                <p className="text-xs text-gray-500">
                  In this system, permissions are assigned to roles, not directly to users.
                  When you assign a role to a user, they automatically inherit all permissions
                  associated with that role.
                </p>
                
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Available Roles:</h5>
                  <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                    {Object.values(roles).map((role) => (
                      <li key={role.name}>
                        <span className="font-medium">{role.label}:</span> {role.permissions.includes('all') 
                          ? 'All permissions' 
                          : role.permissions.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-gray-200">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex items-center"
              >
                Cancel
                <X className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 