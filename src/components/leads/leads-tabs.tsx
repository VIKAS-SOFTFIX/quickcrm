"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function LeadsTabs() {
  const [activeStatus, setActiveStatus] = useState("all");
  
  // Mock counts for demonstration
  const tabs = [
    { key: 'all', label: 'All', count: 7 },
    { key: 'new', label: 'New', count: 1 },
    { key: 'contacted', label: 'Contacted', count: 1 },
    { key: 'qualified', label: 'Qualified', count: 1 },
    { key: 'proposal', label: 'Proposal', count: 1 },
    { key: 'negotiation', label: 'Negotiation', count: 1 },
    { key: 'won', label: 'Won', count: 1 },
    { key: 'lost', label: 'Lost', count: 1 },
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
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