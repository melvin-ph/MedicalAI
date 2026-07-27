import React from 'react';

export const ReportsPage: React.FC = () => (
  <section className="ws-page">
    <div className="ws-page-title">
      <h1>Reports</h1>
      <span className="ws-page-badge">5 Pending</span>
    </div>
    <div className="ws-page-content">
      <div className="ws-page-panel">
        <h2>Clinical Reports</h2>
        <p>Generate and review patient treatment summaries, contour findings, and plan export packages.</p>
      </div>
      <div className="ws-page-grid">
        <div className="ws-page-panel">
          <h2>PDF Exports</h2>
          <p>Create HIPAA-ready PDF reports and share study details with the multidisciplinary team.</p>
        </div>
        <div className="ws-page-panel">
          <h2>Structured Data</h2>
          <p>Export HL7 CDA and FHIR JSON summaries for downstream oncology information systems.</p>
        </div>
      </div>
    </div>
  </section>
