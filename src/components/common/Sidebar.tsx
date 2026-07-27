import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkstation } from '../../context/WorkstationContext';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  MonitorPlay, 
  Layers, 
  Activity, 
  FileCheck2, 
  CalendarClock, 
  Settings,
  X
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useWorkstation();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Patients', path: '/patients', icon: <Users size={16} />, badge: '78' },
    { label: 'Studies', path: '/studies', icon: <FolderKanban size={16} />, badge: '24' },
    { label: 'DICOM Viewer', path: '/viewer', icon: <MonitorPlay size={16} /> },
    { label: 'Contours', path: '/contours', icon: <Layers size={16} /> },
    { label: 'Dose Analysis', path: '/dose-analysis', icon: <Activity size={16} /> },
    { label: 'Reports', path: '/reports', icon: <FileCheck2 size={16} />, badge: '5' },
    { label: 'Follow Up', path: '/follow-up', icon: <CalendarClock size={16} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={16} /> },
  ];

  if (!sidebarOpen) return null;

  return (
    <>
      <div 
        className="ws-sidebar-backdrop"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className="ws-sidebar-drawer">
        <div className="ws-sidebar-header">
          <span className="ws-sidebar-title">Clinical Navigation</span>
          <button 
            className="ws-icon-btn" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="ws-sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `ws-sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="ws-sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">DR</div>
            <div className="user-meta">
              <span className="user-name">Dr. Rajesh Kumar</span>
              <span className="user-role">Radiation Oncologist</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
