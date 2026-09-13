import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import Funding from './pages/Funding';
import RecommendationsPage from './pages/RecommendationsPage';
import PublicationsPage from './pages/PublicationsPage';
import PatentsPage from './pages/PatentsPage';
import Trends from './pages/Trends';
import AnalyticsPage from './pages/AnalyticsPage';
import InnovationManagerPage from './pages/InnovationManagerPage';
import ScoringPage from './pages/ScoringPage';
import ArchitecturePage from './pages/ArchitecturePage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/funding" element={<Funding />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/patents" element={<PatentsPage />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/innovation-manager" element={<InnovationManagerPage />} />
          <Route path="/scoring" element={<ScoringPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

