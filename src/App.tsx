/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import ForgotPassword from './screens/ForgotPassword';
import AdditionalData from './screens/AdditionalData';
import Dashboard from './screens/Dashboard';
import Stock from './screens/Stock';
import AddMedication from './screens/AddMedication';
import History from './screens/History';
import Profile from './screens/Profile';
import Notifications from './screens/Notifications';
import Restock from './screens/Restock';
import AddStockMedication from './screens/AddStockMedication';
import ManageAccess from './screens/ManageAccess';
import Security from './screens/Security';
import NotificationPreferences from './screens/NotificationPreferences';
import Subscription from './screens/Subscription';
import AddDependent from './screens/AddDependent';
import ChangePassword from './screens/ChangePassword';
import TwoFactorAuth from './screens/TwoFactorAuth';
import ActiveSessions from './screens/ActiveSessions';
import DeleteAccount from './screens/DeleteAccount';
import { AnimatePresence } from 'motion/react';
import React from 'react';
import ScrollToTop from './components/ScrollToTop';
import { MedicationProvider } from './context/MedicationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AnimatedRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <MedicationProvider key={user?.email ?? 'guest'}>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas públicas — redireciona para /dashboard se já logado */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />

          {/* Rotas privadas — redireciona para /login se não autenticado */}
          <Route path="/additional-data" element={<PrivateRoute><AdditionalData /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
          <Route path="/add-stock" element={<PrivateRoute><AddStockMedication /></PrivateRoute>} />
          <Route path="/add-medication" element={<PrivateRoute><AddMedication /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/restock/:id" element={<PrivateRoute><Restock /></PrivateRoute>} />
          <Route path="/manage-access" element={<PrivateRoute><ManageAccess /></PrivateRoute>} />
          <Route path="/security" element={<PrivateRoute><Security /></PrivateRoute>} />
          <Route path="/notification-preferences" element={<PrivateRoute><NotificationPreferences /></PrivateRoute>} />
          <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
          <Route path="/add-dependent" element={<PrivateRoute><AddDependent /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/two-factor-auth" element={<PrivateRoute><TwoFactorAuth /></PrivateRoute>} />
          <Route path="/active-sessions" element={<PrivateRoute><ActiveSessions /></PrivateRoute>} />
          <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
        </Routes>
      </AnimatePresence>
    </MedicationProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
