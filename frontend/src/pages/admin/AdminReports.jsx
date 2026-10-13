// pages/admin/AdminReports.jsx – Downloadable system reports
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const C = { text: '#1a2035', sub: '#64748b', border: 'rgba(0,0,0,0.08)' };

const AdminReports = () => {
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async (type) => {
        setDownloading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/reports/${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to download report');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shan_auto_${type}_report.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert(error.message);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📄 Reports</h1>
                <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>Generate and download system data analytics</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                {/* Orders Report */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📦</div>
                    <h3 style={{ color: C.text, margin: '0 0 0.5rem 0' }}>Orders Report</h3>
                    <p style={{ color: C.sub, fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Download a complete historical record of all e-commerce transactions, including customer details, fulfillment methods, and payment statuses.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => handleDownload('orders')}
                        disabled={downloading}
                    >
                        {downloading ? 'Generating...' : 'Download CSV'}
                    </button>
                </div>

                {/* Coming Soon placeholders */}
                <div style={{ background: '#f8fafc', border: `1px dashed ${C.border}`, borderRadius: 12, padding: '1.5rem', opacity: 0.7 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗</div>
                    <h3 style={{ color: C.text, margin: '0 0 0.5rem 0' }}>Inventory Report</h3>
                    <p style={{ color: C.sub, fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Monthly vehicle stock and fast-moving spare parts analysis capability. (Coming soon)
                    </p>
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>Not available</button>
                </div>

            </div>
        </div>
    );
};

export default AdminReports;
