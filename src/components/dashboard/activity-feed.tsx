"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconColor?: string;
}

interface ActivityFeedProps {
  title: string;
  activities: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ title, activities, className }: ActivityFeedProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className={cn(
              "mt-0.5 flex-none rounded-full p-1.5",
              activity.iconColor || "bg-teal-100"
            )}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
          View all activity
        </button>
      </div>
    </Card>
  );
} 