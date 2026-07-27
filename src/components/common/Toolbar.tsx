import React from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { ActiveTool, LayoutMode } from '../../types/workstation';
import { 
  Crosshair, 
  Move, 
  ZoomIn, 
  Ruler, 
  CircleDot, 
  RotateCcw, 
  LayoutGrid, 
  Square, 
  Columns2
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    layoutMode, 
    setLayoutMode, 
    resetViewport 
  } = useWorkstation();

  const tools: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: 'crosshair', label: 'Crosshair', icon: <Crosshair size={14} /> },
    { id: 'pan', label: 'Pan', icon: <Move size={14} /> },
    { id: 'zoom', label: 'Zoom', icon: <ZoomIn size={14} /> },
    { id: 'measure', label: 'Measure', icon: <Ruler size={14} /> },
    { id: 'contour', label: 'Contour', icon: <CircleDot size={14} /> },
  ];

  return (
    <div className="ws-toolbar">
      {/* Tool Selector */}
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => setActiveTool(tool.id)}
          title={`Enable ${tool.label} tool`}
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}

      <div className="tool-divider" />

      {/* Reset Control */}
      <button
        className="tool-btn"
        onClick={() => resetViewport()}
        title="Reset zoom, pan, and image adjustments"
      >
        <RotateCcw size={14} />
        Reset
      </button>

      {/* Layout Mode Switcher (1 View, 2 Views, 4 Views) */}
      <div className="ws-layout-switcher" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginRight: '6px', fontWeight: 500 }}>
          LAYOUT:
        </span>

        <button
          className={`tool-btn ${layoutMode === '1' ? 'active' : ''}`}
          onClick={() => setLayoutMode('1')}
          title="Single Viewport Layout"
          style={{ padding: '4px 8px' }}
        >
          <Square size={14} />
          1 View
        </button>

        <button
          className={`tool-btn ${layoutMode === '2' ? 'active' : ''}`}
          onClick={() => setLayoutMode('2')}
          title="Dual Viewport Layout (Axial + Coronal)"
          style={{ padding: '4px 8px' }}
        >
          <Columns2 size={14} />
          2 Views
        </button>

        <button
          className={`tool-btn ${layoutMode === '4' ? 'active' : ''}`}
          onClick={() => setLayoutMode('4')}
          title="Quad Viewport Grid Layout (Axial, Coronal, Sagittal, 3D)"
          style={{ padding: '4px 8px' }}
        >
          <LayoutGrid size={14} />
          4 Views
        </button>
      </div>
    </div>
  );
};
