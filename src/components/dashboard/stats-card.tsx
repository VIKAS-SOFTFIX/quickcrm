"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, change, className }: StatsCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p className={cn(
              "text-xs font-medium mt-1 flex items-center",
              change.positive ? "text-emerald-600" : "text-rose-600"
            )}>
              <span className="mr-1">
                {change.positive ? "↑" : "↓"}
              </span>
              {change.value} since last month
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10">
          {icon}
        </div>
      </div>
    </Card>
  );
} 