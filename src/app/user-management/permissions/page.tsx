"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Lock, Info, ChevronDown, ChevronUp, Edit, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Permission interface
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Mock data for permissions
const mockPermissions: Permission[] = [
  // Dashboard & Overview permissions
  {
    id: "dashboard.view",
    name: "View Dashboard",
    description: "Can view the main dashboard",
    category: "overview",
  },
  {
    id: "dashboard.edit",
    name: "Edit Dashboard",
    description: "Can customize and edit dashboard widgets",
    category: "overview",
  },
  {
    id: "calendar.view",
    name: "View Calendar",
    description: "Can view calendar events",
    category: "overview",
  },
  {
    id: "calendar.edit",
    name: "Edit Calendar",
    description: "Can create and edit calendar events",
    category: "overview",
  },
  
  // Pipeline permissions
  {
    id: "leads.view",
    name: "View Leads",
    description: "Can view lead list and details",
    category: "pipeline",
  },
  {
    id: "leads.create",
    name: "Create Leads",
    description: "Can create new leads",
    category: "pipeline",
  },
  {
    id: "leads.edit",
    name: "Edit Leads",
    description: "Can edit lead details",
    category: "pipeline",
  },
  {
    id: "leads.delete",
    name: "Delete Leads",
    description: "Can delete leads",
    category: "pipeline",
  },
  {
    id: "enterprise.view",
    name: "View Enterprise Leads",
    description: "Can view enterprise leads",
    category: "pipeline",
  },
  {
    id: "enterprise.manage",
    name: "Manage Enterprise Leads",
    description: "Can manage enterprise leads",
    category: "pipeline",
  },
  {
    id: "demo.view",
    name: "View Demos",
    description: "Can view demo requests",
    category: "pipeline",
  },
  {
    id: "demo.schedule",
    name: "Schedule Demos",
    description: "Can schedule demo sessions",
    category: "pipeline",
  },
  {
    id: "demo.edit",
    name: "Edit Demos",
    description: "Can edit demo requests",
    category: "pipeline",
  },
  {
    id: "demo.delete",
    name: "Delete Demos",
    description: "Can delete demo requests",
    category: "pipeline",
  },
  {
    id: "callbacks.view",
    name: "View Callbacks",
    description: "Can view callback requests",
    category: "pipeline",
  },
  {
    id: "callbacks.manage",
    name: "Manage Callbacks",
    description: "Can manage callback requests",
    category: "pipeline",
  },
  {
    id: "consultations.view",
    name: "View Consultations",
    description: "Can view expert consultation requests",
    category: "pipeline",
  },
  {
    id: "consultations.manage",
    name: "Manage Consultations",
    description: "Can manage expert consultation requests",
    category: "pipeline",
  },
  
  // Communications permissions
  {
    id: "email.view",
    name: "View Emails",
    description: "Can view emails in the inbox",
    category: "communications",
  },
  {
    id: "email.send",
    name: "Send Emails",
    description: "Can send emails",
    category: "communications",
  },
  {
    id: "email.delete",
    name: "Delete Emails",
    description: "Can delete emails",
    category: "communications",
  },
  {
    id: "whatsapp.view",
    name: "View WhatsApp",
    description: "Can view WhatsApp chats",
    category: "communications",
  },
  {
    id: "whatsapp.send",
    name: "Send WhatsApp",
    description: "Can send WhatsApp messages",
    category: "communications",
  },
  
  // Marketing permissions
  {
    id: "email.marketing.view",
    name: "View Email Marketing",
    description: "Can view email marketing campaigns",
    category: "marketing",
  },
  {
    id: "email.marketing.create",
    name: "Create Email Marketing",
    description: "Can create email marketing campaigns",
    category: "marketing",
  },
  {
    id: "email.marketing.edit",
    name: "Edit Email Marketing",
    description: "Can edit email marketing campaigns",
    category: "marketing",
  },
  {
    id: "whatsapp.marketing.view",
    name: "View WhatsApp Marketing",
    description: "Can view WhatsApp marketing campaigns",
    category: "marketing",
  },
  {
    id: "whatsapp.marketing.manage",
    name: "Manage WhatsApp Marketing",
    description: "Can manage WhatsApp marketing campaigns",
    category: "marketing",
  },
  {
    id: "meta.ads.view",
    name: "View Meta Ads",
    description: "Can view Meta advertising campaigns",
    category: "marketing",
  },
  {
    id: "meta.ads.manage",
    name: "Manage Meta Ads",
    description: "Can manage Meta advertising campaigns",
    category: "marketing",
  },
  {
    id: "google.ads.view",
    name: "View Google Ads",
    description: "Can view Google advertising campaigns",
    category: "marketing",
  },
  {
    id: "google.ads.manage",
    name: "Manage Google Ads",
    description: "Can manage Google advertising campaigns",
    category: "marketing",
  },
  {
    id: "analytics.view",
    name: "View Analytics",
    description: "Can view marketing analytics",
    category: "marketing",
  },
  
  // SEO permissions
  {
    id: "google.business.view",
    name: "View Google Business",
    description: "Can view Google Business profile",
    category: "seo",
  },
  {
    id: "google.business.manage",
    name: "Manage Google Business",
    description: "Can manage Google Business profile",
    category: "seo",
  },
  {
    id: "seo.automation.view",
    name: "View SEO Automation",
    description: "Can view AI SEO automation tools",
    category: "seo",
  },
  {
    id: "seo.automation.manage",
    name: "Manage SEO Automation",
    description: "Can manage AI SEO automation tools",
    category: "seo",
  },
  {
    id: "seo.analytics.view",
    name: "View SEO Analytics",
    description: "Can view SEO analytics",
    category: "seo",
  },
  
  // User Management permissions
  {
    id: "users.view",
    name: "View Users",
    description: "Can view user list and details",
    category: "user_management",
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Can create new users",
    category: "user_management",
  },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Can edit user details",
    category: "user_management",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Can delete users",
    category: "user_management",
  },
  {
    id: "roles.view",
    name: "View Roles",
    description: "Can view roles and their permissions",
    category: "user_management",
  },
  {
    id: "roles.create",
    name: "Create Roles",
    description: "Can create new roles",
    category: "user_management",
  },
  {
    id: "roles.edit",
    name: "Edit Roles",
    description: "Can edit existing roles",
    category: "user_management",
  },
  {
    id: "roles.delete",
    name: "Delete Roles",
    description: "Can delete roles",
    category: "user_management",
  },
  {
    id: "permissions.view",
    name: "View Permissions",
    description: "Can view permissions",
    category: "user_management",
  },
  {
    id: "permissions.manage",
    name: "Manage Permissions",
    description: "Can manage permissions",
    category: "user_management",
  },
  
  // Administration permissions
  {
    id: "settings.view",
    name: "View Settings",
    description: "Can view system settings",
    category: "administration",
  },
  {
    id: "settings.manage",
    name: "Manage Settings",
    description: "Can manage system settings",
    category: "administration",
  },
  {
    id: "tickets.view",
    name: "View Tickets",
    description: "Can view support tickets",
    category: "administration",
  },
  {
    id: "tickets.respond",
    name: "Respond to Tickets",
    description: "Can respond to support tickets",
    category: "administration",
  },
  {
    id: "tickets.resolve",
    name: "Resolve Tickets",
    description: "Can mark tickets as resolved",
    category: "administration",
  },
  {
    id: "subscription.view",
    name: "View Subscription",
    description: "Can view subscription details",
    category: "administration",
  },
  {
    id: "subscription.manage",
    name: "Manage Subscription",
    description: "Can manage subscription plans",
    category: "administration",
  },
  {
    id: "help.view",
    name: "View Help",
    description: "Can view help and support resources",
    category: "administration",
  }
];

export default function PermissionsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [newPermission, setNewPermission] = useState<Partial<Permission>>({
    name: '',
    id: '',
    description: '',
    category: ''
  });
  
  // Load permissions (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setPermissions(mockPermissions);
      
      // Initialize all categories as expanded
      const categories = Array.from(new Set(mockPermissions.map(p => p.category)));
      const initialExpandState: Record<string, boolean> = {};
      categories.forEach(cat => {
        initialExpandState[cat] = true;
      });
      setExpandedCategories(initialExpandState);
      
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setNewPermission({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      category: permission.category
    });
  };

  const handleDeletePermission = (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission? This may affect existing roles.")) {
      setPermissions(permissions.filter(p => p.id !== id));
    }
  };

  const handleAddPermission = () => {
    setIsAddingPermission(true);
    setNewPermission({
      id: '',
      name: '',
      description: '',
      category: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPermission(null);
    setIsAddingPermission(false);
  };

  const handleSavePermission = () => {
    if (!newPermission.id || !newPermission.name || !newPermission.category) {
      alert("Permission ID, name and category are required");
      return;
    }

    // Format the permission ID
    const formattedId = newPermission.id.toLowerCase().replace(/\s+/g, '.');
    
    if (isAddingPermission) {
      // Check if permission ID already exists
      if (permissions.some(p => p.id === formattedId)) {
        alert("A permission with this ID already exists");
        return;
      }
      
      // Add new permission
      const permission: Permission = {
        id: formattedId,
        name: newPermission.name,
        description: newPermission.description || '',
        category: newPermission.category
      };
      
      setPermissions([...permissions, permission]);
    } else if (editingPermission) {
      // Update existing permission
      setPermissions(permissions.map(p => 
        p.id === editingPermission.id 
          ? { 
              ...p, 
              name: newPermission.name || p.name,
              description: newPermission.description || p.description,
              category: newPermission.category || p.category
            } 
          : p
      ));
    }
    
    setEditingPermission(null);
    setIsAddingPermission(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPermission(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get unique categories
  const categories = Array.from(new Set(permissions.map(p => p.category)));
  
  // Filter permissions based on search
  const filteredPermissions = permissions.filter(permission => 
    permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group permissions by category
  const permissionsByCategory: Record<string, Permission[]> = {};
  filteredPermissions.forEach(permission => {
    if (!permissionsByCategory[permission.category]) {
      permissionsByCategory[permission.category] = [];
    }
    permissionsByCategory[permission.category].push(permission);
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <Button 
          onClick={handleAddPermission}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Manage all available permissions in the system. Permissions define what actions users can perform.
        </p>
      </div>
      
      {/* Permission Form */}
      {(isAddingPermission || editingPermission) && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">
            {isAddingPermission ? "Add New Permission" : "Edit Permission"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission Name*
              </label>
              <input
                type="text"
                name="name"
                value={newPermission.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., View Users"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission ID*
              </label>
              <input
                type="text"
                name="id"
                value={newPermission.id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., users.view"
                disabled={!!editingPermission}
                required
              />
              {isAddingPermission && (
                <p className="text-xs text-gray-500 mt-1">
                  Use format: category.action (e.g., users.view)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                name="category"
                value={newPermission.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
                <option value="new">+ New Category</option>
              </select>
            </div>
            {newPermission.category === 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Category Name*
                </label>
                <input
                  type="text"
                  name="newCategory"
                  onChange={(e) => setNewPermission(prev => ({...prev, category: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., analytics"
                  required
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newPermission.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Describe what this permission allows"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSavePermission}>
              {isAddingPermission ? "Add Permission" : "Update Permission"}
            </Button>
          </div>
        </div>
      )}
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
          />
        </div>
      </div>
      
      {/* Permissions List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <ContentLoader text="Loading permissions..." />
          </div>
        ) : (
          Object.keys(permissionsByCategory).length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <Info className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No permissions found</h3>
              <p className="text-gray-500">
                Try adjusting your search query or add new permissions.
              </p>
            </div>
          ) : (
            Object.entries(permissionsByCategory).map(([category, perms]) => (
              <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Category header */}
                <div 
                  className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <h2 className="text-lg font-medium text-gray-900 capitalize">{category}</h2>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    {expandedCategories[category] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                {/* Category permissions */}
                {expandedCategories[category] && (
                  <div className="divide-y divide-gray-200">
                    {perms.map(permission => (
                      <div key={permission.id} className="px-6 py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <Lock className="h-4 w-4 text-teal-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-900">{permission.name}</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                            <p className="mt-1 text-xs text-gray-400">ID: {permission.id}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button 
                              onClick={() => handleEditPermission(permission)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePermission(permission.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">About Permissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Permissions define what actions users can perform in the system. After creating permissions here,
              you can assign them to roles in the 
              <Button 
                variant="link" 
                className="px-1 py-0 h-auto text-teal-600 font-medium"
                onClick={() => router.push('/user-management/roles')}
              >
                Role Management
              </Button> 
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 