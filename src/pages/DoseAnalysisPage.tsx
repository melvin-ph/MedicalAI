import React from 'react';

export const DoseAnalysisPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Dose Analysis</h1>
      <span className="ws-page-badge">Clinical</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Treatment Plan Metrics</h2>
        <p>Inspect dose distribution, plan coverage, and organ-at-risk compliance for the active treatment plan.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>Constraint Review</h2>
          <p>Validate planning constraints and compare prescription values against clinical thresholds.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Plan Summary</h2>
          <p>Analyze approved beam energy, dose per fraction, and VMAT performance at a glance.</p>
        </div>
      </div>
    </div>
  </section>
);
