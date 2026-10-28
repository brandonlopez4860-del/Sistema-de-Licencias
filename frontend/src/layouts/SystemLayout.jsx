import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './SystemLayout.css';

export default function SystemLayout() {
  // Manejan el estado del diseño
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // NUEVO ESTADO

  return (
    <div className={`panel-layout ${isDarkMode ? 'dark' : ''}`}>
      {/* Pasamos el estado y la función para cambiarlo al Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="panel-main-wrapper">
        <div className="panel-main">
          <Topbar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <main className="panel-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}