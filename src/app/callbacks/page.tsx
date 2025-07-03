"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, PhoneCall, Users, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallbackRequestsTable } from "@/components/callback-requests/callback-requests-table";
import { CallbackRequestsTabs } from "@/components/callback-requests/callback-requests-tabs";
import { CallbackDetailSheet } from "@/components/callback-requests/callback-detail-sheet";
import { CallbackFormSheet } from "@/components/callback-requests/callback-form-sheet";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Simplified callback request interface
interface CallbackRequest {
  id: string;
  mobileNumber: string;
  assignedTo: string;
  status: string;
}

// Mock data for callback purposes
const mockCallbackRequests: CallbackRequest[] = [
  {
    id: "1",
    mobileNumber: "6370102556",
    assignedTo: "Vikas Kumar",
    status: "pending"
  },
  {
    id: "2",
    mobileNumber: "9876543210",
    assignedTo: "Rahul Sharma",
    status: "completed"
  },
  {
    id: "3",
    mobileNumber: "8765432109",
    assignedTo: "",
    status: "pending"
  }
];

export default function CallbackRequestsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [callbackRequests, setCallbackRequests] = useState<CallbackRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCallback, setSelectedCallback] = useState<CallbackRequest | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingCallback, setEditingCallback] = useState<CallbackRequest | null>(null);
  
  // Load callback requests (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setCallbackRequests(mockCallbackRequests);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleViewCallback = (callback: CallbackRequest) => {
    setSelectedCallback(callback);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddCallback = () => {
    setEditingCallback(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditCallback = (callback: CallbackRequest) => {
    setEditingCallback(callback);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteCallback = (id: string) => {
    // In a real app, you would call an API to delete the callback request
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveCallback = (callbackData: Partial<CallbackRequest>) => {
    // In a real app, you would call an API to save the callback request
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter callback requests based on search
  const filteredCallbackRequests = callbackRequests.filter(callback => 
    callback.mobileNumber.includes(searchQuery) ||
    callback.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate stats
  const totalCallbacks = callbackRequests.length;
  const assignedCallbacks = callbackRequests.filter(callback => 
    callback.assignedTo !== ""
  ).length;
  const pendingCallbacks = callbackRequests.filter(callback => 
    callback.status === "pending"
  ).length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Callback Requests</h1>
      
      <div className="flex flex-col gap-4">
        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-teal-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalCallbacks}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-teal-500 mr-1">
                    <Clock className="h-3 w-3 mr-1" />
                    All callbacks
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{assignedCallbacks}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Assigned callbacks
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-orange-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{pendingCallbacks}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <PhoneCall className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-orange-500 mr-1">
                    <PhoneCall className="h-3 w-3 mr-1" />
                    Waiting for callback
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
              placeholder="Search by mobile number or agent..."
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
            
            <Button onClick={handleAddCallback} className="flex items-center">
              <PhoneCall className="mr-2 h-4 w-4" />
              Add Callback
            </Button>
          </div>
        </div>
      </div>
      
      <CallbackRequestsTabs />
      
      <div className="mt-6">
        <CallbackRequestsTable 
          callbackRequests={filteredCallbackRequests}
          onView={handleViewCallback}
          onEdit={handleEditCallback}
          onDelete={handleDeleteCallback}
          loading={loading}
        />
      </div>
      
      <CallbackDetailSheet
        callbackRequest={selectedCallback}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditCallback}
        onDelete={handleDeleteCallback}
      />
      
      <CallbackFormSheet
        callbackRequest={editingCallback}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveCallback}
      />
    </div>
  );
} 