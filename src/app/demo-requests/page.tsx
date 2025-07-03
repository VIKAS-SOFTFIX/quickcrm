"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, Calendar, Users, CalendarClock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoRequestsTable } from "@/components/demo-requests/demo-requests-table";
import { DemoRequestsTabs } from "@/components/demo-requests/demo-requests-tabs";
import { DemoDetailSheet } from "@/components/demo-requests/demo-detail-sheet";
import { DemoFormSheet } from "@/components/demo-requests/demo-form-sheet";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Demo request interface
interface DemoRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessName: string;
  preferredDate: Date;
  status: string;
  assignedTo?: string;
  createdAt: Date;
  notes?: string;
}

// Mock data for demo purposes
const mockDemoRequests: DemoRequest[] = [
  {
    id: "1",
    name: "VIKAS KUMAR VERMA",
    company: "QUICKBID SYSTEMS PRIVATE LIMITED",
    email: "vikas@quickbid.co.in",
    phone: "6370102556",
    businessName: "QUICKBID SYSTEMS PRIVATE LIMITED",
    preferredDate: new Date("2025-06-18T13:48:00"),
    status: "scheduled",
    createdAt: new Date("2025-06-18"),
    notes: ""
  }
];

export default function DemoRequestsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDemo, setSelectedDemo] = useState<DemoRequest | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<DemoRequest | null>(null);
  
  // Load demo requests (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setDemoRequests(mockDemoRequests);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleViewDemo = (demo: DemoRequest) => {
    setSelectedDemo(demo);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddDemo = () => {
    setEditingDemo(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditDemo = (demo: DemoRequest) => {
    setEditingDemo(demo);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteDemo = (id: string) => {
    // In a real app, you would call an API to delete the demo request
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveDemo = (demoData: Partial<DemoRequest>) => {
    // In a real app, you would call an API to save the demo request
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter demo requests based on search
  const filteredDemoRequests = demoRequests.filter(demo => 
    demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.phone.includes(searchQuery)
  );
  
  // Calculate stats
  const totalDemos = demoRequests.length;
  const todayDemos = demoRequests.filter(demo => 
    new Date(demo.preferredDate).toDateString() === new Date().toDateString()
  ).length;
  const upcomingDemos = demoRequests.filter(demo => 
    new Date(demo.preferredDate) > new Date()
  ).length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demo Requests</h1>
      
      <div className="flex flex-col gap-4">
        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-teal-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalDemos}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-teal-500 mr-1">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    All time
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{todayDemos}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Today's schedule
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-purple-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{upcomingDemos}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <CalendarClock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-purple-500 mr-1">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Future schedule
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
              placeholder="Search by name, company, phone..."
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
            
            <Button onClick={handleAddDemo} className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>
      </div>
      
      <DemoRequestsTabs />
      
      <div className="mt-6">
        <DemoRequestsTable 
          demoRequests={filteredDemoRequests}
          onView={handleViewDemo}
          onEdit={handleEditDemo}
          onDelete={handleDeleteDemo}
          loading={loading}
        />
      </div>
      
      <DemoDetailSheet
        demoRequest={selectedDemo}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditDemo}
        onDelete={handleDeleteDemo}
      />
      
      <DemoFormSheet
        demoRequest={editingDemo}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveDemo}
      />
    </div>
  );
} 