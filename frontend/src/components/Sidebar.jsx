import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import './Sidebar.css';
import UgelSantaLogo from '../assets/UgelSanta (2).svg';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isCollapsed, onToggle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Estado para controlar qué submenús están abiertos
  const [openMenus, setOpenMenus] = useState({
    registro: false,
    consultas: false
  });
  const [isTrabajadorOpen, setIsTrabajadorOpen] = useState(false);

  // Función para abrir/cerrar un submenú
  const toggleMenu = (menuName) => {
    if (!isCollapsed) {
      setOpenMenus((prev) => ({
        ...prev,
        [menuName]: !prev[menuName]
      }));
    }
  };

  return (
    <aside className={`panel-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      {/* ================= HEADER ================= */}
      <div className="sidebar-header">
        <div className="brand-logo">
          <div 
            className="brand-icon mask-logo" 
            style={{ 
              WebkitMaskImage: `url("${UgelSantaLogo}")`, 
              maskImage: `url("${UgelSantaLogo}")`,
              width: '32px', 
              height: '32px',
              backgroundColor: 'var(--text-main)'
            }}
            aria-label="UGEL Santa"
          ></div>
          <h2 className="brand-text">Ugel<span>Santa</span></h2>
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {/* Usando el ícono de las 3 líneas que elegiste anteriormente o el de panel */}
          <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />} />
        </button>
      </div>

      {/* ================= CONTENIDO SCROLL ================= */}
      <div className="sidebar-scroll">
        
        <div className="sidebar-group">{isCollapsed ? '•••' : 'MENÚ PRINCIPAL'}</div>
        <ul className="menu-list">
          
          {/* 1. Dashboard (Sin submenú) */}
          <li className="menu-item-wrapper">
            <div className="menu-item active" onClick={() => navigate('/')}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />} />
              <span className="menu-text">Dashboard</span>
            </div>
          </li>

          {/* 2. Registro de Licencias (Con submenú) */}
          <li className="menu-item-wrapper">
            <div className="menu-item" onClick={() => toggleMenu('registro')}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />} />
              <span className="menu-text">Registro de Licencias</span>
              <Icon 
                path={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />} 
                className={`chevron ${openMenus.registro ? 'open' : ''}`} 
              />
            </div>
            
            {/* Opciones del Submenú */}
            {openMenus.registro && !isCollapsed && (
              <ul className="submenu-list">
                <li className="submenu-item" onClick={() => navigate('/registro/escalafon')}>
                  Escalafón
                </li>
                <li className="submenu-item" onClick={() => navigate('/registro/remuneracion')}>Remuneraciones</li>
              </ul>
            )}
          </li>

          {/* 3. Consultas y Reportes (Con submenú) */}
          <li className="menu-item-wrapper">
            <div className="menu-item" onClick={() => toggleMenu('consultas')}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />} />
              <span className="menu-text">Consultas y Reportes</span>
              <Icon 
                path={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />} 
                className={`chevron ${openMenus.consultas ? 'open' : ''}`} 
              />
            </div>
            
            {/* Opciones del Submenú */}
            {openMenus.consultas && !isCollapsed && (
              <ul className="submenu-list">
                <li className="submenu-item" onClick={() => navigate('/consultas/escalafon')}>
                  Escalafón
                </li>
                <li className="submenu-item" onClick={() => navigate('/consultas/remuneracion')}>Remuneraciones</li>
              </ul>
            )}
          </li>

        {/* ================= MENÚ: REGISTRO ================= */}
        <li className="menu-item-wrapper">
          <div 
            className="menu-item" 
            onClick={() => setIsTrabajadorOpen(!isTrabajadorOpen)}
          >
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />} />
            <span className="menu-text">Registro</span>
            <Icon 
              path={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />} 
              className={`chevron ${isTrabajadorOpen ? 'open' : ''}`} 
            />
          </div>

          {/* SUB-MENÚ DESPLEGABLE */}
          {isTrabajadorOpen && !isCollapsed && (
            <ul className="submenu-list">
              <li className="submenu-item" onClick={() => navigate('/trabajadores')}>
                Trabajador
              </li>
              <li className="submenu-item" onClick={() => navigate('/instituciones')}>
                Institución
              </li>
            </ul>
          )}
        </li>

        </ul>

        {/* ================= SOPORTE (Opcional) ================= */}
        <div className="sidebar-group">{isCollapsed ? '•••' : 'SOPORTE'}</div>
        <ul className="menu-list">
          <li className="menu-item-wrapper">
            <div className="menu-item" onClick={() => navigate('/profile')}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />} />
              <span className="menu-text">Mi Perfil</span>
            </div>
          </li>
          <li className="menu-item-wrapper">
            <div className="menu-item" onClick={logout}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />} />
              <span className="menu-text">Cerrar Sesión</span>
            </div>
          </li>
        </ul>

      </div>
    </aside>
  );
}