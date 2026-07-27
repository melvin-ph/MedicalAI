import React from 'react';

export const SettingsPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Settings</h1>
      <span className="ws-page-badge">System</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Application Settings</h2>
        <p>Adjust workstation preferences, export defaults, and display parameters for consistent clinical review.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>User Profile</h2>
          <p>Update clinician metadata, notification preferences, and active workspace shortcuts.</p>
        </div>
        <div className="ws-page-panel">
          <h2>System Controls</h2>
          <p>Manage storage, auto-save behavior, and secure export options for the oncology workstation.</p>
        </div>
      </div>
    </div>
  </section>
);
