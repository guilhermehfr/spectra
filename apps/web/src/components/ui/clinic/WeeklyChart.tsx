'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface WeeklyChartData {
  day: string
  sessions: number
}

interface WeeklyChartProps {
  data: WeeklyChartData[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 2" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12,
              fontFamily: 'var(--font-manrope)',
            }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12,
              fontFamily: 'var(--font-manrope)',
            }}
            allowDecimals={false}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontFamily: 'var(--font-manrope)',
              fontSize: 12,
            }}
            labelStyle={{
              color: '#0f172a',
              fontWeight: 600,
              marginBottom: 4,
            }}
            itemStyle={{
              color: '#2563eb',
            }}
            formatter={(value) => [`${value} sessões`, 'Total']}
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="url(#blueGradient)"
            strokeWidth={3}
            dot={{
              fill: '#2563eb',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 5,
            }}
            activeDot={{
              fill: '#2563eb',
              stroke: '#ffffff',
              strokeWidth: 3,
              r: 7,
            }}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
