import React from 'react';

export const StudiesPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Studies</h1>
      <span className="ws-page-badge">24 Studies</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Study Browser</h2>
        <p>Review available CT and MR series, select the active study, and jump directly into the viewer for contouring.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>Imaging Metadata</h2>
          <p>Standardize study descriptions, dose reports, and acquisition details for the oncology workflow.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Queue Status</h2>
          <p>Monitor loaded studies, pending review, and the next plan ready for clinical approval.</p>
        </div>
      </div>
    </div>
  </section>
);
