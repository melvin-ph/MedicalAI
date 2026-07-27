import React, { useMemo } from 'react';
import { useWorkstation } from '../../context/WorkstationContext';
import { ContourType } from '../../types/workstation';
import { Viewport } from './Viewport';

const VIEW_DEFINITIONS = [
  {
    id: 'axial' as const,
    label: 'Axial',
    imageSrc: '/assets/axial.png',
    axisLeft: 'R',
    axisRight: 'L',
    coordLabel: 'Z',
    maxSlices: 245
  },
  {
    id: 'coronal' as const,
    label: 'Coronal',
    imageSrc: '/assets/coronal.png',
    axisLeft: 'R',
    axisRight: 'L',
    coordLabel: 'Y',
    maxSlices: 512
  },
  {
    id: 'sagittal' as const,
    label: 'Sagittal',
    imageSrc: '/assets/sagittal.png',
    axisLeft: 'A',
    axisRight: 'P',
    coordLabel: 'X',
    maxSlices: 512
  },
  {
    id: '3d' as const,
    label: '3D Reconstruction',
    imageSrc: '/assets/3d-recon.png',
    axisLeft: '',
    axisRight: '',
    coordLabel: '',
    maxSlices: 0
  }
];

const CONTOUR_METADATA: Record<ContourType, { fullName: string; colorClass: string; volume: string; slices: Record<'axial'|'coronal'|'sagittal', string>; coords: Record<'axial'|'coronal'|'sagittal', string> }> = {
  gtv: {
    fullName: 'GTV · Gross Tumor Volume',
    colorClass: 'gtv',
    volume: '18.7 cc',
    slices: { axial: 'Image 87 / 245', coronal: 'Image 128 / 512', sagittal: 'Image 102 / 512' },
    coords: { axial: 'Z: -126.4 mm', coronal: 'Y: -23.6 mm', sagittal: 'X: 48.2 mm' }
  },
  ptv: {
    fullName: 'PTV · Planning Target Volume',
    colorClass: 'ptv',
    volume: '95.3 cc',
    slices: { axial: 'Image 92 / 245', coronal: 'Image 134 / 512', sagittal: 'Image 108 / 512' },
    coords: { axial: 'Z: -121.0 mm', coronal: 'Y: -19.2 mm', sagittal: 'X: 52.4 mm' }
  },
  ctv: {
    fullName: 'CTV · CTV Venography',
    colorClass: 'ctv',
    volume: '134.6 cc',
    slices: { axial: 'Image 89 / 245', coronal: 'Image 130 / 512', sagittal: 'Image 105 / 512' },
    coords: { axial: 'Z: -124.2 mm', coronal: 'Y: -21.8 mm', sagittal: 'X: 50.0 mm' }
  }
};

const CONTOUR_PATHS: Record<string, Record<ContourType, string>> = {
  axial: {
    ptv: 'M190,135 C235,130 270,165 275,205 C280,245 240,285 195,290 C150,295 125,255 120,210 C115,165 145,140 190,135 Z',
    ctv: 'M192,150 C225,146 252,175 255,205 C258,235 228,268 195,270 C162,272 142,242 138,210 C134,178 159,154 192,150 Z',
    gtv: 'M194,168 C215,165 232,185 235,205 C238,225 218,248 195,250 C172,252 158,232 155,210 C152,188 173,171 194,168 Z'
  },
  coronal: {
    ptv: 'M230,120 C270,125 295,160 290,205 C285,250 250,280 210,275 C170,270 155,230 160,185 C165,140 190,115 230,120 Z',
    ctv: 'M228,135 C255,139 276,165 272,205 C268,245 238,265 208,260 C178,255 168,222 171,188 C174,154 198,131 228,135 Z',
    gtv: 'M225,152 C242,155 254,175 252,205 C250,235 228,248 206,245 C184,242 180,215 182,192 C184,169 208,149 225,152 Z'
  },
  sagittal: {
    ptv: 'M190,140 C235,140 265,175 260,220 C255,265 215,290 175,285 C135,280 120,240 125,195 C130,150 155,140 190,140 Z',
    ctv: 'M190,155 C222,155 246,182 242,220 C238,258 206,275 174,270 C142,265 132,230 136,198 C140,166 160,155 190,155 Z',
    gtv: 'M190,172 C210,172 225,192 222,220 C219,248 196,258 174,254 C152,250 146,222 148,198 C150,174 170,172 190,172 Z'
  },
  '3d': {
    ptv: 'M260,150 C300,155 330,195 320,245 C310,295 270,320 230,310 C190,300 180,255 190,210 C200,165 235,145 260,150 Z',
    ctv: 'M260,168 C290,172 310,205 302,248 C294,291 262,308 230,300 C198,292 192,252 200,215 C208,178 238,164 260,168 Z',
    gtv: 'M258,188 C278,191 290,218 284,248 C278,278 252,292 230,286 C208,280 205,248 210,220 C215,192 238,185 258,188 Z'
  }
};

const MAX_BOUNDARY_RINGS: Record<string, Record<ContourType, string>> = {
  axial: {
    ptv: 'M185,128 C242,123 278,160 283,205 C288,250 246,293 195,298 C144,303 118,260 113,210 C108,160 140,133 185,128 Z',
    ctv: 'M190,144 C228,140 257,171 260,205 C263,239 231,273 195,275 C159,277 137,245 133,210 C129,175 155,148 190,144 Z',
    gtv: 'M193,162 C218,159 237,181 240,205 C243,229 221,254 195,256 C169,258 153,235 150,210 C147,185 170,165 193,162 Z'
  },
  coronal: {
    ptv: 'M232,113 C276,118 302,155 297,205 C292,255 254,287 210,282 C166,277 149,233 154,185 C159,137 186,108 232,113 Z',
    ctv: 'M229,129 C259,133 282,161 278,205 C274,249 241,271 208,266 C175,261 163,225 166,188 C169,151 195,125 229,129 Z',
    gtv: 'M226,146 C245,149 259,171 257,205 C255,239 231,254 206,251 C181,248 175,218 177,192 C179,166 205,143 226,146 Z'
  },
  sagittal: {
    ptv: 'M190,133 C240,133 272,170 267,220 C262,270 219,297 175,292 C131,287 113,243 118,195 C123,147 150,133 190,133 Z',
    ctv: 'M190,149 C226,149 252,178 248,220 C244,262 209,281 174,276 C139,271 127,233 131,198 C135,163 157,149 190,149 Z',
    gtv: 'M190,166 C213,166 230,188 227,220 C224,252 199,264 174,260 C149,256 140,224 142,198 C144,172 167,166 190,166 Z'
  },
  '3d': {
    ptv: '',
    ctv: '',
    gtv: ''
  }
};

const getVisibleViews = (layoutMode: string, activeView: string) => {
  if (layoutMode === '1') return VIEW_DEFINITIONS.filter(view => view.id === activeView);
  if (layoutMode === '2') return VIEW_DEFINITIONS.filter(view => view.id === 'axial' || view.id === 'coronal');
  return VIEW_DEFINITIONS;
};

export const ViewportGrid: React.FC = () => {
  const {
    selectedContour,
    contourVisibilities,
    maxContourVisible,
    activeTool,
    layoutMode,
    viewportState,
    setViewportState,
    imageControls,
    addMeasurement,
    measurements,
    resetViewport
  } = useWorkstation();

  const visibleViews = useMemo(
    () => getVisibleViews(layoutMode, viewportState.activeView),
    [layoutMode, viewportState.activeView]
  );

  const getSliceText = (viewId: string) => {
    if (viewId === '3d') return '';
    const meta = CONTOUR_METADATA[selectedContour];
    return meta.slices[viewId as 'axial' | 'coronal' | 'sagittal'];
  };

  const getCoordText = (viewId: string) => {
    if (viewId === '3d') return '';
    const meta = CONTOUR_METADATA[selectedContour];
    return meta.coords[viewId as 'axial' | 'coronal' | 'sagittal'];
  };

  const updateSlice = (viewId: string, delta: number) => {
    if (viewId === '3d') return;

    setViewportState(prev => {
      const current = prev.slices[viewId as 'axial' | 'coronal' | 'sagittal'];
      const maxVal = VIEW_DEFINITIONS.find(view => view.id === viewId)?.maxSlices || 0;
      return {
        ...prev,
        slices: {
          ...prev.slices,
          [viewId]: Math.max(1, Math.min(maxVal, current + delta))
        }
      };
    });
  };

  const updateActiveView = (viewId: string) => {
    setViewportState(prev => ({ ...prev, activeView: viewId }));
  };

  const imageFilter = `brightness(${0.5 + imageControls.brightness / 100}) contrast(${0.5 + imageControls.contrast / 100}) opacity(${imageControls.opacity / 100})`;

  return (
    <main className="ws-viewports">
      {visibleViews.map(view => (
        <Viewport
          key={view.id}
          id={view.id}
          label={view.label}
          imageSrc={view.imageSrc}
          axisLeft={view.axisLeft}
          axisRight={view.axisRight}
          sliceText={getSliceText(view.id)}
          coordText={getCoordText(view.id)}
          active={viewportState.activeView === view.id}
          onActivate={() => updateActiveView(view.id)}
          onWheel={delta => updateSlice(view.id, delta)}
          contourPaths={CONTOUR_PATHS[view.id]}
          boundaryRings={MAX_BOUNDARY_RINGS[view.id]}
          selectedContour={selectedContour}
          contourVisibilities={contourVisibilities}
          maxContourVisible={maxContourVisible}
          showCrosshair={activeTool === 'crosshair'}
          crosshair={viewportState.crosshair}
          zoom={viewportState.zoom}
          pan={viewportState.pan}
          activeTool={activeTool}
          imageFilter={imageFilter}
          addMeasurement={addMeasurement}
          measurements={measurements.filter(m => m.viewportId === view.id)}
          resetViewport={resetViewport}
        />
      ))}
    </main>
  );
};
