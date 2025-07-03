"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Shield, 
  ChevronDown,
  Edit,
  Trash2,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";
import { RoleFormSheet } from "@/components/user-management/role-form-sheet";

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

// Define all available permissions
const AVAILABLE_PERMISSIONS = {
  users: [
    { id: 'users.view', label: 'View Users' },
    { id: 'users.create', label: 'Create Users' },
    { id: 'users.edit', label: 'Edit Users' },
    { id: 'users.delete', label: 'Delete Users' },
  ],
  roles: [
    { id: 'roles.view', label: 'View Roles' },
    { id: 'roles.create', label: 'Create Roles' },
    { id: 'roles.edit', label: 'Edit Roles' },
    { id: 'roles.delete', label: 'Delete Roles' },
  ],
  leads: [
    { id: 'leads.view', label: 'View Leads' },
    { id: 'leads.create', label: 'Create Leads' },
    { id: 'leads.edit', label: 'Edit Leads' },
    { id: 'leads.delete', label: 'Delete Leads' },
  ],
  demos: [
    { id: 'demo.view', label: 'View Demos' },
    { id: 'demo.schedule', label: 'Schedule Demos' },
    { id: 'demo.edit', label: 'Edit Demos' },
    { id: 'demo.delete', label: 'Delete Demos' },
  ],
  support: [
    { id: 'tickets.view', label: 'View Tickets' },
    { id: 'tickets.respond', label: 'Respond to Tickets' },
    { id: 'tickets.resolve', label: 'Resolve Tickets' },
  ],
  marketing: [
    { id: 'marketing.view', label: 'View Marketing' },
    { id: 'marketing.edit', label: 'Edit Marketing' },
    { id: 'marketing.campaigns', label: 'Manage Campaigns' },
  ],
};

// Mock data for roles
const mockRoles: Role[] = [
  {
    id: "1",
    name: "admin",
    label: "Administrator",
    description: "Full system access with all permissions",
    permissions: ["all"],
    isSystem: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "manager",
    label: "Manager",
    description: "Sales manager with access to leads and demos",
    permissions: ["users.view", "users.create", "leads.view", "leads.create", "leads.edit", "demo.view", "demo.schedule"],
    isSystem: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    name: "support",
    label: "Support Staff",
    description: "Customer support with access to tickets",
    permissions: ["tickets.view", "tickets.respond"],
    isSystem: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    name: "marketing",
    label: "Marketing Staff",
    description: "Marketing team with access to campaigns",
    permissions: ["marketing.view", "marketing.edit"],
    isSystem: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "5",
    name: "custom-sales",
    label: "Sales Representative",
    description: "Sales team with limited access",
    permissions: ["leads.view", "leads.create", "demo.view"],
    isSystem: false,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-20"),
  },
];

export default function RolesManagementPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Load roles (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setRoles(mockRoles);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleAddRole = () => {
    setEditingRole(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditRole = (role: Role) => {
    // System roles can't be edited
    if (role.isSystem) {
      alert("System roles cannot be edited.");
      return;
    }
    
    setEditingRole(role);
    setIsFormSheetOpen(true);
  };
  
  const handleDeleteRole = (id: string) => {
    // Find the role
    const role = roles.find(r => r.id === id);
    
    // System roles can't be deleted
    if (role?.isSystem) {
      alert("System roles cannot be deleted.");
      return;
    }
    
    // In a real app, you would call an API to delete the role
    if (window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };
  
  const handleSaveRole = (roleData: Partial<Role>) => {
    // In a real app, you would call an API to save the role
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id ? 
        { 
          ...role, 
          ...roleData, 
          updatedAt: new Date()
        } : role
      ));
    } else {
      // Add new role
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleData.name || `role-${Date.now()}`,
        label: roleData.label || "New Role",
        description: roleData.description || "",
        permissions: roleData.permissions || [],
        isSystem: false,
        createdAt: new Date(),
      };
      setRoles([...roles, newRole]);
    }
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    role.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count custom roles
  const customRolesCount = roles.filter(role => !role.isSystem).length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Manage roles and their permissions. Each role defines a set of permissions that determine
          what actions users with that role can perform in the system.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Stats card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">System Roles</h3>
              <p className="text-2xl font-semibold mt-1">{roles.filter(role => role.isSystem).length}</p>
              <p className="text-xs text-gray-500 mt-1">
                System roles are built-in and cannot be modified or deleted.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Custom Roles</h3>
              <p className="text-2xl font-semibold mt-1">{customRolesCount}</p>
              <p className="text-xs text-gray-500 mt-1">
                Custom roles can be created, modified, and deleted as needed.
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and action buttons row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
            />
          </div>
          
          <Button onClick={handleAddRole} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>
      
      {/* Roles Table */}
      <div className="mt-6">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <ContentLoader text="Loading roles..." />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                        No roles found
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-teal-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{role.label}</div>
                              <div className="text-xs text-gray-500">{role.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{role.description}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {role.permissions.includes("all") ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                All Permissions
                              </span>
                            ) : (
                              <div>
                                <span className="text-gray-700 text-xs">{role.permissions.length} permissions</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {role.permissions.slice(0, 3).map((perm, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-xs"
                                    >
                                      {perm}
                                    </span>
                                  ))}
                                  {role.permissions.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                      +{role.permissions.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {role.isSystem ? (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              System
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                              Custom
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditRole(role)}
                              disabled={role.isSystem}
                              className={`text-blue-600 hover:text-blue-900 ${
                                role.isSystem ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              disabled={role.isSystem}
                              className={`text-red-600 hover:text-red-900 ${
                                role.isSystem ? "opacity-50 cursor-not-allowed" : ""
                              }`}
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
          </div>
        )}
      </div>
      
      {/* Create/Edit Role Sheet */}
      <RoleFormSheet
        role={editingRole}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveRole}
        availablePermissions={AVAILABLE_PERMISSIONS}
      />
    </div>
  );
} 