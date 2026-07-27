import React, { useState } from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { X, FileText, Download, CheckCircle2, Loader2 } from 'lucide-react';

export const ExportReportModal: React.FC = () => {
  const { patient, isExportModalOpen, setIsExportModalOpen } = useWorkstation();
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExport = (format: string) => {
    setIsExporting(true);
    setIsSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsExportModalOpen(false);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="ws-modal-overlay">
      <div className="ws-modal">
        <div className="ws-modal-header">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            <span className="font-semibold text-md">Export Clinical Oncology Report</span>
          </div>
          <button 
            className="ws-icon-btn" 
            onClick={() => setIsExportModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="ws-modal-body">
          {/* Patient Card Summary */}
          <div className="ws-report-summary-box">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-primary">{patient.name}</span>
              <span className="text-xs text-dim">{patient.mrn}</span>
            </div>
            <div className="text-xs text-secondary flex gap-4">
              <span>Age/Gender: <strong>{patient.age}Y / {patient.gender}</strong></span>
              <span>Study: <strong>{patient.studyName}</strong></span>
            </div>
          </div>

          {/* Contour Summary Table */}
          <div className="mb-4">
            <span className="text-xs font-bold text-dim uppercase tracking-wide block mb-2">
              Delineated Target Volumes
            </span>
            <table className="contour-info-table">
              <thead>
                <tr>
                  <th>Structure</th>
                  <th>Prescription</th>
                  <th style={{ textAlign: 'right' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="gtv-text">GTV (Gross Tumor Volume)</td>
                  <td>60 Gy / 30 Fx</td>
                  <td style={{ textAlign: 'right' }}><strong className="gtv-text">18.7 cc</strong></td>
                </tr>
                <tr>
                  <td className="ptv-text">PTV (Planning Target Volume)</td>
                  <td>60 Gy / 30 Fx</td>
                  <td style={{ textAlign: 'right' }}><strong className="ptv-text">95.3 cc</strong></td>
                </tr>
                <tr>
                  <td className="ctv-text">CTV (Clinical Target Volume)</td>
                  <td>60 Gy / 30 Fx</td>
                  <td style={{ textAlign: 'right' }}><strong className="ctv-text">134.6 cc</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Export Status / Actions */}
          {isExporting ? (
            <div className="ws-export-loading flex flex-col items-center justify-center p-6 gap-3">
              <Loader2 className="animate-spin text-accent" size={32} />
              <span className="text-sm text-secondary font-medium">
                Generating HIPAA-compliant PDF & DICOM RT struct...
              </span>
            </div>
          ) : isSuccess ? (
            <div className="ws-export-success flex flex-col items-center justify-center p-6 gap-2 text-success">
              <CheckCircle2 size={36} />
              <span className="text-md font-bold">Report Exported Successfully!</span>
              <span className="text-xs text-muted">Downloaded to local workstation storage.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button 
                className="ws-btn-primary flex items-center justify-center gap-2"
                onClick={() => handleExport('pdf')}
              >
                <Download size={16} />
                Download Complete Medical PDF Report
              </button>
              
              <div className="flex gap-2">
                <button 
                  className="ws-btn-secondary flex-1"
                  onClick={() => handleExport('hl7')}
                >
                  Export HL7 CDA
                </button>
                <button 
                  className="ws-btn-secondary flex-1"
                  onClick={() => handleExport('fhir')}
                >
                  Export FHIR JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
