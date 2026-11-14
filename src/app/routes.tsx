import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public pages
import { HomePage } from '../pages/public/HomePage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { PricingPage } from '../pages/public/PricingPage';
import { LoginPage } from '../pages/public/LoginPage';

// Customer pages
import { DashboardPage } from '../pages/customer/DashboardPage';
import { NewOrderPage } from '../pages/customer/NewOrderPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { WalletPage } from '../pages/customer/WalletPage';
import { TransactionsPage } from '../pages/customer/TransactionsPage';
import { NumbersPage } from '../pages/customer/NumbersPage';
import { StarsPage } from '../pages/customer/StarsPage';
import { PremiumPage } from '../pages/customer/PremiumPage';
import { SupportPage } from '../pages/customer/SupportPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminTicketsPage } from '../pages/admin/AdminTicketsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },

  // Customer app routes
  {
    path: '/app',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'order/new', element: <NewOrderPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'numbers', element: <NumbersPage /> },
      { path: 'stars', element: <StarsPage /> },
      { path: 'premium', element: <PremiumPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Admin portal routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'services', element: <AdminServicesPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'payments', element: <AdminPaymentsPage /> },
      { path: 'tickets', element: <AdminTicketsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
