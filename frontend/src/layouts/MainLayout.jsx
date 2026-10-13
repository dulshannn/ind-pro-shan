// layouts/MainLayout.jsx – Public-facing layout with Navbar and Chatbot
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';

const MainLayout = () => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: 60 }}>
            <Outlet />
        </main>
        <Chatbot />
    </div>
);

export default MainLayout;
