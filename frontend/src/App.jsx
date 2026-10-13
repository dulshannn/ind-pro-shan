// App.jsx – Root router with all public and admin routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import SpareParts from './pages/SpareParts';
import SparePartDetail from './pages/SparePartDetail';
import InquiryForm from './pages/InquiryForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// User Dashboard Pages
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserOrders from './pages/user/UserOrders';
import UserInquiries from './pages/user/UserInquiries';
import UserProfile from './pages/user/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminSpareParts from './pages/admin/AdminSpareParts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ─────────────────────────────────────── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/spareparts" element={<SpareParts />} />
            <Route path="/spareparts/:id" element={<SparePartDetail />} />
            <Route path="/inquiry" element={<InquiryForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute><OrderSuccess /></ProtectedRoute>
            } />
          </Route>

          {/* ── User Dashboard Routes ──────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="inquiries" element={<UserInquiries />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* ── Admin Routes ───────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute allowedPermission="dashboard"><AdminDashboard /></ProtectedRoute>} />

            <Route path="vehicles" element={<ProtectedRoute allowedPermission="vehicles"><AdminVehicles /></ProtectedRoute>} />
            <Route path="spareparts" element={<ProtectedRoute allowedPermission="spareparts"><AdminSpareParts /></ProtectedRoute>} />
            <Route path="customers" element={<ProtectedRoute allowedPermission="customers"><AdminCustomers /></ProtectedRoute>} />

            <Route path="orders" element={<ProtectedRoute allowedPermission="orders"><AdminOrders /></ProtectedRoute>} />
            <Route path="inquiries" element={<ProtectedRoute allowedPermission="inquiries"><AdminInquiries /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute allowedPermission="reports"><AdminReports /></ProtectedRoute>} />
          </Route>

          {/* ── Catch All ─────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
