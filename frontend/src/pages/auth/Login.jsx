import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import UgelSantaLogo from '../../assets/UgelSanta (2).svg';

const Login = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(dni, password);
      
      if (!result.success) {
        setError(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
       
        {/* LADO IZQUIERDO: Logo UGEL Santa */}
        <div className="login-sidebar">
          <div 
            className="login-logo-img mask-login-logo" 
            style={{ 
              WebkitMaskImage: `url("${UgelSantaLogo}")`, 
              maskImage: `url("${UgelSantaLogo}")` 
            }}
            aria-label="UGEL Santa"
          ></div>
        </div>

        {/* LADO DERECHO: Formulario */}
        <div className="login-main">
          <div className="header-titles">
            <h2>Bienvenido a UGEL Santa</h2>
            <p>Ingrese sus credenciales para continuar</p>
          </div>

          {/* MENSAJE DE ERROR GENERAL */}
          {error && (
            <div className="alert-general" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-content">
            <div className="input-group">
              <label>DNI o Usuario <span className="asterisk">*</span></label>
              <div className="input-box">
                <svg className="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Ej. 32817128" 
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña <span className="asterisk">*</span></label>
              <div className="input-box">
                <svg className="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <input 
                  type="password" 
                  placeholder="••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <a href="#recover" className="link-recover">Recuperar acceso</a>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;