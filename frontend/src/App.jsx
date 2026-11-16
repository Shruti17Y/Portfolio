import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioHome } from './pages/PortfolioHome';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { ManageProfile } from './pages/admin/ManageProfile';
import { ManageExperience } from './pages/admin/ManageExperience';
import { ManageSkills } from './pages/admin/ManageSkills';
import { ManageProjects } from './pages/admin/ManageProjects';
import { ManageEducation } from './pages/admin/ManageEducation';
import { ManageMessages } from './pages/admin/ManageMessages';
import { ManageSettings } from './pages/admin/ManageSettings';
import { ManageAccount } from './pages/admin/ManageAccount';

function App() {
  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<PortfolioHome />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin CMS Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="profile" element={<ManageProfile />} />
        <Route path="experience" element={<ManageExperience />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="education" element={<ManageEducation />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="settings" element={<ManageSettings />} />
        <Route path="account" element={<ManageAccount />} />
      </Route>

      {/* Catch-all redirect to public portfolio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
