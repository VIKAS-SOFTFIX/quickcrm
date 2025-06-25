"use client";

import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AreaChart } from "@/components/dashboard/area-chart";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import {
  UserPlus,
  Building2,
  Video,
  PhoneCall,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Globe,
  BarChart3,
  Megaphone,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area, 
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart, 
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer, 
  Tooltip,
  XAxis
} from "recharts";

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

// Marketing analytics data types
interface MarketingData {
  name: string;
  value: number;
}

// Enhanced marketing analytics data
const googleAdsData: MarketingData[] = [
  { name: "Jan 1", value: 2100 },
  { name: "Jan 8", value: 2400 },
  { name: "Jan 15", value: 1800 },
  { name: "Jan 22", value: 2600 },
  { name: "Jan 29", value: 3200 },
  { name: "Feb 5", value: 3500 },
  { name: "Feb 12", value: 3800 },
];

const googleAdsMetrics = {
  clicks: "3,800",
  impressions: "45,600",
  ctr: "8.33%",
  cost: "$1,240",
  conversions: "126"
};

const metaAdsData: MarketingData[] = [
  { name: "Jan 1", value: 1200 },
  { name: "Jan 8", value: 1500 },
  { name: "Jan 15", value: 2200 },
  { name: "Jan 22", value: 1900 },
  { name: "Jan 29", value: 2100 },
  { name: "Feb 5", value: 2400 },
  { name: "Feb 12", value: 2800 },
];

const metaAdsMetrics = {
  impressions: "85,400",
  reach: "42,300",
  engagement: "3,240",
  cost: "$950",
  leads: "98"
};

const whatsappMarketingData: MarketingData[] = [
  { name: "Jan 1", value: 280 },
  { name: "Jan 8", value: 320 },
  { name: "Jan 15", value: 450 },
  { name: "Jan 22", value: 380 },
  { name: "Jan 29", value: 410 },
  { name: "Feb 5", value: 490 },
  { name: "Feb 12", value: 520 },
];

const whatsappMetrics = {
  messages: "520",
  openRate: "92%",
  responseRate: "68%",
  conversions: "45",
  avgResponseTime: "12m"
};

// Google Business data for pie chart
const googleBusinessData: MarketingData[] = [
  { name: "5★", value: 42 },
  { name: "4★", value: 18 },
  { name: "3★", value: 6 },
  { name: "2★", value: 2 },
  { name: "1★", value: 0 },
];

const googleBusinessMetrics = {
  reviews: "68",
  avgRating: "4.7",
  views: "1,240",
  searches: "845",
  actions: "156"
};

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

// Chart Components
function AreaChartComponent({ data, color }: { data: MarketingData[], color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <defs>
          <linearGradient id={`color${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name" 
          tick={{fontSize: 10}}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none',
            fontSize: '12px',
            padding: '8px'
          }}
          labelStyle={{ fontWeight: 600, marginBottom: '0.25rem' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#color${color.replace('#', '')})`}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

function BarChartComponent({ data, color }: { data: MarketingData[], color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis 
          dataKey="name" 
          tick={{fontSize: 10}}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none',
            fontSize: '12px',
            padding: '8px'
          }}
          labelStyle={{ fontWeight: 600, marginBottom: '0.25rem' }}
        />
        <Bar 
          dataKey="value" 
          fill={color}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

function LineChartComponent({ data, color }: { data: MarketingData[], color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis 
          dataKey="name" 
          tick={{fontSize: 10}}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none',
            fontSize: '12px',
            padding: '8px'
          }}
          labelStyle={{ fontWeight: 600, marginBottom: '0.25rem' }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ r: 3, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

function PieChartComponent({ data, colors }: { data: MarketingData[], colors: string[] }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
          
          {/* Calculate the segments */}
          {(() => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            let startAngle = 0;
            
            return data.map((item, index) => {
              if (item.value === 0) return null;
              
              const percentage = item.value / total;
              const endAngle = startAngle + percentage * 360;
              
              // Calculate the SVG arc path
              const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              // Determine if the arc should be drawn the long way around
              const largeArcFlag = percentage > 0.5 ? 1 : 0;
              
              const path = (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                />
              );
              
              startAngle = endAngle;
              return path;
            });
          })()}
          
          {/* Inner white circle to create donut effect */}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        
        {/* Display the total in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{data.reduce((sum, item) => sum + item.value, 0)}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="ml-4 flex flex-col text-xs">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-2 h-2 mr-1 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="mr-1">{item.name}:</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Marketing Analytics Card Component Props
interface MarketingAnalyticsCardProps {
  title: string;
  icon: React.ReactNode;
  data: MarketingData[];
  metric: string;
  change: string;
  changePositive?: boolean;
  comingSoon?: boolean;
  metrics?: Record<string, string>;
  chartType: "area" | "bar" | "line" | "pie";
  color: string;
  colors?: string[];
}

// Marketing Analytics Card Component
function MarketingAnalyticsCard({ 
  title, 
  icon, 
  data, 
  metric, 
  change, 
  changePositive = true,
  comingSoon = false,
  metrics,
  chartType,
  color,
  colors = ["#14b8a6", "#10b981", "#f59e0b", "#f43f5e", "#ef4444"]
}: MarketingAnalyticsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${comingSoon ? 'bg-gray-100' : 'bg-teal-50'}`}>
            {icon}
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        {comingSoon ? (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Coming Soon
          </span>
        ) : (
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 text-teal-600">
            View Details <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {comingSoon ? (
        <div className="h-[120px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">Analytics data will appear here</p>
        </div>
      ) : (
        <>
          <div className="h-[120px]">
            {chartType === "area" && <AreaChartComponent data={data} color={color} />}
            {chartType === "bar" && <BarChartComponent data={data} color={color} />}
            {chartType === "line" && <LineChartComponent data={data} color={color} />}
            {chartType === "pie" && <PieChartComponent data={data} colors={colors} />}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-gray-500">Current {metric}</p>
              <p className="text-xl font-semibold">
                {chartType === "pie" 
                  ? data.reduce((sum, item) => sum + item.value, 0)
                  : data[data.length - 1].value}
              </p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
              {changePositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4 transform rotate-90" />
              )}
              <span>{change}%</span>
            </div>
          </div>

          {metrics && (
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-gray-500 capitalize">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div>
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

      {/* Marketing & SEO Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Marketing & SEO Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MarketingAnalyticsCard 
            title="Google Ads"
            icon={<BarChart3 className="h-5 w-5 text-teal-600" />}
            data={googleAdsData}
            metric="Clicks"
            change="12.5"
            changePositive={true}
            comingSoon={false}
            metrics={googleAdsMetrics}
            chartType="bar"
            color="#0ea5e9"
          />
          <MarketingAnalyticsCard 
            title="Meta Ads"
            icon={<Megaphone className="h-5 w-5 text-teal-600" />}
            data={metaAdsData}
            metric="Impressions"
            change="8.3"
            changePositive={true}
            comingSoon={false}
            metrics={metaAdsMetrics}
            chartType="area"
            color="#8b5cf6"
          />
          <MarketingAnalyticsCard 
            title="WhatsApp Marketing"
            icon={<MessageSquare className="h-5 w-5 text-teal-600" />}
            data={whatsappMarketingData}
            metric="Messages"
            change="15.2"
            changePositive={true}
            comingSoon={false}
            metrics={whatsappMetrics}
            chartType="line"
            color="#10b981"
          />
          <MarketingAnalyticsCard 
            title="Google Business"
            icon={<Globe className="h-5 w-5 text-teal-600" />}
            data={googleBusinessData}
            metric="Reviews"
            change="9.7"
            changePositive={true}
            comingSoon={false}
            metrics={googleBusinessMetrics}
            chartType="pie"
            color="#14b8a6"
            colors={["#14b8a6", "#10b981", "#f59e0b", "#f43f5e", "#ef4444"]}
          />
        </div>
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
          className="lg:col-span-2"
        />
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