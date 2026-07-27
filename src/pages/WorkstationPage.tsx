import React from 'react';
import { Toolbar } from '../components/common/Toolbar';
import { LeftPanel } from '../components/workstation/LeftPanel';
import { RightPanel } from '../components/workstation/RightPanel';
import { ViewportGrid } from '../components/workstation/ViewportGrid';

export const WorkstationPage: React.FC = () => (
  <div className="ws-main">
    <LeftPanel />
    <section className="ws-workstation-center">
      <Toolbar />
      <ViewportGrid />
    </section>
    <RightPanel />
  </div>
);
