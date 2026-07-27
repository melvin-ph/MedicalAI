import React from 'react';

export const FollowUpPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Follow Up</h1>
      <span className="ws-page-badge">Clinical</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Follow-Up Workflow</h2>
        <p>Track patient follow-ups, response assessment, and scheduled imaging appointments across the treatment plan.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>Outcome Monitoring</h2>
          <p>Capture therapy progress, check compliance, and route follow-up tasks to your care team.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Notifications</h2>
          <p>Receive alerts when new follow-up studies are available or dose constraints require review.</p>
        </div>
      </div>
    </div>
  </section>
);
