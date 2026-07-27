import React from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { ContourType } from '../../types/workstation';
import { Check, ChevronDown } from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const {
    selectedContour,
    setSelectedContour,
    contourVisibilities,
    toggleContourVisibility,
    maxContourVisible,
    setMaxContourVisible
  } = useWorkstation();

  const contours: { id: ContourType; name: string; desc: string; colorClass: string; volume: string }[] = [
    { id: 'gtv', name: 'GTV', desc: 'Gross Tumor Volume', colorClass: 'gtv', volume: '18.7 cc' },
    { id: 'ptv', name: 'PTV', desc: 'Planning Target Volume', colorClass: 'ptv', volume: '95.3 cc' },
    { id: 'ctv', name: 'CTV', desc: 'CTV Venography', colorClass: 'ctv', volume: '134.6 cc' },
  ];

  const oarData = [
    { organ: 'Spinal Cord', constr: 'Dmax < 45 Gy', dose: '38.2 Gy', status: 'oar-dose-warn' },
    { organ: 'Heart', constr: 'Dmean < 26 Gy', dose: '12.4 Gy', status: 'oar-dose-ok' },
    { organ: 'Esophagus', constr: 'Dmax < 70 Gy', dose: '42.1 Gy', status: 'oar-dose-warn' },
    { organ: 'Right Lung (V20)', constr: '< 30 %', dose: '18.7 %', status: 'oar-dose-ok' },
    { organ: 'Left Lung (V20)', constr: '< 30 %', dose: '16.3 %', status: 'oar-dose-ok' },
    { organ: 'Trachea', constr: 'Dmax < 60 Gy', dose: '22.5 Gy', status: 'oar-dose-ok' },
  ];

  return (
    <aside className="ws-left-panel">
      {/* Volume Contours Section */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">
          Volume Contours
          <span 
            className="title-action"
            onClick={() => {
              contours.forEach(c => {
                if (!contourVisibilities[c.id]) toggleContourVisibility(c.id);
              });
            }}
          >
            Show All
          </span>
        </div>
        <div className="contour-list">
          {contours.map(c => {
            const isVisible = contourVisibilities[c.id];
            const isSelected = selectedContour === c.id;

            return (
              <div
                key={c.id}
                className={`contour-item ${isSelected ? 'active' : ''}`}
                data-contour={c.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.contour-checkbox')) {
                    toggleContourVisibility(c.id);
                    return;
                  }
                  setSelectedContour(c.id);
                }}
              >
                <div className={`contour-checkbox ${isVisible ? `checked ${c.colorClass}` : ''}`}>
                  {isVisible && <Check size={10} strokeWidth={3} color="white" />}
                </div>
                <div className="contour-label">
                  <span className={`contour-name ${c.colorClass}-text`}>{c.name}</span>
                  <span className="contour-desc">{c.desc}</span>
                </div>
                <div className="contour-dropdown">
                  <ChevronDown size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contour Information Section */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Contour Information</div>
        <div className="contour-info-section">
          <table className="contour-info-table">
            <thead>
              <tr>
                <th>Structure</th>
                <th style={{ textAlign: 'right' }}>Volume (cc)</th>
              </tr>
            </thead>
            <tbody>
              {contours.map(c => (
                <tr 
                  key={c.id}
                  className={selectedContour === c.id ? 'active' : ''}
                  onClick={() => setSelectedContour(c.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className={`${c.colorClass}-text`}>{c.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`volume-value ${c.colorClass}`}>{c.volume}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nearby Organs At Risk (OAR) */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Nearby Organ at Risk</div>
        <div className="oar-section">
          <table className="oar-table">
            <thead>
              <tr>
                <th>Organ</th>
                <th>Constr (cc)</th>
                <th style={{ textAlign: 'right' }}>Dose (Gy)</th>
              </tr>
            </thead>
            <tbody>
              {oarData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.organ}</td>
                  <td>{row.constr}</td>
                  <td className={row.status} style={{ textAlign: 'right' }}>{row.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Max Contour View Section */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Max Contour View</div>
        <div className="max-contour-section">
          <div className="max-contour-desc">Display maximum boundary<br />of selected structure</div>
          <div className="ws-toggle" onClick={() => setMaxContourVisible(prev => !prev)} style={{ cursor: 'pointer' }}>
            <div className={`ws-toggle-switch ${maxContourVisible ? 'on' : ''}`} />
            <span className={`ws-toggle-status ${maxContourVisible ? 'on' : 'off'}`}>
              {maxContourVisible ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
