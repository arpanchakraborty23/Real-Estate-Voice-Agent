import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { api } from '../api/client'
import type { Property, Builder } from '../types'

export default function Dashboard() {
  const [builders, setBuilders] = useState<Builder[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.listBuilders(), api.listProperties()])
      .then(([b, p]) => { setBuilders(b); setProperties(p) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalValue = properties.reduce((s, p) => s + p.price, 0)
  const available = properties.filter(p => p.status === 'available').length
  const sold = properties.filter(p => p.status === 'sold').length
  const underConstr = properties.filter(p => p.status === 'under construction').length

  const typeCount = new Map<string, number>()
  properties.forEach(p => {
    const t = p.property_type || 'other'
    typeCount.set(t, (typeCount.get(t) || 0) + 1)
  })
  const typeData = Array.from(typeCount.entries()).map(([name, value]) => ({ name, value }))

  const locationAvg = new Map<string, { total: number; count: number }>()
  properties.forEach(p => {
    if (!p.location) return
    const loc = p.location.split(',').pop()?.trim() || p.location
    const prev = locationAvg.get(loc) || { total: 0, count: 0 }
    locationAvg.set(loc, { total: prev.total + p.price, count: prev.count + 1 })
  })
  const locData = Array.from(locationAvg.entries())
    .map(([name, { total, count }]) => ({ name, avg: Math.round(total / count) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 6)

  const STATUS_COLORS: Record<string, string> = {
    available: '#4ade80',
    sold: '#f87171',
    'under construction': '#d4a853',
  }

  const COLORS = ['#d4a853', '#4ade80', '#f87171', '#60a5fa', '#a78bfa', '#f472b6']

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '3rem' }}>Loading...</p>

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your property inventory</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Properties</div>
          <div className="stat-value">{properties.length}</div>
          <div className="stat-sub">{available} available</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Value</div>
          <div className="stat-value">₹{(totalValue / 1e7).toFixed(1)}Cr</div>
          <div className="stat-sub">{totalValue.toLocaleString('en-IN')} INR</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Builders</div>
          <div className="stat-value">{builders.length}</div>
          <div className="stat-sub">registered partners</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sold vs Available</div>
          <div className="stat-value">{sold}</div>
          <div className="stat-sub">{((sold / (properties.length || 1)) * 100).toFixed(0)}% sold rate</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Avg Price by Location
          </h4>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#6a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #2e2e50', borderRadius: 6, fontSize: 13 }}
                  labelStyle={{ color: '#f0ece4' }}
                  formatter={(v: number) => [`₹${(v / 1e6).toFixed(1)}M`, 'Avg Price']}
                />
                <Bar dataKey="avg" fill="#d4a853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Properties by Type
          </h4>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                  {typeData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #2e2e50', borderRadius: 6, fontSize: 13 }}
                  labelStyle={{ color: '#f0ece4' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {typeData.map((d, i) => (
                <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block' }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Status Breakdown
        </h4>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { label: 'Available', count: available, color: STATUS_COLORS.available },
            { label: 'Sold', count: sold, color: STATUS_COLORS.sold },
            { label: 'Under Construction', count: underConstr, color: STATUS_COLORS['under construction'] },
          ].map(s => (
            <div key={s.label} style={{ flex: 1 }}>
              <div style={{ height: 8, background: 'var(--bg-hover)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(s.count / (properties.length || 1)) * 100}%`, height: '100%', background: s.color, borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>{s.label}</span>
                <span style={{ fontWeight: 600 }}>{s.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
