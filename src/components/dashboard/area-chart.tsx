"use client";

import { Card } from "@/components/ui/card";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface AreaChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  className?: string;
}

export function AreaChart({ title, data, className }: AreaChartProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none' 
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '0.25rem' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#14b8a6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 