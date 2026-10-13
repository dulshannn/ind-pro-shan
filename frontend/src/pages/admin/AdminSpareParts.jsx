// pages/admin/AdminSpareParts.jsx – Spare Parts CRUD with bulk select/delete
import { useState, useEffect, useRef } from 'react';
import { getSpareParts, createSparePart, updateSparePart, deleteSparePart } from '../../services/sparePartService';
import { getCategories } from '../../services/categoryService';
import Spinner from '../../components/Spinner';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const EMPTY = { partName: '', brand: '', category: '', compatibleModels: '', stock: '', price: '', description: '' };
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)', selBg: '#eff6ff', selBorder: '#3b82f6' };

const imgUrl = (item) => {
    if (!item?.image) return null;
    const img = item.image;
    if (img.startsWith('http')) return img;
    const clean = img.replace(/\\/g, '/').replace(/^\/?uploads\//, '');
    return `/uploads/${clean}`;
};

const AdminSpareParts = () => {
    const [parts, setParts] = useState([]);
    const [categories, setCategories] = useState([]);
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
        const [pRes, cRes] = await Promise.all([getSpareParts(params), getCategories()]);
        setParts(pRes.data.spareParts || []);
        setCategories(cRes.data || []);
        setSelected(new Set());
        setLoading(false);
    };

    useEffect(() => { load(); }, [search]);

    // ── Selection helpers ─────────────────────────────────────────────────────
    const allSelected = parts.length > 0 && selected.size === parts.length;
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(parts.map(p => p._id)));
    const toggleOne = (id) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.size} selected part(s)?`)) return;
        setBulkDeleting(true);
        await Promise.all([...selected].map(id => deleteSparePart(id)));
        setBulkDeleting(false);
        load();
    };

    // ── CRUD helpers ──────────────────────────────────────────────────────────
    const openCreate = () => { setForm(EMPTY); setEditing(null); setImageFile(null); setImagePreview(null); setModal(true); setError(''); };
    const openEdit = (p) => {
        setForm({ ...p, category: p.category?._id || p.category, compatibleModels: (p.compatibleModels || []).join(', ') });
        setEditing(p._id); setImageFile(null); setImagePreview(imgUrl(p)); setModal(true); setError('');
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        const fd = new FormData();
        const { compatibleModels, ...rest } = form;
        Object.entries(rest).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
        const models = compatibleModels.split(',').map(m => m.trim()).filter(Boolean);
        models.forEach(m => fd.append('compatibleModels', m));
        if (imageFile) fd.append('image', imageFile);
        try {
            if (editing) await updateSparePart(editing, fd);
            else await createSparePart(fd);
            setModal(false); load();
        } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this spare part?')) return;
        await deleteSparePart(id); load();
    };

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>🔧 Spare Parts</h1>
                <button className="btn-primary" onClick={openCreate}>+ Add Part</button>
            </div>

            {/* Search + Bulk Action Bar */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input className="form-input" style={{ maxWidth: 300, flex: 1 }} placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)} />
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
                                    <th style={{ width: 44, textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: C.selBorder }}
                                            title="Select all"
                                        />
                                    </th>
                                    <th>Image</th><th>Part</th><th>Category</th><th>Stock</th><th>Price</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parts.length === 0 ? (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', color: C.sub, padding: '2rem' }}>No spare parts found</td></tr>
                                ) : parts.map(p => {
                                    const isChecked = selected.has(p._id);
                                    return (
                                        <tr key={p._id} style={{ background: isChecked ? C.selBg : 'transparent', transition: 'background 0.15s' }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleOne(p._id)}
                                                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: C.selBorder }}
                                                />
                                            </td>
                                            <td style={{ width: 64 }}>
                                                {imgUrl(p) ? (
                                                    <img src={imgUrl(p)} alt={p.partName}
                                                        style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block', border: `1px solid ${C.border}` }} />
                                                ) : (
                                                    <div style={{ width: 56, height: 44, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#cbd5e1' }}>🔧</div>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: C.text, fontSize: '0.875rem' }}>{p.partName}</div>
                                                <div style={{ color: C.sub, fontSize: '0.75rem' }}>{p.brand}</div>
                                            </td>
                                            <td>
                                                <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>{p.category?.categoryName || '–'}</span>
                                            </td>
                                            <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock} pcs</span></td>
                                            <td style={{ color: C.price, fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(p.price)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button onClick={() => openEdit(p)} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                                                    <button onClick={() => handleDelete(p._id)} style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
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
                    <div className="modal-box" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: C.text, fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem' }}>{editing ? '✏️ Edit Spare Part' : '🔧 Add New Part'}</h2>
                        {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '0.7rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

                            {/* Image Upload */}
                            <div>
                                <label className="form-label">Part Image</label>
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
                                <div><label className="form-label">Part Name *</label><input className="form-input" value={form.partName} onChange={e => set('partName', e.target.value)} required /></div>
                                <div><label className="form-label">Brand *</label><input className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} required /></div>
                                <div>
                                    <label className="form-label">Category *</label>
                                    <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                                    </select>
                                </div>
                                <div><label className="form-label">Stock *</label><input type="number" className="form-input" value={form.stock} onChange={e => set('stock', e.target.value)} required min={0} /></div>
                                <div><label className="form-label">Price (Rs.) *</label><input type="number" className="form-input" value={form.price} onChange={e => set('price', e.target.value)} required min={0} /></div>
                            </div>
                            <div><label className="form-label">Compatible Models (comma separated)</label><input className="form-input" placeholder="e.g. Aqua NHP10, Fit GP5" value={form.compatibleModels} onChange={e => set('compatibleModels', e.target.value)} /></div>
                            <div><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Part' : 'Add Part'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSpareParts;
