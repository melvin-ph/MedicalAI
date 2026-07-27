import React from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { FileText, Menu, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const { patient, setIsExportModalOpen, setSidebarOpen } = useWorkstation();

  return (
    <header className="ws-header">
      {/* Sidebar Toggle & Brand */}
      <div className="ws-header-brand">
        <button
          className="ws-icon-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
          style={{ marginRight: '4px' }}
        >
          <Menu size={18} />
        </button>

        <div className="brand-icon">
          <Activity size={18} />
        </div>
        <div className="brand-text">
          <span className="brand-name">LUNG AI ASSIST</span>
          <span className="brand-sub">Workstation</span>
        </div>
      </div>

      {/* Patient / Study / Series Metadata */}
      <div className="ws-header-info">
        <div className="ws-header-field">
          <span className="field-label">Patient</span>
          <span className="field-value">{patient.name}</span>
          <span className="field-sub">{patient.age}Y / {patient.gender}</span>
        </div>
        <div className="ws-header-field">
          <span className="field-label">Study</span>
          <span className="field-value">{patient.studyName}</span>
          <span className="field-sub">{patient.studyDate}</span>
        </div>
        <div className="ws-header-field">
          <span className="field-label">Series</span>
          <span className="field-value">{patient.seriesName}</span>
        </div>
      </div>

      {/* Export Action */}
      <div className="ws-header-actions">
        <button
          className="ws-btn-export"
          onClick={() => setIsExportModalOpen(true)}
          title="Export Patient Diagnostic Report"
        >
          <FileText size={14} />
          EXPORT REPORT
        </button>
      </div>
    </header>
  );
};
