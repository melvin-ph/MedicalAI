import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkstationProvider } from './context/WorkstationContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ExportReportModal } from './components/common/ExportReportModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { StudiesPage } from './pages/StudiesPage';
import { DoseAnalysisPage } from './pages/DoseAnalysisPage';
import { ReportsPage } from './pages/ReportsPage';
import { FollowUpPage } from './pages/FollowUpPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkstationPage } from './pages/WorkstationPage';

const App: React.FC = () => (
  <WorkstationProvider>
    <BrowserRouter>
      <div className="ws-app">
        <Header />
        <Sidebar />
        <main className="ws-app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/studies" element={<StudiesPage />} />
            <Route path="/viewer" element={<ErrorBoundary><WorkstationPage /></ErrorBoundary>} />
            <Route path="/contours" element={<ErrorBoundary><WorkstationPage /></ErrorBoundary>} />
            <Route path="/dose-analysis" element={<DoseAnalysisPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/follow-up" element={<FollowUpPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <ExportReportModal />
      </div>
    </BrowserRouter>
  </WorkstationProvider>
);

export default App;
