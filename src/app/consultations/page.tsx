"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Filter, Calendar, Users, CalendarClock, Clock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationsTable } from "@/components/consultations/consultations-table";
import { ConsultationsTabs } from "@/components/consultations/consultations-tabs";
import { ConsultationDetailSheet } from "@/components/consultations/consultation-detail-sheet";
import { ConsultationFormSheet } from "@/components/consultations/consultation-form";
import { ContentLoader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";

// Consultation interface
interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  interestedIn: string;
  industry: string;
  status: string;
  assignedTo?: string;
  createdAt: Date;
  scheduledDate?: Date;
  notes?: string;
}

// Mock data for consultations
const mockConsultations: Consultation[] = [
  {
    id: "1",
    name: "VIKAS KUMAR VERMA",
    email: "vikas@quickbid.co.in",
    phone: "6370102556",
    company: "QUICKBID SYSTEMS PRIVATE LIMITED",
    interestedIn: "CRM Implementation",
    industry: "Software",
    status: "pending",
    createdAt: new Date("2025-06-18"),
    notes: ""
  }
];

export default function ConsultationsPage() {
  const router = useRouter();
  const { startApiRequest, endApiRequest } = useLoading();
  
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  
  // Load consultations (simulated)
  useEffect(() => {
    startApiRequest();
    // Simulate API call
    setTimeout(() => {
      setConsultations(mockConsultations);
      setLoading(false);
      endApiRequest();
    }, 1000);
    
    return () => {
      endApiRequest();
    };
  }, [startApiRequest, endApiRequest]);
  
  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailSheetOpen(true);
  };
  
  const handleAddConsultation = () => {
    setEditingConsultation(null);
    setIsFormSheetOpen(true);
  };
  
  const handleEditConsultation = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setIsFormSheetOpen(true);
    setIsDetailSheetOpen(false);
  };
  
  const handleDeleteConsultation = (id: string) => {
    // In a real app, you would call an API to delete the consultation
    setConsultations(consultations.filter(c => c.id !== id));
    setIsDetailSheetOpen(false);
  };
  
  const handleSaveConsultation = (consultationData: Partial<Consultation>) => {
    // In a real app, you would call an API to save the consultation
    if (editingConsultation) {
      // Update existing consultation
      setConsultations(consultations.map(c => 
        c.id === editingConsultation.id ? { ...c, ...consultationData } : c
      ));
    } else {
      // Add new consultation
      const newConsultation: Consultation = {
        id: `${consultations.length + 1}`,
        name: consultationData.name || '',
        email: consultationData.email || '',
        phone: consultationData.phone || '',
        company: consultationData.company || '',
        interestedIn: consultationData.interestedIn || '',
        industry: consultationData.industry || '',
        status: 'pending',
        createdAt: new Date(),
        notes: consultationData.notes || ''
      };
      setConsultations([...consultations, newConsultation]);
    }
    setIsFormSheetOpen(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter consultations based on search
  const filteredConsultations = consultations.filter(consultation => 
    consultation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.phone.includes(searchQuery) ||
    consultation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate stats
  const totalConsultations = consultations.length;
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;
  
  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Expert Consultations</h1>
      
      <div className="flex flex-col gap-4">
        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-teal-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalConsultations}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <Headphones className="h-6 w-6 text-teal-500" />
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
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{pendingConsultations}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-blue-500 mr-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Awaiting response
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-purple-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{completedConsultations}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <CalendarClock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="flex items-center text-purple-500 mr-1">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Consultation provided
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
              placeholder="Search by name, company, email..."
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
            
            <Button onClick={handleAddConsultation} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Consultation
            </Button>
          </div>
        </div>
      </div>
      
      <ConsultationsTabs />
      
      <div className="mt-6">
        <ConsultationsTable 
          consultations={filteredConsultations}
          onView={handleViewConsultation}
          onEdit={handleEditConsultation}
          onDelete={handleDeleteConsultation}
          loading={loading}
        />
      </div>
      
      <ConsultationDetailSheet
        consultation={selectedConsultation}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditConsultation}
        onDelete={handleDeleteConsultation}
      />
      
      <ConsultationFormSheet
        consultation={editingConsultation}
        isOpen={isFormSheetOpen}
        onClose={() => setIsFormSheetOpen(false)}
        onSave={handleSaveConsultation}
      />
    </div>
  );
} 