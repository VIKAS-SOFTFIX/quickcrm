"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AreaChart } from "@/components/dashboard/area-chart";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import {
  UserPlus,
  Building2,
  Video,
  PhoneCall,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react";

// Sample data for charts
const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
];

const leadsData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 21 },
  { name: "Fri", value: 16 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 },
];

const leadSourceData = [
  { name: "Website", value: 45, color: "#14b8a6" },
  { name: "Social", value: 25, color: "#0ea5e9" },
  { name: "Email", value: 15, color: "#8b5cf6" },
  { name: "Referral", value: 15, color: "#f59e0b" },
];

const activities = [
  {
    id: "1",
    title: "New Lead Created",
    description: "John Smith from Acme Corp. requested a demo",
    time: "10 mins ago",
    icon: <UserPlus className="h-4 w-4 text-teal-700" />,
    iconColor: "bg-teal-100",
  },
  {
    id: "2",
    title: "Demo Scheduled",
    description: "Product demo with TechGiant Inc. at 3:00 PM",
    time: "1 hour ago",
    icon: <Video className="h-4 w-4 text-purple-700" />,
    iconColor: "bg-purple-100",
  },
  {
    id: "3",
    title: "Email Sent",
    description: "Follow-up email sent to Sarah Johnson",
    time: "2 hours ago",
    icon: <Mail className="h-4 w-4 text-blue-700" />,
    iconColor: "bg-blue-100",
  },
  {
    id: "4",
    title: "Meeting Completed",
    description: "Discovery call with Innovative Solutions completed",
    time: "Yesterday",
    icon: <PhoneCall className="h-4 w-4 text-amber-700" />,
    iconColor: "bg-amber-100",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Leads"
          value="1,284"
          icon={<UserPlus className="h-6 w-6 text-teal-600" />}
          change={{ value: "12%", positive: true }}
        />
        <StatsCard
          title="Enterprise Leads"
          value="384"
          icon={<Building2 className="h-6 w-6 text-teal-600" />}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Demo Requests"
          value="128"
          icon={<Video className="h-6 w-6 text-teal-600" />}
          change={{ value: "24%", positive: true }}
        />
        <StatsCard
          title="Scheduled Calls"
          value="64"
          icon={<PhoneCall className="h-6 w-6 text-teal-600" />}
          change={{ value: "5%", positive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AreaChart title="Monthly Revenue" data={revenueData} />
        <BarChart title="Weekly Lead Generation" data={leadsData} />
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonutChart
          title="Lead Sources"
          data={leadSourceData}
          className="lg:col-span-1"
        />
        <ActivityFeed
          title="Recent Activity"
          activities={activities}
          className="lg:col-span-1"
        />
        <AiAssistant className="lg:col-span-1 h-[400px]" />
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          <div className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Product Demo: TechGiant Inc.</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>3:00 PM - 4:00 PM</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Presenting our new AI features to their marketing team.
              </p>
            </div>
          </div>
          <div className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-full bg-purple-100">
              <PhoneCall className="h-5 w-5 text-purple-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Discovery Call: Innovative Solutions</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>5:00 PM - 5:30 PM</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Initial discussion about their CRM needs and pain points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 