'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DaySpend } from '@/types'

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--sub)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--lime)', fontWeight: 500 }}>${Number(payload[0].value).toFixed(2)}</div>
    </div>
  )
}

export function SpendChart({ data, height = 160 }: { data: DaySpend[]; height?: number }) {
  const fmt = (d: string) => {
    const dt = new Date(d)
    return `${dt.getMonth() + 1}/${dt.getDate()}`
  }

  const chartData = data.map(d => ({ ...d, date: fmt(d.date) }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a3e635" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#a3e635" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#27272a" strokeDasharray="0" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
        <Tooltip content={<Tip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
        <Area type="monotone" dataKey="cost" stroke="#a3e635" strokeWidth={1.8} fill="url(#g1)" dot={false} activeDot={{ r: 3, fill: '#a3e635', strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
