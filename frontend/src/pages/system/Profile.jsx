import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cuenta');
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo_electronico: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Estados para el modal de cambio de contraseña
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (user?.dni) {
      axios.get(`http://localhost:3006/api/users/profile/${user.dni}`)
        .then(response => {
          if (response.data) {
            setFormData({
              nombre: response.data.nombre || '',
              apellido: response.data.apellido || '',
              telefono: response.data.telefono || '',
              correo_electronico: response.data.correo_electronico || ''
            });
          }
        })
        .catch(err => console.error("Error al cargar el perfil:", err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    try {
      await axios.put(`http://localhost:3006/api/users/profile/${user.dni}`, formData);
      setMensaje('Perfil actualizado correctamente');
    } catch (error) {
      setMensaje('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Perfil</h1>
      </div>

      <div className="profile-layout">
        
        {/* ================= COLUMNA IZQUIERDA: MENÚ ================= */}
        <aside className="profile-sidebar-menu">
          <div 
            className={`profile-nav-item ${activeTab === 'cuenta' ? 'active' : ''}`}
            onClick={() => setActiveTab('cuenta')}
          >
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />} />
            <div className="nav-item-text">
              <h4>Cuenta</h4>
              <p>Gestiona tus datos personales</p>
            </div>
          </div>
          
          <div 
            className={`profile-nav-item ${activeTab === 'seguridad' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguridad')}
          >
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            <div className="nav-item-text">
              <h4>Seguridad</h4>
              <p>Establezca su contraseña, autenticación, etc</p>
            </div>
          </div>
          

        </aside>

        {/* ================= COLUMNA DERECHA: CONTENIDO ================= */}
        <div className="profile-content-card">
          
          {/* ----- VISTA: CUENTA ----- */}
          {activeTab === 'cuenta' && (
            <>
              <h3>Detalles de la cuenta</h3>
              


              <form className="profile-form" onSubmit={handleSubmit}>
                {mensaje && (
                  <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: mensaje.includes('Error') ? '#fee2e2' : '#dcfce7', color: mensaje.includes('Error') ? '#ef4444' : '#16a34a' }}>
                    {mensaje}
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombres</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingresa tus nombres" required />
                  </div>
                  <div className="form-group">
                    <label>Apellidos</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ingresa tus apellidos" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Número de teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ingresa tu teléfono" />
                  </div>
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} placeholder="Ingresa tu correo" />
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ----- VISTA: SEGURIDAD ----- */}
          {activeTab === 'seguridad' && (
            <>
              <h3>Seguridad</h3>
              
              <div className="security-list">
                
                <div className="security-item">
                  <div className="security-icon-box">
                    <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />} />
                  </div>
                  <div className="security-info">
                    <h4>Contraseña actual</h4>
                    <p>Cambie la contraseña de su cuenta para mantener su perfil seguro</p>
                  </div>
                  <button className="security-action btn-link" onClick={() => setIsPasswordModalOpen(true)} style={{ background: 'none', border: 'none' }}>Cambio</button>
                </div>

                <div className="security-item">
                  <div className="security-icon-box">
                    <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
                  </div>
                  <div className="security-info">
                    <h4>Autenticación de dos factores</h4>
                    <p>Active la verificación en dos pasos para mejorar la protección de la cuenta</p>
                  </div>
                  <a href="#enable" className="security-action">Enable</a>
                </div>



              </div>
            </>
          )}



        </div>
      </div>

      {/* ================= MODAL ACTUALIZAR CONTRASEÑA ================= */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div>
                <h3>Actualizar Contraseña</h3>
                <p>Crea una contraseña segura para mantener tu cuenta a salvo</p>
              </div>
              <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}>
                <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />} />
              </button>
            </div>

            <div className="modal-body">
              {passwordError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  {passwordError}
                </div>
              )}
              
              <div className="form-group">
                <label>Contraseña Actual</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.current ? 'text' : 'password'} 
                    placeholder="Ingresa tu contraseña actual"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}>
                    <Icon path={showPassword.current 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.new ? 'text' : 'password'} 
                    placeholder="Elige una nueva contraseña"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}>
                    <Icon path={showPassword.new 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.confirm ? 'text' : 'password'} 
                    placeholder="Vuelve a escribir la nueva contraseña"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}>
                    <Icon path={showPassword.confirm 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />} />
                  </button>
                </div>
              </div>

            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={async () => {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  setPasswordError('Las contraseñas nuevas no coinciden');
                  return;
                }
                if (!passwordData.currentPassword || !passwordData.newPassword) {
                  setPasswordError('Llena todos los campos');
                  return;
                }
                
                try {
                  await axios.put(`http://localhost:3006/api/users/profile/${user.dni}/password`, {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                  });
                  setPasswordError('');
                  alert('Contraseña actualizada correctamente');
                  setIsPasswordModalOpen(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } catch (error) {
                  setPasswordError(error.response?.data?.mensaje || 'Error al actualizar contraseña');
                }
              }}>Aplicar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}