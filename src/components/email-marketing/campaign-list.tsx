"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  BarChart2, 
  Mail, 
  Calendar, 
  Users, 
  MoreHorizontal,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  scheduledFor?: Date;
  recipients: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

interface CampaignListProps {
  campaigns: EmailCampaign[];
  onViewCampaign: (campaign: EmailCampaign) => void;
  onDuplicateCampaign: (campaign: EmailCampaign) => void;
  onDeleteCampaign: (campaign: EmailCampaign) => void;
}

export function CampaignList({
  campaigns,
  onViewCampaign,
  onDuplicateCampaign,
  onDeleteCampaign
}: CampaignListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<keyof EmailCampaign>("sentAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: keyof EmailCampaign) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === "sentAt" || sortBy === "scheduledFor") {
      const aDate = a[sortBy] || new Date(0);
      const bDate = b[sortBy] || new Date(0);
      return sortDirection === "asc" 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }
    
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getStatusColor = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold">Email Campaigns</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  Campaign
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('sentAt')}
                >
                  Sent/Scheduled
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('recipients')}
                >
                  Recipients
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('opened')}
                >
                  Open Rate
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('clicked')}
                >
                  Click Rate
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No campaigns found
                </td>
              </tr>
            ) : (
              sortedCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewCampaign(campaign)}
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.subject}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center">
                      {campaign.status === 'scheduled' ? (
                        <>
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          {formatDate(campaign.scheduledFor)}
                        </>
                      ) : campaign.status === 'sent' || campaign.status === 'failed' ? (
                        <>
                          <Mail className="mr-2 h-4 w-4 text-gray-400" />
                          {formatDate(campaign.sentAt)}
                        </>
                      ) : (
                        'Not sent yet'
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      {campaign.recipients}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {campaign.status === 'sent' ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{Math.round((campaign.opened / campaign.recipients) * 100)}%</span>
                          <span className="text-xs text-gray-500">{campaign.opened}/{campaign.recipients}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-teal-500 h-1.5 rounded-full" 
                            style={{ width: `${(campaign.opened / campaign.recipients) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {campaign.status === 'sent' ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{Math.round((campaign.clicked / campaign.recipients) * 100)}%</span>
                          <span className="text-xs text-gray-500">{campaign.clicked}/{campaign.recipients}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${(campaign.clicked / campaign.recipients) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full p-2"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 