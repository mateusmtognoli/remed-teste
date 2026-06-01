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
import { AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';

import { MedicationProvider } from './context/MedicationContext';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <MedicationProvider>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/additional-data" element={<AdditionalData />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/add-stock" element={<AddStockMedication />} />
          <Route path="/add-medication" element={<AddMedication />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/restock/:id" element={<Restock />} />
          <Route path="/manage-access" element={<ManageAccess />} />
          <Route path="/security" element={<Security />} />
          <Route path="/notification-preferences" element={<NotificationPreferences />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/add-dependent" element={<AddDependent />} />
        </Routes>
      </AnimatePresence>
    </MedicationProvider>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
