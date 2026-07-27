import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTool, LayoutMode, ContourType, Patient, ImageControls, ViewportState, Measurement } from '../types/workstation';

const DEFAULT_PATIENT: Patient = {
  id: 'PAT-2025-8842',
  name: 'RAMESH KUMAR',
  age: 62,
  gender: 'Male',
  mrn: 'MRN-904128',
  studyDate: '12 May 2025',
  studyName: 'CT – Thorax w/ Contrast',
  seriesName: 'Thorax_Contrast'
};

const DEFAULT_IMAGE_CONTROLS: ImageControls = {
  brightness: 50,
  contrast: 50,
  window: 400,
  level: 40,
  opacity: 100
};

interface WorkstationContextType {
  patient: Patient;
  setPatient: (p: Patient) => void;
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  selectedContour: ContourType;
  setSelectedContour: (contour: ContourType) => void;
  contourVisibilities: Record<ContourType, boolean>;
  toggleContourVisibility: (contour: ContourType) => void;
  maxContourVisible: boolean;
  setMaxContourVisible: (visible: boolean | ((v: boolean) => boolean)) => void;
  imageControls: ImageControls;
  setImageControls: React.Dispatch<React.SetStateAction<ImageControls>>;
  resetImageControls: () => void;
  viewportState: ViewportState;
  setViewportState: React.Dispatch<React.SetStateAction<ViewportState>>;
  measurements: Measurement[];
  addMeasurement: (m: Measurement) => void;
  clearMeasurements: () => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  resetViewport: () => void;
}

const WorkstationContext = createContext<WorkstationContextType | undefined>(undefined);

export const WorkstationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patient, setPatient] = useState<Patient>(DEFAULT_PATIENT);
  const [activeTool, setActiveTool] = useState<ActiveTool>('crosshair');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('4');
  const [selectedContour, setSelectedContour] = useState<ContourType>('gtv');
  const [contourVisibilities, setContourVisibilities] = useState<Record<ContourType, boolean>>({
    gtv: true,
    ptv: true,
    ctv: true
  });
  const [maxContourVisible, setMaxContourVisible] = useState<boolean>(true);
  const [imageControls, setImageControls] = useState<ImageControls>(DEFAULT_IMAGE_CONTROLS);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [viewportState, setViewportState] = useState<ViewportState>({
    activeView: 'axial',
    zoom: 1,
    pan: { x: 0, y: 0 },
    crosshair: { x: 50, y: 50 },
    slices: {
      axial: 87,
      coronal: 128,
      sagittal: 102
    }
  });

  // Persist state to localStorage for seamless refresh
  useEffect(() => {
    const saved = localStorage.getItem('onco_workstation_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.layoutMode) setLayoutMode(parsed.layoutMode);
        if (parsed.selectedContour) setSelectedContour(parsed.selectedContour);
        if (parsed.imageControls) setImageControls(parsed.imageControls);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'onco_workstation_state',
      JSON.stringify({ layoutMode, selectedContour, imageControls })
    );
  }, [layoutMode, selectedContour, imageControls]);

  const toggleContourVisibility = (contour: ContourType) => {
    setContourVisibilities(prev => ({
      ...prev,
      [contour]: !prev[contour]
    }));
  };

  const resetImageControls = () => {
    setImageControls(DEFAULT_IMAGE_CONTROLS);
  };

  const resetViewport = () => {
    setViewportState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 },
      crosshair: { x: 50, y: 50 },
      slices: { axial: 87, coronal: 128, sagittal: 102 }
    }));
    resetImageControls();
    setMeasurements([]);
  };

  const addMeasurement = (m: Measurement) => {
    setMeasurements(prev => [...prev, m]);
  };

  const clearMeasurements = () => setMeasurements([]);

  return (
    <WorkstationContext.Provider
      value={{
        patient,
        setPatient,
        activeTool,
        setActiveTool,
        layoutMode,
        setLayoutMode,
        selectedContour,
        setSelectedContour,
        contourVisibilities,
        toggleContourVisibility,
        maxContourVisible,
        setMaxContourVisible,
        imageControls,
        setImageControls,
        resetImageControls,
        viewportState,
        setViewportState,
        measurements,
        addMeasurement,
        clearMeasurements,
        isExportModalOpen,
        setIsExportModalOpen,
        sidebarOpen,
        setSidebarOpen,
        resetViewport
      }}
    >
      {children}
    </WorkstationContext.Provider>
  );
};

export const useWorkstation = () => {
  const context = useContext(WorkstationContext);
  if (!context) {
    throw new Error('useWorkstation must be used within a WorkstationProvider');
  }
  return context;
};
