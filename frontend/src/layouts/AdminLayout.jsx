// layouts/AdminLayout.jsx – Admin panel layout
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    </div>
);

export default AdminLayout;
