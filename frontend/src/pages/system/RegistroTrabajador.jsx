import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import './RegistroTrabajador.css';
import axios from 'axios';

export default function RegistroTrabajador() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [catalogos, setCatalogos] = useState({
    tipos: [],
    subtipos: [],
    niveles: [],
    categorias: [],
    estados: [],
    leyes: [],
    distritos: [],
    instituciones: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    id_trabajador: null,
    dni: '', ape_pat: '', ape_mat: '', nombres: '',
    cod_plaza: '', nivel: '', tipo_trabajador: '', subtipo_trabajador: '',
    cargo: '', categoria: '', estado: '2', ley: '',
    distrito: '', institucion: '', horas_jornada: '',
    fecha_inicio: '', fecha_final: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectTrabajador = (t) => {
    setFormData({
      id_trabajador: t.id_trabajador,
      dni: t.dni || '',
      ape_pat: t.ape_pat || '',
      ape_mat: t.ape_mat || '',
      nombres: t.nombres || '',
      cod_plaza: t.cod_plaza || '',
      nivel: t.id_nivel_educativo ? String(t.id_nivel_educativo) : (t.nivel || ''),
      tipo_trabajador: t.id_tipo_trabajador ? String(t.id_tipo_trabajador) : (t.tipo_trabajador || ''),
      subtipo_trabajador: t.id_subtipo_trabajador ? String(t.id_subtipo_trabajador) : (t.subtipo_trabajador || ''),
      cargo: t.id_cargo ? String(t.id_cargo) : (t.cargo || ''),
      categoria: t.id_categoria ? String(t.id_categoria) : (t.categoria || ''),
      estado: (t.id_estado_laboral === 2 || String(t.estado) === '2' || (t.estado_nombre && t.estado_nombre.toUpperCase() === 'ACTIVO')) ? '2' : '1',
      ley: t.id_ley ? String(t.id_ley) : (t.ley || ''),
      distrito: t.id_distrito ? String(t.id_distrito) : (t.distrito || ''),
      institucion: t.cod_mod_institucion ? String(t.cod_mod_institucion) : (t.institucion || ''),
      horas_jornada: t.horas_jornada || '',
      fecha_inicio: t.fecha_inicio ? t.fecha_inicio.split('T')[0] : '',
      fecha_final: t.fecha_final ? t.fecha_final.split('T')[0] : ''
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      id_trabajador: null, dni: '', ape_pat: '', ape_mat: '', nombres: '',
      cod_plaza: '', nivel: '', tipo_trabajador: '', subtipo_trabajador: '',
      cargo: '', categoria: '', estado: '2', ley: '', distrito: '', institucion: '',
      horas_jornada: '', fecha_inicio: '', fecha_final: ''
    });
    setIsEditing(false);
  };
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchTrabajadores = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/trabajadores');
      if (res.data.ok) {
        setTrabajadores(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching trabajadores', error);
    }
  };

  const fetchCatalogos = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/trabajadores/catalogos');
      if (res.data.ok) {
        setCargos(res.data.data.cargos || []);
        setCatalogos({
          tipos: res.data.data.tipos || [],
          subtipos: res.data.data.subtipos || [],
          niveles: res.data.data.niveles || [],
          categorias: res.data.data.categorias || [],
          estados: res.data.data.estados || [],
          leyes: res.data.data.leyes || [],
          distritos: res.data.data.distritos || [],
          instituciones: res.data.data.instituciones || []
        });
      }
    } catch (error) {
      console.error('Error fetching catalogos', error);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
    fetchCatalogos();
  }, []);

  const handleGuardar = async () => {
    if (!formData.dni || !formData.ape_pat || !formData.nombres) {
      alert('Por favor complete los campos obligatorios (DNI, Apellido Paterno, Nombres)');
      return;
    }
    try {
      const payload = {
        ...formData,
        id_cargo: formData.cargo,
        id_nivel_educativo: formData.nivel,
        id_tipo_trabajador: formData.tipo_trabajador,
        id_subtipo_trabajador: formData.subtipo_trabajador,
        id_categoria: formData.categoria,
        id_estado_laboral: formData.estado,
        id_ley: formData.ley,
        id_distrito: formData.distrito,
        cod_mod_institucion: formData.institucion
      };
      const res = await axios.post('http://localhost:3006/api/trabajadores', payload);
      if (res.data.ok) {
        alert('Trabajador registrado exitosamente');
        fetchTrabajadores();
        handleClear();
      }
    } catch (err) {
      console.error(err);
      alert('Error al registrar trabajador: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActualizar = async () => {
    if (!formData.dni) {
      alert('Seleccione un trabajador para actualizar');
      return;
    }
    try {
      const payload = {
        ...formData,
        id_cargo: formData.cargo,
        id_nivel_educativo: formData.nivel,
        id_tipo_trabajador: formData.tipo_trabajador,
        id_subtipo_trabajador: formData.subtipo_trabajador,
        id_categoria: formData.categoria,
        id_estado_laboral: formData.estado,
        id_ley: formData.ley,
        id_distrito: formData.distrito,
        cod_mod_institucion: formData.institucion
      };
      const res = await axios.put(`http://localhost:3006/api/trabajadores/${formData.dni}`, payload);
      if (res.data.ok) {
        alert('Trabajador actualizado exitosamente');
        fetchTrabajadores();
        handleClear();
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar trabajador: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEliminar = async () => {
    if (!formData.dni) {
      alert('Seleccione un trabajador para eliminar');
      return;
    }
    if (window.confirm(`¿Está seguro de eliminar permanentemente al trabajador con DNI ${formData.dni}?`)) {
      try {
        const res = await axios.delete(`http://localhost:3006/api/trabajadores/${formData.dni}`);
        if (res.data.ok) {
          alert('Trabajador eliminado exitosamente');
          fetchTrabajadores();
          handleClear();
        }
      } catch (err) {
        console.error(err);
        alert('Error al eliminar trabajador');
      }
    }
  };

  const filtered = trabajadores.filter(t => 
    t.dni?.includes(searchTerm) || 
    t.ape_pat?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cargo_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getPaginationGroup = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  };

  const sortedCargos = [...cargos].sort((a, b) => {
    const nameA = (a.cargo_nombre || a.nombre || '').trim();
    const nameB = (b.cargo_nombre || b.nombre || '').trim();
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
  });

  return (
    <div className="registro-container">
      {/* HEADER DE LA PÁGINA */}
      <div className="page-header">
        <h1>Registro de Trabajador - Escalafón</h1>
      </div>

      {/* ================= SECCIÓN 1: FORMULARIO DE DATOS ================= */}
      <div className="form-card">
        <h2 className="section-title">DATOS DEL TRABAJADOR</h2>
        
        <div className="form-grid">
          {/* Fila 1 */}
          <div className="form-group">
            <label>DNI:</label>
            <div className="input-with-button">
              <input type="text" name="dni" value={formData.dni} onChange={handleChange} maxLength="8" placeholder="Ej. 12345678" />
            </div>
          </div>
          <div className="form-group">
            <label>APELLIDO PATERNO:</label>
            <input type="text" name="ape_pat" value={formData.ape_pat} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>APELLIDO MATERNO:</label>
            <input type="text" name="ape_mat" value={formData.ape_mat} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>NOMBRES:</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} />
          </div>

          {/* Fila 2 */}
          <div className="form-group">
            <label>CÓDIGO DE PLAZA:</label>
            <input type="text" name="cod_plaza" value={formData.cod_plaza} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>NIVEL EDUCATIVO:</label>
            <select name="nivel" value={formData.nivel} onChange={handleChange}>
              <option value="">SELECCIONA</option>
              {catalogos.niveles.length > 0 ? (
                catalogos.niveles.map(n => (
                  <option key={n.id} value={n.id}>{n.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">Inicial</option>
                  <option value="2">Primaria</option>
                  <option value="3">Secundaria</option>
                  <option value="4">Superior</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>TIPO DE TRABAJADOR:</label>
            <select name="tipo_trabajador" value={formData.tipo_trabajador} onChange={handleChange}>
              <option value="">Selecciona tipo...</option>
              {catalogos.tipos.length > 0 ? (
                catalogos.tipos.map(tp => (
                  <option key={tp.id} value={tp.id}>{tp.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">ADMINISTRATIVO</option>
                  <option value="2">CAS</option>
                  <option value="3">DOCENTE</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>SUBTIPO:</label>
            <select name="subtipo_trabajador" value={formData.subtipo_trabajador} onChange={handleChange}>
              <option value="">Selecciona subtipo...</option>
              {catalogos.subtipos.length > 0 ? (
                catalogos.subtipos.map(st => (
                  <option key={st.id} value={st.id}>{st.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">FUNCIONARIO</option>
                  <option value="2">PROFESIONAL</option>
                  <option value="3">TECNICO</option>
                </>
              )}
            </select>
          </div>

          {/* Fila 3 - Cargo ampliado y ordenado alfabéticamente */}
          <div className="form-group grid-span-2">
            <label>CARGO:</label>
            <select name="cargo" value={formData.cargo} onChange={handleChange} className="select-cargo">
              <option value="">SELECCIONA CARGO</option>
              {sortedCargos.map(c => (
                <option key={c.id_cargo || c.id} value={c.id_cargo || c.id}>
                  {c.cargo_nombre || c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>CATEGORÍA:</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">SELECCIONA</option>
              {catalogos.categorias.length > 0 ? (
                catalogos.categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>ESTADO:</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="2">Activo</option>
              <option value="1">Inactivo</option>
            </select>
          </div>

          {/* Fila 4 */}
          <div className="form-group">
            <label>LEY:</label>
            <select name="ley" value={formData.ley} onChange={handleChange}>
              <option value="">SELECCIONA</option>
              {catalogos.leyes.length > 0 ? (
                catalogos.leyes.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">Ley 29944</option>
                  <option value="2">DL 276</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>DISTRITO:</label>
            <select name="distrito" value={formData.distrito} onChange={handleChange}>
              <option value="">Selecciona Distrito...</option>
              {catalogos.distritos.length > 0 ? (
                catalogos.distritos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">Chimbote</option>
                  <option value="2">Nuevo Chimbote</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group grid-span-2">
            <label>INSTITUCIÓN EDUCATIVA:</label>
            <select name="institucion" value={formData.institucion} onChange={handleChange}>
              <option value="">Selecciona I.E...</option>
              {catalogos.instituciones.length > 0 ? (
                catalogos.instituciones.map(ie => (
                  <option key={ie.id} value={ie.id}>{ie.nombre}</option>
                ))
              ) : (
                <option value="1">I.E.</option>
              )}
            </select>
          </div>

          {/* Fila 5 */}
          <div className="form-group">
            <label>JORNADA:</label>
            <input type="text" name="horas_jornada" value={formData.horas_jornada} onChange={handleChange} placeholder="Ej. 30 Hrs" />
          </div>
          <div className="form-group">
            <label>FECHA DE INICIO:</label>
            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>FECHA DE TÉRMINO:</label>
            <input type="date" name="fecha_final" value={formData.fecha_final} onChange={handleChange} />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="action-buttons">
          <button className="btn-action btn-add" onClick={handleGuardar} disabled={isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />} />
            Guardar
          </button>
          <button className="btn-action btn-update" onClick={handleActualizar} disabled={!isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />} />
            Actualizar
          </button>
          <button className="btn-action btn-delete" onClick={handleEliminar} disabled={!isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />} />
            Eliminar
          </button>
          <button className="btn-action btn-home" onClick={handleClear}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            Limpiar
          </button>
        </div>
      </div>

      {/* ================= SECCIÓN 2: BÚSQUEDA Y TABLA ================= */}
      <div className="table-card">
        
        <div className="search-toolbar-inline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label>BUSCAR REGISTRO:</label>
            <div className="search-input-wrapper-dark">
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
              <input type="text" placeholder="Buscar por DNI, Nombre o Código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Per Page :</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '2px solid #27272a', backgroundColor: '#18181b', color: '#e4e4e7', outline: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Paterno</th>
                <th>Materno</th>
                <th>Nombres</th>
                <th>Plaza</th>
                <th>Nivel Educativo</th>
                <th>Tipo</th>
                <th>Sub Tipo</th>
                <th>Cargo</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Ley</th>
                <th>Distrito</th>
                <th>Institución</th>
                <th>Jornada</th>
                <th>Inicio</th>
                <th>Término</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(t => (
                <tr key={t.id_trabajador} onClick={() => handleSelectTrabajador(t)} style={{ cursor: 'pointer' }} className={formData.id_trabajador === t.id_trabajador ? 'selected-row' : ''}>
                  <td className="font-semibold text-purple">{t.dni}</td>
                  <td>{t.ape_pat}</td>
                  <td>{t.ape_mat}</td>
                  <td>{t.nombres}</td>
                  <td>{t.cod_plaza || '-'}</td>
                  <td>{t.nivel_nombre || '-'}</td>
                  <td>{t.tipo_trabajador_nombre || '-'}</td>
                  <td>{t.subtipo_trabajador_nombre || '-'}</td>
                  <td>{t.cargo_nombre || '-'}</td>
                  <td>{t.categoria_nombre || '-'}</td>
                  <td>
                    <span className={`badge ${t.id_estado_laboral === 2 || String(t.estado) === '2' || (t.estado_nombre && t.estado_nombre.toUpperCase() === 'ACTIVO') ? 'badge-green' : 'badge-red'}`}>
                      {t.id_estado_laboral === 2 || String(t.estado) === '2' || (t.estado_nombre && t.estado_nombre.toUpperCase() === 'ACTIVO') ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{t.ley_nombre || '-'}</td>
                  <td>{t.distrito_nombre || '-'}</td>
                  <td className="text-muted">{t.institucion_nombre || '-'}</td>
                  <td>{t.horas_jornada ? `${t.horas_jornada} Hrs` : '-'}</td>
                  <td>{t.fecha_inicio || '-'}</td>
                  <td>{t.fecha_final || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-buttons">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                &larr;
              </button>
              
              {getPaginationGroup().map((page, i) => (
                <button 
                  key={i} 
                  className={`pagination-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  style={page === '...' ? { cursor: 'default', background: 'transparent', border: 'none', color: '#71717a' } : {}}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
              >
                &rarr;
              </button>
            </div>
            <div className="pagination-info">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filtered.length)} de {filtered.length} registros
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
