// pages/user/UserProfile.jsx – View and edit user profile (light theme)
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const C = { text: '#1a2035', sub: '#64748b', border: 'rgba(0,0,0,0.08)' };

const UserProfile = () => {
    const { user, loginUser } = useAuth();

    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [profileMsg, setProfileMsg] = useState(null);
    const [pwMsg, setPwMsg] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const setPF = (k, v) => setPwForm(p => ({ ...p, [k]: v }));

    const handleProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true); setProfileMsg(null);
        try {
            const { data } = await api.put('/auth/me', { name: form.name, email: form.email });
            loginUser({ ...user, ...data });
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally { setSavingProfile(false); }
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirm) {
            setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return;
        }
        setSavingPw(true); setPwMsg(null);
        try {
            await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            setPwMsg({ type: 'success', text: 'Password changed successfully!' });
            setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
        } catch (err) {
            setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        } finally { setSavingPw(false); }
    };

    const Alert = ({ msg }) => msg && (
        <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fff5f5', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 8, padding: '0.7rem 1rem', color: msg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>👤 My Profile</h1>
                <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your account details</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

                {/* Profile Info Column */}
                <div>
                    {/* Avatar Card */}
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#0f1520,#1a2035)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.8rem', boxShadow: '0 8px 24px rgba(15,21,32,0.25)' }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
                        <div style={{ color: C.sub, fontSize: '0.85rem', marginTop: '0.25rem' }}>{user?.email}</div>
                        <div style={{ marginTop: '0.75rem' }}>
                            <span style={{ background: 'rgba(232,56,79,0.1)', color: '#e8384f', border: '1px solid rgba(232,56,79,0.25)', borderRadius: 999, padding: '0.25rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {user?.role || 'customer'}
                            </span>
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem' }}>
                        <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.1rem', marginTop: 0 }}>Edit Profile</h3>
                        <Alert msg={profileMsg} />
                        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Full Name</label>
                                <input className="form-input" value={form.name} onChange={e => setF('name', e.target.value)} required />
                            </div>
                            <div>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setF('email', e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '0.7rem', justifyContent: 'center' }} disabled={savingProfile}>
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Change Password */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: 0 }}>🔐 Change Password</h3>
                    <p style={{ color: C.sub, fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1.1rem' }}>Choose a strong password with at least 6 characters.</p>
                    <Alert msg={pwMsg} />
                    <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-input" placeholder="Your current password" value={pwForm.currentPassword} onChange={e => setPF('currentPassword', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-input" placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={e => setPF('newPassword', e.target.value)} required minLength={6} />
                        </div>
                        <div>
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-input" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPF('confirm', e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '0.7rem', justifyContent: 'center' }} disabled={savingPw}>
                            {savingPw ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
