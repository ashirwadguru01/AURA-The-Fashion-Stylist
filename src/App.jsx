import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/auth/LandingPage';
import HomePage from './pages/customer/HomePage';
import CatalogPage from './pages/customer/CatalogPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import WishlistPage from './pages/customer/WishlistPage';
import ReservationsPage from './pages/customer/ReservationsPage';
import RecommendationsPage from './pages/customer/RecommendationsPage';
import VirtualTryOnPage from './pages/customer/VirtualTryOnPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerLayout from './components/shared/CustomerLayout';
import ToastContainer from './components/shared/ToastContainer';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dest = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/home';
    return <Navigate to={dest} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (isAuthenticated) {
    const dest = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/home';
    return <Navigate to={dest} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<PublicRoute><LandingPage /></PublicRoute>} />
        
        {/* Customer Dashboard Routes wrapped in CustomerLayout */}
        <Route path="/home"         element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><HomePage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/catalog"      element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><CatalogPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/product/:id"  element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><ProductDetailPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/wishlist"     element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><WishlistPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><ReservationsPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><RecommendationsPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/tryon"        element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><VirtualTryOnPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/checkout"     element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout><CheckoutPage /></CustomerLayout></ProtectedRoute>} />
        
        {/* Staff & Admin Routes */}
        <Route path="/staff"        element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/*"      element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/*"      element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
