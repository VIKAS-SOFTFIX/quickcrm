"use client";

import { Lead } from "@/hooks/useLeads";
import { cn } from "@/lib/utils";

interface LeadsTabsProps {
  activeStatus: Lead['status'] | 'all';
  onStatusChange: (status: Lead['status'] | 'all') => void;
  counts: {
    all: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    won: number;
    lost: number;
  };
}

export function LeadsTabs({ activeStatus, onStatusChange, counts }: LeadsTabsProps) {
  const tabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'new', label: 'New', count: counts.new },
    { key: 'contacted', label: 'Contacted', count: counts.contacted },
    { key: 'qualified', label: 'Qualified', count: counts.qualified },
    { key: 'proposal', label: 'Proposal', count: counts.proposal },
    { key: 'won', label: 'Won', count: counts.won },
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onStatusChange(tab.key as Lead['status'] | 'all')}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
              activeStatus === tab.key
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-2 py-0.5 px-2 rounded-full text-xs",
                activeStatus === tab.key
                  ? "bg-teal-100 text-teal-600"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
} 