import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import type { Builder, BuilderCreate } from '../types'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Builders() {
  const [builders, setBuilders] = useState<Builder[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [form, setForm] = useState<BuilderCreate>({ builder_id: '', builder_name: '', builder_phone: '', builder_email: '' })

  const load = useCallback(() => {
    setLoading(true)
    api.listBuilders().then(setBuilders).catch(e => setToast({ msg: String(e), type: 'error' })).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!form.builder_id.trim() || !form.builder_name.trim()) {
      setToast({ msg: 'Builder ID and Name are required', type: 'error' }); return
    }
    try {
      await api.createBuilder(form)
      setToast({ msg: 'Builder created', type: 'success' })
      setModalOpen(false)
      setForm({ builder_id: '', builder_name: '', builder_phone: '', builder_email: '' })
      load()
    } catch (e) { setToast({ msg: String(e), type: 'error' }) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete builder "${id}"?`)) return
    try {
      await api.deleteBuilder(id)
      setToast({ msg: 'Builder deleted', type: 'success' })
      load()
    } catch (e) { setToast({ msg: String(e), type: 'error' }) }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '3rem' }}>Loading...</p>

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Builders</h2>
          <p>{builders.length} registered builder{builders.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>+ New Builder</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {builders.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>No builders yet. Create one to get started.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {builders.map(b => (
                  <tr key={b.builder_id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{b.builder_id}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.builder_name}</td>
                    <td>{b.builder_phone || '—'}</td>
                    <td>{b.builder_email || '—'}</td>
                    <td>
                      <button className="btn-icon danger" onClick={() => handleDelete(b.builder_id)} title="Delete">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} title="New Builder" onClose={() => setModalOpen(false)}>
        <div className="form-group">
          <label>Builder ID</label>
          <input value={form.builder_id} onChange={e => setForm(f => ({ ...f, builder_id: e.target.value }))} placeholder="e.g. builder-001" />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input value={form.builder_name} onChange={e => setForm(f => ({ ...f, builder_name: e.target.value }))} placeholder="Builder name" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={form.builder_phone || ''} onChange={e => setForm(f => ({ ...f, builder_phone: e.target.value }))} placeholder="+91 98765 43210" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={form.builder_email || ''} onChange={e => setForm(f => ({ ...f, builder_email: e.target.value }))} placeholder="builder@example.com" />
        </div>
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate}>Create</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
