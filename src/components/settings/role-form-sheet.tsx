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
import { X, Save, Shield } from "lucide-react";
import { useLoading } from "@/components/layout/loading-provider";

// Define the role structure
interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Permission interface
interface Permission {
  id: string;
  label: string;
}

interface RoleFormSheetProps {
  role?: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
  availablePermissions: Record<string, Permission[]>;
}

export function RoleFormSheet({
  role,
  isOpen,
  onClose,
  onSave,
  availablePermissions
}: RoleFormSheetProps) {
  const isEditing = !!role;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startAIProcessing, endAIProcessing } = useLoading();
  
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    label: '',
    description: '',
    permissions: [],
  });
  
  const [permissionCategories, setPermissionCategories] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasAllPermissions, setHasAllPermissions] = useState(false);
  
  // Reset form when role changes
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        label: role.label,
        description: role.description,
      });
      
      if (role.permissions.includes('all')) {
        setHasAllPermissions(true);
        setSelectedPermissions([]);
      } else {
        setHasAllPermissions(false);
        setSelectedPermissions(role.permissions);
      }
    } else {
      setFormData({
        name: '',
        label: '',
        description: '',
      });
      setHasAllPermissions(false);
      setSelectedPermissions([]);
    }
  }, [role]);
  
  // Extract permission categories
  useEffect(() => {
    setPermissionCategories(Object.keys(availablePermissions));
  }, [availablePermissions]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    
    if (checked) {
      setSelectedPermissions(prev => [...prev, value]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== value));
    }
  };
  
  const handleAllPermissionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasAllPermissions(e.target.checked);
    if (e.target.checked) {
      setSelectedPermissions([]);
    }
  };
  
  const handleCategorySelectAll = (category: string, checked: boolean) => {
    const categoryPermissions = availablePermissions[category].map(p => p.id);
    
    if (checked) {
      // Add all category permissions that aren't already selected
      const newPermissions = [...selectedPermissions];
      categoryPermissions.forEach(permission => {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }
      });
      setSelectedPermissions(newPermissions);
    } else {
      // Remove all category permissions
      setSelectedPermissions(selectedPermissions.filter(
        permission => !categoryPermissions.includes(permission)
      ));
    }
  };
  
  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = availablePermissions[category].map(p => p.id);
    return categoryPermissions.every(permission => selectedPermissions.includes(permission));
  };
  
  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = availablePermissions[category].map(p => p.id);
    return categoryPermissions.some(permission => selectedPermissions.includes(permission)) 
      && !isCategoryFullySelected(category);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label) {
      alert("Please fill out all required fields.");
      return;
    }
    
    // Ensure role name is URL-friendly
    const nameRegex = /^[a-z0-9-]+$/;
    if (!nameRegex.test(formData.name || '')) {
      alert("Role name can only contain lowercase letters, numbers, and hyphens.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Combine form data with permissions
    const roleData = {
      ...formData,
      permissions: hasAllPermissions ? ['all'] : selectedPermissions,
    };
    
    // Simulate API call delay
    startAIProcessing("Processing role data...");
    
    setTimeout(() => {
      endAIProcessing();
      setIsSubmitting(false);
      onSave(roleData);
    }, 1000);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-teal-500 mr-2" />
              <SheetTitle>{isEditing ? 'Edit Role' : 'Create New Role'}</SheetTitle>
            </div>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
              
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  required
                  value={formData.label || ''}
                  onChange={handleChange}
                  placeholder="e.g., Sales Representative"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="e.g., sales-rep (lowercase, no spaces)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use lowercase letters, numbers, and hyphens only. No spaces.
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the purpose and responsibilities of this role"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            {/* Permissions Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
              
              <div className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasAllPermissions}
                    onChange={handleAllPermissionsChange}
                    className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium">
                    Grant All Permissions (Administrator Access)
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  This will give this role access to all current and future features.
                </p>
              </div>
              
              {!hasAllPermissions && (
                <div className="space-y-6 mt-4">
                  {permissionCategories.map(category => (
                    <div key={category} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={isCategoryFullySelected(category)}
                          onChange={(e) => handleCategorySelectAll(category, e.target.checked)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          aria-label={`Select all permissions in ${category}`}
                        />
                        <label 
                          htmlFor={`category-${category}`} 
                          className="ml-2 block text-sm font-medium text-gray-900 capitalize"
                        >
                          {category}
                          {isCategoryPartiallySelected(category) && (
                            <span className="ml-2 text-xs text-teal-600">(partially selected)</span>
                          )}
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                        {availablePermissions[category].map(permission => (
                          <label key={permission.id} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              value={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={handlePermissionChange}
                              className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            {permission.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-gray-200">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex items-center"
                disabled={isSubmitting}
              >
                Cancel
                <X className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role'}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 