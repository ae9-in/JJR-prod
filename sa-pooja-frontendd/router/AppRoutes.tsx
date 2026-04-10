
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import CatalogPage from '../pages/CatalogPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import MarginsPage from '../pages/MarginsPage';
import PaymentPage from '../pages/PaymentPage';
import AddressPage from '../pages/AddressPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Jaya Janardhana | Sacred Goods Storefront',
      '/about': 'About | Jaya Janardhana',
      '/catalog': 'Catalog | Jaya Janardhana',
      '/login': 'Login | Jaya Janardhana',
      '/register': 'Become an Affiliate | Jaya Janardhana',
      '/cart': 'Cart | Jaya Janardhana',
      '/address': 'Address | Jaya Janardhana',
      '/payment': 'Payment | Jaya Janardhana',
      '/dashboard': 'Dashboard | Jaya Janardhana',
      '/margins': 'Margins | Jaya Janardhana',
      '/order-history': 'Order History | Jaya Janardhana',
      '/subscription': 'Membership | Jaya Janardhana'
    };

    document.title = pageTitles[location.pathname] || 'Page Not Found | Jaya Janardhana';
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#C5A059] border-t-transparent"></div>
          <p className="mt-4 text-[#C5A059]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<Dashboard />} />
      <Route path="/address" element={<AddressPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/margins" element={<MarginsPage />} />
      <Route path="/order-history" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
