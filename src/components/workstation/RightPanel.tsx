import React from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { RotateCcw, Download } from 'lucide-react';

export const RightPanel: React.FC = () => {
  const { imageControls, setImageControls, resetImageControls } = useWorkstation();

  const aiModels = [
    { label: 'Primary Model', value: 'nnU-Net v2' },
    { label: 'Foundation', value: 'MONAI' },
    { label: 'Detection', value: 'Swin UNETR' },
    { label: 'Inference', value: 'PyTorch' },
    { label: 'Processing', value: 'SimpleITK' },
    { label: 'Post-proc', value: 'CCA' },
    { label: 'Explainability', value: 'Grad-CAM' },
  ];

  const handleSliderChange = (key: keyof typeof imageControls, value: number) => {
    setImageControls(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <aside className="ws-right-panel">
      {/* Plan Information */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Plan Information</div>
        <div className="plan-info-section">
          <div className="plan-info-group">
            <div className="plan-info-row">
              <span className="plan-info-label">Plan Name</span>
              <span className="plan-info-value">Lung_SBRT_v2</span>
            </div>
            <div className="plan-info-row">
              <span className="plan-info-label">Status</span>
              <span className="plan-info-value success">● Approved</span>
            </div>
            <div className="plan-info-row">
              <span className="plan-info-label">Created</span>
              <span className="plan-info-value">12 May 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Prescription</div>
        <div className="plan-info-section">
          <div className="plan-info-row">
            <span className="plan-info-label">Total Dose</span>
            <span className="plan-info-value accent">60 Gy</span>
          </div>
          <div className="plan-info-row">
            <span className="plan-info-label">Fractions</span>
            <span className="plan-info-value">30 Fx</span>
          </div>
          <div className="plan-info-row">
            <span className="plan-info-label">Dose/Fraction</span>
            <span className="plan-info-value">2.0 Gy</span>
          </div>
          <div className="plan-info-row">
            <span className="plan-info-label">Technique</span>
            <span className="plan-info-value">VMAT</span>
          </div>
          <div className="plan-info-row">
            <span className="plan-info-label">Machine</span>
            <span className="plan-info-value">TrueBeam STx</span>
          </div>
        </div>
      </div>

      {/* AI Segmentation Models */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">AI Segmentation Models</div>
        <div className="ai-models-section">
          {aiModels.map((item, idx) => (
            <div key={idx} className="ai-model-item">
              <span className="ai-model-label">{item.label}</span>
              <span className="ai-model-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Tools */}
      <div className="ws-panel-section">
        <div className="ws-panel-title">Image Tools</div>
        <div className="image-tools-section">
          <div className="image-tool">
            <span className="image-tool-label">Brightness</span>
            <input
              type="range"
              className="image-tool-slider"
              min="0"
              max="100"
              value={imageControls.brightness}
              onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
            />
            <span className="image-tool-value">{imageControls.brightness}</span>
          </div>

          <div className="image-tool">
            <span className="image-tool-label">Contrast</span>
            <input
              type="range"
              className="image-tool-slider"
              min="0"
              max="100"
              value={imageControls.contrast}
              onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
            />
            <span className="image-tool-value">{imageControls.contrast}</span>
          </div>

          <div className="image-tool">
            <span className="image-tool-label">Window</span>
            <input
              type="range"
              className="image-tool-slider"
              min="-1000"
              max="3000"
              value={imageControls.window}
              onChange={(e) => handleSliderChange('window', Number(e.target.value))}
            />
            <span className="image-tool-value">{imageControls.window}</span>
          </div>

          <div className="image-tool">
            <span className="image-tool-label">Level</span>
            <input
              type="range"
              className="image-tool-slider"
              min="-1000"
              max="1000"
              value={imageControls.level}
              onChange={(e) => handleSliderChange('level', Number(e.target.value))}
            />
            <span className="image-tool-value">{imageControls.level}</span>
          </div>

          <div className="image-tool">
            <span className="image-tool-label">Opacity</span>
            <input
              type="range"
              className="image-tool-slider"
              min="0"
              max="100"
              value={imageControls.opacity}
              onChange={(e) => handleSliderChange('opacity', Number(e.target.value))}
            />
            <span className="image-tool-value">{imageControls.opacity}</span>
          </div>
        </div>

        <div className="image-tools-actions">
          <button 
            className="image-tool-btn"
            onClick={resetImageControls}
            title="Restore default image controls"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button 
            className="image-tool-btn"
            onClick={() => alert('Exporting active DICOM viewport snapshot...')}
            title="Export high-resolution image snapshot"
          >
            <Download size={12} />
            Export
          </button>
        </div>
      </div>
    </aside>
  );
};
