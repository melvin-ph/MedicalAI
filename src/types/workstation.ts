export type ActiveTool = 'crosshair' | 'pan' | 'zoom' | 'measure' | 'contour' | 'reset' | 'layout';

export type LayoutMode = '1' | '2' | '4';

export type ContourType = 'gtv' | 'ptv' | 'ctv';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  studyDate: string;
  studyName: string;
  seriesName: string;
}

export interface ImageControls {
  brightness: number;
  contrast: number;
  window: number;
  level: number;
  opacity: number;
}

export interface ContourMeta {
  name: string;
  fullName: string;
  vol: string;
  colorClass: string;
  slices: { axial: string; coronal: string; sagittal: string };
  coords: { axial: string; coronal: string; sagittal: string };
}

export interface ViewportState {
  activeView: 'axial' | 'coronal' | 'sagittal' | '3d';
  zoom: number;
  pan: { x: number; y: number };
  crosshair: { x: number; y: number };
  slices: {
    axial: number;
    coronal: number;
    sagittal: number;
  };
}

export interface Measurement {
  id: string;
  viewportId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  distanceMm: number;
}
