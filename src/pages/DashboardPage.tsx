import React from 'react';

export const DashboardPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Clinical Dashboard</h1>
      <span className="ws-page-badge">Live</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Patient Triage</h2>
        <p>Prioritized cases, active studies, and AI-assisted contour review are displayed for rapid clinical decision-making.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>Case Summary</h2>
          <p>Track active patients, upcoming follow-ups, and plan approval status across the oncology workflow.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Study Insights</h2>
          <p>View imaging volumes, modality breakdown, and pending annotations for the current treatment cohort.</p>
        </div>
      </div>
    </div>
  </section>
