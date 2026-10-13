// pages/admin/AdminCustomers.jsx – Customer list & Permissions Management
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const C = { text: '#1a2035', sub: '#64748b', border: 'rgba(0,0,0,0.08)' };

const PERMISSIONS_LIST = [
    { id: 'dashboard', label: 'View Dashboard' },
    { id: 'vehicles', label: 'Manage Vehicles' },
    { id: 'spareparts', label: 'Manage Spare Parts' },
    { id: 'orders', label: 'Manage Orders' },
    { id: 'inquiries', label: 'Manage Inquiries' },
    { id: 'reports', label: 'Generate Reports' },
    { id: 'customers', label: 'Manage Customers (Permissions)' },
];

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [editPerms, setEditPerms] = useState([]);
    const [saving, setSaving] = useState(false);

    const loadUsers = () => {
        setLoading(true);
        api.get('/auth/users').then(r => setCustomers(r.data || [])).catch(() => setCustomers([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadUsers(); }, []);

    const filtered = customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (user) => {
        setSelectedUser(user);
        setEditRole(user.role);
        setEditPerms(user.permissions || []);
    };

    const togglePerm = (permId) => {
        setEditPerms(prev => prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]);
    };

    const handleSavePermissions = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            await api.put(`/auth/users/${selectedUser._id}/role-permissions`, {
                role: editRole,
                permissions: editPerms
            });
            loadUsers();
            setSelectedUser(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>👥 Customers & Users</h1>
                <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage user accounts, roles, and permissions</p>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '1rem', marginBottom: '1.1rem' }}>
                <input className="form-input" style={{ maxWidth: 320 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? <Spinner /> : (
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: C.sub, padding: '2rem' }}>No users found</td></tr>
                                ) : filtered.map((c, i) => (
                                    <tr key={c._id}>
                                        <td style={{ color: C.sub }}>{i + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                                    {c.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span style={{ color: C.text, fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: C.sub, fontSize: '0.875rem' }}>{c.email}</td>
                                        <td>
                                            <span className={`badge ${c.role === 'admin' ? 'badge-danger' : c.role === 'manager' ? 'badge-warning' : 'badge-info'}`}>
                                                {c.role}
                                            </span>
                                        </td>
                                        <td style={{ color: C.sub, fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString('en-LK')}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => openModal(c)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                Permissions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {selectedUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
                    <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 450, padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ color: C.text, fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.75rem' }}>Manage Permissions</h2>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', color: C.sub, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>User</label>
                            <div style={{ color: C.text, fontWeight: 600 }}>{selectedUser.name} <span style={{ color: C.sub, fontWeight: 400 }}>({selectedUser.email})</span></div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label className="form-label">Role</label>
                            <select className="form-input" value={editRole} onChange={e => setEditRole(e.target.value)}>
                                <option value="customer">Customer</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {editRole === 'manager' && (
                            <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 8, border: `1px solid ${C.border}` }}>
                                <label style={{ display: 'block', color: C.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.8rem' }}>Manager Permissions</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    {PERMISSIONS_LIST.map(p => (
                                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={editPerms.includes(p.id)}
                                                onChange={() => togglePerm(p.id)}
                                                style={{ width: 16, height: 16, cursor: 'pointer' }}
                                            />
                                            {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {editRole === 'admin' && (
                            <div style={{ padding: '1rem', background: 'rgba(232,56,79,0.08)', color: '#e8384f', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                <strong>Admin Notice:</strong> Admins have full access to all system features.
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                            <button onClick={() => setSelectedUser(null)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleSavePermissions} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
