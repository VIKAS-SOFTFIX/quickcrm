"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface BarChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  className?: string;
}

export function BarChart({ title, data, className }: BarChartProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
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
            <Bar
              dataKey="value"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 