"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeads, Lead } from "@/hooks/useLeads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  Tag, 
  Edit, 
  Clock, 
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getLeadById } = useLeads();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (params.id) {
      const leadId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundLead = getLeadById(leadId);
      
      if (foundLead) {
        setLead(foundLead);
      }
      
      setLoading(false);
    }
  }, [params.id, getLeadById]);
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Lead not found</h2>
          <p className="text-gray-500 mt-2">The lead you're looking for doesn't exist or has been removed.</p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/leads')}
          >
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'text-blue-600';
      case 'contacted': return 'text-yellow-600';
      case 'qualified': return 'text-purple-600';
      case 'proposal': return 'text-indigo-600';
      case 'won': return 'text-green-600';
      case 'lost': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getStatusBadgeClass = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-indigo-100 text-indigo-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };
  
  // Mock activity timeline
  const activities = [
    {
      id: '1',
      type: 'note',
      content: 'Added a note about client requirements',
      date: new Date('2023-06-14'),
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: '2',
      type: 'email',
      content: 'Sent follow-up email about pricing',
      date: new Date('2023-06-12'),
      user: {
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
      },
    },
    {
      id: '3',
      type: 'call',
      content: 'Had initial discovery call',
      date: new Date('2023-06-10'),
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: '4',
      type: 'status',
      content: 'Changed status from New to Contacted',
      date: new Date('2023-06-10'),
      user: {
        name: 'System',
      },
    },
  ];
  
  // Mock tasks
  const tasks = [
    {
      id: '1',
      title: 'Send proposal document',
      dueDate: new Date('2023-06-20'),
      completed: false,
    },
    {
      id: '2',
      title: 'Schedule follow-up call',
      dueDate: new Date('2023-06-18'),
      completed: false,
    },
    {
      id: '3',
      title: 'Research competitor pricing',
      dueDate: new Date('2023-06-15'),
      completed: true,
    },
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-500" />;
      case 'status':
        return <Tag className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <button 
              onClick={() => router.push('/leads')}
              className="mr-3 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(lead.status)}`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500">{lead.company}</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link 
            href={`/leads/${lead.id}/edit`}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Lead
          </Link>
          <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
            Convert to Customer
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Lead details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Lead Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Contact Person</span>
                  </div>
                  <div className="font-medium">{lead.contact}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="font-medium">{lead.email}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <div className="font-medium">{lead.phone}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Company</span>
                  </div>
                  <div className="font-medium">{lead.company}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">Deal Value</span>
                  </div>
                  <div className="font-medium">{formatCurrency(lead.value)}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="text-sm">Source</span>
                  </div>
                  <div className="font-medium">{lead.source}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Created Date</span>
                  </div>
                  <div className="font-medium">{formatDate(lead.createdAt)}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Last Contact</span>
                  </div>
                  <div className="font-medium">
                    {lead.lastContact ? formatDate(lead.lastContact) : 'No contact yet'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Notes</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                {lead.notes || 'No notes available for this lead.'}
              </p>
            </div>
            <div className="flex">
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Add a note..."
                rows={3}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Add Note
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="h-6 w-6 mr-2 rounded-full bg-gray-200 flex-shrink-0">
                        {activity.user.avatar ? (
                          <img 
                            src={activity.user.avatar} 
                            alt={activity.user.name} 
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                            {activity.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
                    </div>
                    <p className="mt-1 text-gray-700">{activity.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right column - Tasks and assigned to */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Assigned To</h2>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 mr-4">
                {lead.assignedTo.avatar ? (
                  <img 
                    src={lead.assignedTo.avatar} 
                    alt={lead.assignedTo.name} 
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {lead.assignedTo.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{lead.assignedTo.name}</div>
                <button className="text-sm text-teal-600 hover:text-teal-700 mt-1">
                  Change Owner
                </button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Tasks</h2>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                + Add Task
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 border rounded-lg ${task.completed ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Mail className="h-5 w-5 mr-2 text-teal-600" />
                <span>Send Email</span>
              </button>
              <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Phone className="h-5 w-5 mr-2 text-teal-600" />
                <span>Log Call</span>
              </button>
              <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 