// pages/admin/AdminVehicles.jsx – Vehicle CRUD with bulk select/delete
import { useState, useEffect, useRef } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';
import Spinner from '../../components/Spinner';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const EMPTY = { title: '', brand: '', model: '', year: '', engineCapacity: '', transmission: 'Automatic', fuelType: 'Petrol', mileage: '', price: '', tax: '', description: '', status: 'available', location: 'Showroom' };
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)', selBg: '#eff6ff', selBorder: '#3b82f6' };

const imgUrl = (item) => {
    if (!item?.images?.length) return null;
    const img = item.images[0];
    if (img.startsWith('http')) return img;
    const clean = img.replace(/\\/g, '/').replace(/^\/?uploads\//, '');
    return `/uploads/${clean}`;
};

const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const fileRef = useRef();

    const load = async () => {
        setLoading(true);
        const params = search ? { search } : {};
        const { data } = await getVehicles(params);
        setVehicles(data.vehicles || []);
        setSelected(new Set());
        setLoading(false);
    };

    useEffect(() => { load(); }, [search]);

    // ── Selection helpers ─────────────────────────────────────────────────────
    const allSelected = vehicles.length > 0 && selected.size === vehicles.length;
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(vehicles.map(v => v._id)));
    const toggleOne = (id) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.size} selected vehicle(s)?`)) return;
        setBulkDeleting(true);
        await Promise.all([...selected].map(id => deleteVehicle(id)));
        setBulkDeleting(false);
        load();
    };

    // ── CRUD helpers ──────────────────────────────────────────────────────────
    const openCreate = () => { setForm(EMPTY); setEditing(null); setImageFile(null); setImagePreview(null); setModal(true); setError(''); };
    const openEdit = (v) => { setForm({ ...v }); setEditing(v._id); setImageFile(null); setImagePreview(imgUrl(v)); setModal(true); setError(''); };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') fd.append(k, v); });
        if (imageFile) fd.append('images', imageFile);
        try {
            if (editing) await updateVehicle(editing, fd);
            else await createVehicle(fd);
            setModal(false); load();
        } catch (err) { setError(err.response?.data?.message || 'Failed to save vehicle.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        await deleteVehicle(id); load();
    };

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>🚗 Vehicles</h1>
                <button className="btn-primary" onClick={openCreate}>+ Add Vehicle</button>
            </div>

            {/* Search + Bulk Action Bar */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input className="form-input" style={{ maxWidth: 300, flex: 1 }} placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} />
                {selected.size > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                        <span style={{ fontSize: '0.85rem', color: C.sub, fontWeight: 500 }}>
                            {selected.size} selected
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
                            {bulkDeleting ? 'Deleting...' : `🗑 Delete Selected (${selected.size})`}
                        </button>
                        <button
                            onClick={() => setSelected(new Set())}
                            style={{ background: '#f8fafc', color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {loading ? <Spinner /> : (
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {/* Select-All checkbox */}
                                    <th style={{ width: 44, textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: C.selBorder }}
                                            title="Select all"
                                        />
                                    </th>
                                    <th>Image</th><th>Vehicle</th><th>Year</th><th>Fuel / Trans.</th><th>Price</th><th>Status</th><th>Location</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', color: C.sub, padding: '2rem' }}>No vehicles found</td></tr>
                                ) : vehicles.map(v => {
                                    const isChecked = selected.has(v._id);
                                    return (
                                        <tr key={v._id} style={{ background: isChecked ? C.selBg : 'transparent', transition: 'background 0.15s' }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleOne(v._id)}
                                                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: C.selBorder }}
                                                />
                                            </td>
                                            <td style={{ width: 64 }}>
                                                {imgUrl(v) ? (
                                                    <img src={imgUrl(v)} alt={v.title}
                                                        style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block', border: `1px solid ${C.border}` }} />
                                                ) : (
                                                    <div style={{ width: 56, height: 44, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#cbd5e1' }}>🚗</div>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: C.text, fontSize: '0.875rem' }}>{v.title}</div>
                                                <div style={{ color: C.sub, fontSize: '0.75rem' }}>{v.brand} {v.model}</div>
                                            </td>
                                            <td style={{ color: C.sub }}>{v.year}</td>
                                            <td style={{ color: C.sub, fontSize: '0.8rem' }}>{v.fuelType} / {v.transmission}</td>
                                            <td style={{ color: C.price, fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(v.price)}</td>
                                            <td><span className={`badge badge-${v.status === 'available' ? 'success' : v.status === 'reserved' ? 'warning' : 'danger'}`}>{v.status}</span></td>
                                            <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: v.location === 'Showroom' ? '#2563eb' : v.location === 'Auction' ? '#d97706' : '#64748b' }}>{v.location || 'Showroom'}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button onClick={() => openEdit(v)} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                                                    <button onClick={() => handleDelete(v._id)} style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: C.text, fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem' }}>{editing ? '✏️ Edit Vehicle' : '🚗 Add New Vehicle'}</h2>
                        {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '0.7rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

                            {/* Image Upload */}
                            <div>
                                <label className="form-label">Vehicle Image</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 100, height: 80, background: '#f8fafc', border: `2px dashed ${imagePreview ? '#2db55d' : '#cbd5e1'}`, borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>📷</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                                        <button type="button" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.82rem', color: C.text, fontWeight: 500 }} onClick={() => fileRef.current?.click()}>
                                            {imagePreview ? '📁 Change Image' : '📁 Choose Image'}
                                        </button>
                                        <p style={{ color: C.sub, fontSize: '0.72rem', marginTop: '0.4rem' }}>JPEG, PNG, WebP • max 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
                                <div><label className="form-label">Brand *</label><input className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} required /></div>
                                <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e => set('model', e.target.value)} required /></div>
                                <div><label className="form-label">Year *</label><input type="number" className="form-input" value={form.year} onChange={e => set('year', e.target.value)} required min={1990} /></div>
                                <div><label className="form-label">Engine Capacity</label><input className="form-input" placeholder="e.g. 1500cc" value={form.engineCapacity} onChange={e => set('engineCapacity', e.target.value)} /></div>
                                <div><label className="form-label">Mileage (km)</label><input type="number" className="form-input" value={form.mileage} onChange={e => set('mileage', e.target.value)} /></div>
                                <div>
                                    <label className="form-label">Transmission</label>
                                    <select className="form-select" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                                        {['Automatic', 'Manual', 'CVT', 'Semi-Automatic'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Fuel Type</label>
                                    <select className="form-select" value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
                                        {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'].map(f => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div><label className="form-label">Price (Rs.) *</label><input type="number" className="form-input" value={form.price} onChange={e => set('price', e.target.value)} required /></div>
                                <div><label className="form-label">Tax (Rs.)</label><input type="number" className="form-input" placeholder="0" value={form.tax} onChange={e => set('tax', e.target.value)} min={0} /></div>
                                <div>
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                                        {['available', 'reserved', 'sold'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Location</label>
                                    <select className="form-select" value={form.location} onChange={e => set('location', e.target.value)}>
                                        {['Showroom', 'Warehouse', 'Auction'].map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </div>

                            </div>
                            <div><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Vehicle' : 'Add Vehicle'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVehicles;
