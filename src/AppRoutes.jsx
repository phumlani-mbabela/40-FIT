import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Invoices from './pages/Invoices'
import Programs from './pages/Programs'
import Subscriptions from './pages/Subscriptions'
import DebugRoute from './components/DebugRoute'
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/___debug" element={<DebugRoute />} />
      </Routes>
    </BrowserRouter>
  )
}
