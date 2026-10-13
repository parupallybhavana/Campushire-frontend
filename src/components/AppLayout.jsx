import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={`main-wrapper ${collapsed ? 'expanded' : ''}`}>
        <Topbar toggleMobileSidebar={toggleMobileSidebar} />
        <main className="page-workspace">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
