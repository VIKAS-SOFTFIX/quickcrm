"use client";

import { Card } from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface DonutChartProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  className?: string;
}

export function DonutChart({ title, data, className }: DonutChartProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none'
              }}
              formatter={(value: number) => [`${value}`, 'Value']}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 