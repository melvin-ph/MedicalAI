import React from 'react';

export const PatientsPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Patients</h1>
      <span className="ws-page-badge">78 Active</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Patient Management</h2>
        <p>Browse patient records, review encounter history, and quickly access the selected oncology treatment study.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>Latest Intake</h2>
          <p>New referrals and imaging studies are queued for segmentation, contour validation, and treatment planning.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Active Alerts</h2>
          <p>Critical dose constraints and follow-up alerts are surfaced to support safe radiation therapy delivery.</p>
        </div>
      </div>
    </div>
  </section>
);
