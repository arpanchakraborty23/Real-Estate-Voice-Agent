import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import type { Property, PropertyCreate, PropertyUpdate, Builder } from '../types'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const emptyForm: PropertyCreate = {
  property_id: '', builder_id: '', project_name: '', property_type: '',
  bedrooms: null, location: '', price: 0, status: 'available',
  amenities: '', description: '',
}

export default function Properties() {
  const [props, setProps] = useState<Property[]>([])
  const [builders, setBuilders] = useState<Builder[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<PropertyCreate>(emptyForm)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const [filters, setFilters] = useState({ builder_id: '', property_type: '', status: '', location: '', min_price: '', max_price: '' })

  const load = useCallback(() => {
    setLoading(true)
    const params: Record<string, string | number | undefined> = {}
    if (filters.builder_id) params.builder_id = filters.builder_id
    if (filters.property_type) params.property_type = filters.property_type
    if (filters.status) params.status = filters.status
    if (filters.location) params.location = filters.location
    if (filters.min_price) params.min_price = Number(filters.min_price)
    if (filters.max_price) params.max_price = Number(filters.max_price)

    Promise.all([
      api.listProperties(Object.keys(params).length ? params : undefined),
      api.listBuilders(),
    ])
      .then(([p, b]) => { setProps(p); setBuilders(b) })
      .catch(e => setToast({ msg: String(e), type: 'error' }))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p: Property) => {
    setEditId(p.property_id)
    setForm({
      property_id: p.property_id, builder_id: p.builder_id, project_name: p.project_name,
      property_type: p.property_type, bedrooms: p.bedrooms, location: p.location, price: p.price,
      status: p.status, amenities: p.amenities, description: p.description,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.property_id.trim() || !form.project_name.trim() || !form.builder_id.trim()) {
      setToast({ msg: 'Property ID, Project Name, and Builder ID are required', type: 'error' }); return
    }
    try {
      if (editId) {
        const update: PropertyUpdate = {}
        Object.entries(form).forEach(([k, v]) => { if (k !== 'property_id') (update as any)[k] = v })
        await api.updateProperty(editId, update)
        setToast({ msg: 'Property updated', type: 'success' })
      } else {
        await api.createProperty(form)
        setToast({ msg: 'Property created', type: 'success' })
      }
      setModalOpen(false)
      load()
    } catch (e) { setToast({ msg: String(e), type: 'error' }) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete property "${id}"?`)) return
    try {
      await api.deleteProperty(id)
      setToast({ msg: 'Property deleted', type: 'success' })
      load()
    } catch (e) { setToast({ msg: String(e), type: 'error' }) }
  }

  const statusBadge = (s: string | null) => {
    const cls = s === 'available' ? 'badge-available' : s === 'sold' ? 'badge-sold' : 'badge-under-construction'
    return <span className={`badge ${cls}`}>{s || 'unknown'}</span>
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '3rem' }}>Loading...</p>

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Properties</h2>
          <p>{props.length} listing{props.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Property</button>
      </div>

      <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
        <div className="filter-bar">
          <select value={filters.builder_id} onChange={e => setFilters(f => ({ ...f, builder_id: e.target.value }))}>
            <option value="">All Builders</option>
            {builders.map(b => <option key={b.builder_id} value={b.builder_id}>{b.builder_name}</option>)}
          </select>
          <select value={filters.property_type} onChange={e => setFilters(f => ({ ...f, property_type: e.target.value }))}>
            <option value="">All Types</option>
            {['Apartment', 'Villa', 'Plot', 'Penthouse', 'Duplex', 'Commercial'].map(t =>
              <option key={t} value={t}>{t}</option>
            )}
          </select>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="under construction">Under Construction</option>
          </select>
          <input placeholder="Min price" type="number" value={filters.min_price}
            onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} style={{ minWidth: 100 }} />
          <input placeholder="Max price" type="number" value={filters.max_price}
            onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} style={{ minWidth: 100 }} />
          <button className="btn-secondary" onClick={() => setFilters({ builder_id: '', property_type: '', status: '', location: '', min_price: '', max_price: '' })}>
            Clear
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {props.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>No properties found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Bedrooms</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {props.map(p => (
                  <tr key={p.property_id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.property_id}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.project_name}</td>
                    <td>{p.property_type || '—'}</td>
                    <td>{p.bedrooms != null ? `${p.bedrooms} BHK` : '—'}</td>
                    <td>{p.location || '—'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" onClick={() => openEdit(p)} title="Edit">✎</button>
                        <button className="btn-icon danger" onClick={() => handleDelete(p.property_id)} title="Delete">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} title={editId ? 'Edit Property' : 'New Property'} onClose={() => setModalOpen(false)}>
        <div className="form-group">
          <label>Property ID</label>
          <input value={form.property_id} onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))}
            placeholder="e.g. prop-001" disabled={!!editId} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Project Name</label>
            <input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} placeholder="Project name" />
          </div>
          <div className="form-group">
            <label>Builder ID</label>
            <select value={form.builder_id} onChange={e => setForm(f => ({ ...f, builder_id: e.target.value }))}>
              <option value="">Select builder</option>
              {builders.map(b => <option key={b.builder_id} value={b.builder_id}>{b.builder_name} ({b.builder_id})</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={form.property_type || ''} onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}>
              <option value="">Select</option>
              {['Apartment', 'Villa', 'Plot', 'Penthouse', 'Duplex', 'Commercial'].map(t =>
                <option key={t} value={t}>{t}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Bedrooms</label>
            <input type="number" value={form.bedrooms ?? ''} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value ? Number(e.target.value) : null }))}
              placeholder="e.g. 3" min={0} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price (INR)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="e.g. 7500000" min={0} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status || 'available'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="under construction">Under Construction</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Area" />
        </div>
        <div className="form-group">
          <label>Amenities (semicolon-separated)</label>
          <input value={form.amenities || ''} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Pool; Gym; Parking; Security" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Property description..." />
        </div>
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>{editId ? 'Update' : 'Create'}</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
