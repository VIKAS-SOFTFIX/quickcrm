"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, Users, Shield, UserCheck, UserCog, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/users/users-table";
import { UsersTabs } from "@/components/users/users-tabs";
import { UserDetailSheet } from "@/components/users/user-detail-sheet";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Define the role structure with associated permissions
interface Role {
  name: string;
  label: string;
  permissions: string[];
}

// Define the available roles with their permissions
const ROLES: Record<string, Role> = {
  admin: {
    name: "admin",
    label: "Administrator",
    permissions: ["all"]
  },
  manager: {
    name: "manager",
    label: "Manager",
    permissions: ["users.view", "users.create", "leads.view", "leads.create", "leads.edit", "demo.view", "demo.schedule"]
  },
  support: {
    name: "support",
    label: "Support Staff",
    permissions: ["tickets.view", "tickets.respond"]
  },
  marketing: {
    name: "marketing",
    label: "Marketing Staff",
    permissions: ["marketing.view", "marketing.edit"]
  }
};

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // References a role name from ROLES
  status: string;
  lastActive?: Date;
  createdAt: Date;
  department?: string;
}

// Define user role type for type safety
type UserRole = 'admin' | 'manager' | 'support' | 'marketing';

// Mock data for users with different roles
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@quickbid.co.in",
    phone: "1234567890",
    role: "admin",
    status: "active",
    lastActive: new Date(),
    createdAt: new Date("2023-01-15"),
    department: "Management"
  },
  {
    id: "2",
    name: "Sales Manager",
    email: "sales@quickbid.co.in",
    phone: "9876543210",
    role: "manager",
    status: "active",
    lastActive: new Date(),
    createdAt: new Date("2023-03-10"),
    department: "Sales"
  },
  {
    id: "3",
    name: "Support Staff",
    email: "support@quickbid.co.in",
    phone: "8765432109",
    role: "support",
    status: "active",
    lastActive: new Date("2023-06-20"),
    createdAt: new Date("2023-02-05"),
    department: "Support"
  },
  {
    id: "4",
    name: "Marketing Staff",
    email: "marketing@quickbid.co.in",
    phone: "7654321098",
    role: "marketing",
    status: "inactive",
    lastActive: new Date("2023-04-15"),
    createdAt: new Date("2023-01-25"),
    department: "Marketing"
  }
];

// Helper function to check if a user has a specific permission
function hasPermission(userRole: string, permission: string): boolean {
  const role = ROLES[userRole];
  if (!role) return false;
  
  if (role.permissions.includes("all")) return true;
  
  return role.permissions.includes(permission);
}

export default function UsersPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("all");
  
  // Current user role - in a real app this would come from authentication
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("admin");
  
  // Load users (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleViewUser = (user: User) => {
    // Check if current user has permission to view user details
    if (!hasPermission(currentUserRole, "users.view")) {
      alert("You don't have permission to view user details.");
      return;
    }
    
    setSelectedUser(user);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddUser = () => {
    // Check if current user has permission to create users
    if (!hasPermission(currentUserRole, "users.create")) {
      alert("You don't have permission to add users.");
      return;
    }
    
    setEditingUser(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    // Check if current user has permission to edit users
    if (!hasPermission(currentUserRole, "users.edit")) {
      alert("You don't have permission to edit users.");
      return;
    }
    
    // Additional check - only admin can edit admin users
    if (user.role === "admin" && currentUserRole !== "admin") {
      alert("Only administrators can edit admin users.");
      return;
    }
    
    setEditingUser(user);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteUser = (id: string) => {
    // Check if current user has permission to delete users
    if (!hasPermission(currentUserRole, "users.delete")) {
      alert("You don't have permission to delete users.");
      return;
    }
    
    // In a real app, you would call an API to delete the user
    setUsers(users.filter(user => user.id !== id));
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveUser = (userData: Partial<User>) => {
    // In a real app, you would call an API to save the user
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "support",
        status: "active",
        createdAt: new Date(),
        department: userData.department,
      };
      setUsers([...users, newUser]);
    }
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };
  
  // Filter users based on search and selected role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
      
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });
  
  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === "admin").length;
  const activeUsers = users.filter(user => user.status === "active").length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        {/* Add link to role management */}
        {hasPermission(currentUserRole, "roles.view") && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/user-management/roles')}
            className="flex items-center"
          >
            <Shield className="mr-2 h-4 w-4" />
            Manage Roles
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-teal-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalUsers}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-teal-500 mr-1">
                    All registered users
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{adminUsers}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    Users with admin privileges
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-purple-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{activeUsers}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-purple-500 mr-1">
                    Currently active users
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
              placeholder="Search by name, email, phone..."
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
            
            {/* Only show add user button for users with create permission */}
            {hasPermission(currentUserRole, "users.create") && (
              <Button onClick={handleAddUser} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Role selector tabs */}
      <UsersTabs onRoleChange={handleRoleChange} currentRole={selectedRole} />
      
      <div className="mt-6">
        <UsersTable 
          users={filteredUsers}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          loading={loading}
          currentUserRole={currentUserRole}
          hasPermission={(permission) => hasPermission(currentUserRole, permission)}
        />
      </div>
      
      <UserDetailSheet
        user={selectedUser}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        currentUserRole={currentUserRole}
        roles={ROLES}
        hasPermission={(permission) => hasPermission(currentUserRole, permission)}
      />
      
      <UserFormSheet
        user={editingUser}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveUser}
        currentUserRole={currentUserRole}
        roles={ROLES}
        hasPermission={(permission) => hasPermission(currentUserRole, permission)}
      />
      
      {/* Role switcher for demonstration purposes - in a real app this would be based on authentication */}
      {currentUserRole === 'admin' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Demo Role Switcher</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={(currentUserRole as UserRole) === 'admin' ? "default" : "outline"}
              onClick={() => setCurrentUserRole('admin')}
              size="sm"
            >
              Admin View
            </Button>
            <Button 
              variant={(currentUserRole as UserRole) === 'manager' ? "default" : "outline"}
              onClick={() => setCurrentUserRole('manager')}
              size="sm"
            >
              Manager View
            </Button>
            <Button 
              variant={(currentUserRole as UserRole) === 'support' ? "default" : "outline"}
              onClick={() => setCurrentUserRole('support')}
              size="sm"
            >
              Support View
            </Button>
            <Button 
              variant={(currentUserRole as UserRole) === 'marketing' ? "default" : "outline"}
              onClick={() => setCurrentUserRole('marketing')}
              size="sm"
            >
              Marketing View
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is for demonstration purposes only. In a real app, roles would be determined by authentication.
          </p>
        </div>
      )}
    </div>
  );
} 