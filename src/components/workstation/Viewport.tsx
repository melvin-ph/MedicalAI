import React, { useRef, useState } from 'react';
import { ContourType, Measurement } from '../../types/workstation';
import { useWorkstation } from '../../context/WorkstationContext';

interface ViewportProps {
  id: 'axial' | 'coronal' | 'sagittal' | '3d';
  label: string;
  imageSrc: string;
  axisLeft: string;
  axisRight: string;
  sliceText: string;
  coordText: string;
  active: boolean;
  onActivate: () => void;
  onWheel: (delta: number) => void;
  contourPaths: Record<ContourType, string>;
  boundaryRings: Record<ContourType, string>;
  selectedContour: ContourType;
  contourVisibilities: Record<ContourType, boolean>;
  maxContourVisible: boolean;
  showCrosshair: boolean;
  crosshair: { x: number; y: number };
  zoom: number;
  pan: { x: number; y: number };
  activeTool: string;
  imageFilter: string;
  addMeasurement: (m: Measurement) => void;
  measurements: Measurement[];
  resetViewport: () => void;
}

interface DragState {
  type: 'pan' | 'zoom' | 'measure';
  startX: number;
  startY: number;
  basePanX: number;
  basePanY: number;
  baseZoom: number;
}

export const Viewport: React.FC<ViewportProps> = ({
  id,
  label,
  imageSrc,
  axisLeft,
  axisRight,
  sliceText,
  coordText,
  active,
  onActivate,
  onWheel,
  contourPaths,
  boundaryRings,
  selectedContour,
  contourVisibilities,
  maxContourVisible,
  showCrosshair,
  crosshair,
  zoom,
  pan,
  activeTool,
  imageFilter,
  addMeasurement,
  measurements,
  resetViewport
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeMeasurement, setActiveMeasurement] = useState<Measurement | null>(null);
  const { setViewportState } = useWorkstation();

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const toSvgPoint = (clientX: number, clientY: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return { x: 200, y: 200 };
    const x = clamp(((clientX - rect.left) / rect.width) * 400, 0, 400);
    const y = clamp(((clientY - rect.top) / rect.height) * 400, 0, 400);
    return { x, y };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;

    onActivate();

    if (activeTool === 'pan') {
      setDragState({ type: 'pan', startX, startY, basePanX: pan.x, basePanY: pan.y, baseZoom: zoom });
      wrapperRef.current.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    if (activeTool === 'zoom') {
      setDragState({ type: 'zoom', startX, startY, basePanX: pan.x, basePanY: pan.y, baseZoom: zoom });
      wrapperRef.current.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    if (activeTool === 'measure') {
      const start = toSvgPoint(event.clientX, event.clientY);
      setActiveMeasurement({
        id: `${id}-${Date.now()}`,
        viewportId: id,
        startX: start.x,
        startY: start.y,
        endX: start.x,
        endY: start.y,
        distanceMm: 0
      });
      setDragState({ type: 'measure', startX, startY, basePanX: pan.x, basePanY: pan.y, baseZoom: zoom });
      wrapperRef.current.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    if (activeTool === 'crosshair') {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
      setViewportState(prev => ({ ...prev, crosshair: { x, y }, activeView: id }));
      event.preventDefault();
      return;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !wrapperRef.current) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (dragState.type === 'pan') {
      setViewportState(prev => ({
        ...prev,
        pan: { x: dragState.basePanX + deltaX, y: dragState.basePanY + deltaY }
      }));
      event.preventDefault();
      return;
    }

    if (dragState.type === 'zoom') {
      const nextZoom = clamp(dragState.baseZoom + deltaY * -0.005, 0.6, 3.5);
      setViewportState(prev => ({ ...prev, zoom: nextZoom }));
      event.preventDefault();
      return;
    }

    if (dragState.type === 'measure' && activeMeasurement) {
      const end = toSvgPoint(event.clientX, event.clientY);
      const dx = end.x - activeMeasurement.startX;
      const dy = end.y - activeMeasurement.startY;
      setActiveMeasurement({
        ...activeMeasurement,
        endX: end.x,
        endY: end.y,
        distanceMm: parseFloat((Math.hypot(dx, dy) * 0.6).toFixed(1))
      });
      event.preventDefault();
      return;
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !wrapperRef.current) return;
    if (dragState.type === 'measure' && activeMeasurement) {
      if (activeMeasurement.distanceMm > 0.5) {
        addMeasurement(activeMeasurement);
      }
      setActiveMeasurement(null);
    }
    setDragState(null);
    wrapperRef.current.releasePointerCapture(event.pointerId);
  };

  const effectiveCrosshairStyle = {
    transform: `translate(${crosshair.x - 50}%, ${crosshair.y - 50}%)`
  };

  return (
    <div
      ref={wrapperRef}
      className={`ws-viewport ${active ? 'active' : ''}`}
      onClick={onActivate}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onDoubleClick={() => resetViewport()}
      onWheel={event => {
        event.preventDefault();
        onWheel(event.deltaY > 0 ? 1 : -1);
      }}
      style={{ touchAction: 'none' }}
    >
      <div
        className="ws-viewport-inner"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: dragState?.type ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        <img
          src={imageSrc}
          alt={`${label} CT View`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imageFilter }}
        />
      </div>

      <span className="ws-viewport-label">{label}</span>
      {sliceText && <span className="ws-viewport-slice">{sliceText}</span>}
      {coordText && <span className="ws-viewport-coord">{coordText}</span>}
      {axisLeft && <span className="ws-viewport-axis left">{axisLeft}</span>}
      {axisRight && <span className="ws-viewport-axis right">{axisRight}</span>}

      <svg className="ws-viewport-contour-overlay" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        {(['ptv', 'ctv', 'gtv'] as ContourType[]).map(contour => {
          const visible = contourVisibilities[contour];
          const isSelected = selectedContour === contour;
          return (
            <g key={contour} style={{ opacity: visible ? 1 : 0.15 }}>
              <path
                className={`contour-path ${contour} ${isSelected ? 'focused' : 'dimmed'}`}
                d={contourPaths[contour]}
              />
              {maxContourVisible && boundaryRings[contour] ? (
                <path
                  className={`max-boundary-ring ${contour}`}
                  d={boundaryRings[contour]}
                />
              ) : null}
            </g>
          );
        })}
        {measurements.map(measurement => (
          <line
            key={measurement.id}
            x1={measurement.startX}
            y1={measurement.startY}
            x2={measurement.endX}
            y2={measurement.endY}
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}
        {activeMeasurement ? (
          <line
            x1={activeMeasurement.startX}
            y1={activeMeasurement.startY}
            x2={activeMeasurement.endX}
            y2={activeMeasurement.endY}
            stroke="#facc15"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : null}
      </svg>

      <div className={`crosshair-overlay ${showCrosshair ? 'visible' : ''}`} style={effectiveCrosshairStyle} />
    </div>
  );
};
