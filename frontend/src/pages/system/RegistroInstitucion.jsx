import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import './RegistroInstitucion.css';
import axios from 'axios';

export default function RegistroInstitucion() {
  const [instituciones, setInstituciones] = useState([]);
  const [catalogos, setCatalogos] = useState({
    zonas: [],
    gestiones: [],
    distritos: [],
    tiposInstitucion: []
  });
  const [formData, setFormData] = useState({
    cod_mod: '',
    nombre: '',
    id_distrito: '',
    id_zona: '',
    id_gestion: '',
    es_eib: false,
    tipo_institucion: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchInstituciones = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/instituciones');
      if (res.data.ok) {
        setInstituciones(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching instituciones:', error);
    }
  };

  const fetchCatalogos = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/instituciones/catalogos');
      if (res.data.ok) {
        setCatalogos(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching catalogos instituciones:', error);
    }
  };

  useEffect(() => {
    fetchInstituciones();
    fetchCatalogos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' || type === 'radio' ? (value === 'SI') : value
    });
  };

  const clearForm = () => {
    setFormData({ cod_mod: '', nombre: '', id_distrito: '', id_zona: '', id_gestion: '', es_eib: false, tipo_institucion: '' });
    setIsEditing(false);
  };

  const handleSelectRow = (inst) => {
    setFormData({
      cod_mod: inst.cod_mod,
      nombre: inst.nombre,
      id_distrito: inst.id_distrito ? String(inst.id_distrito) : '',
      id_zona: inst.id_zona ? String(inst.id_zona) : '',
      id_gestion: inst.id_gestion ? String(inst.id_gestion) : '',
      es_eib: inst.es_eib === 1 || inst.es_eib === true,
      tipo_institucion: inst.tipo_institucion ? String(inst.tipo_institucion) : ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (!formData.cod_mod || !formData.nombre) {
      alert('Por favor ingrese el Código Modular y el Nombre de la Institución');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3006/api/instituciones', formData);
      if (res.data.ok) {
        alert('Institución registrada exitosamente');
        fetchInstituciones();
        clearForm();
      }
    } catch (error) {
      console.error('Error saving institucion:', error);
      alert('Error al registrar la institución');
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) return;
    try {
      const res = await axios.put(`http://localhost:3006/api/instituciones/${formData.cod_mod}`, formData);
      if (res.data.ok) {
        alert('Institución actualizada exitosamente');
        fetchInstituciones();
        clearForm();
      }
    } catch (error) {
      console.error('Error updating institucion:', error);
      alert('Error al actualizar la institución');
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm('¿Estás seguro de eliminar esta institución?')) return;
    try {
      const res = await axios.delete(`http://localhost:3006/api/instituciones/${formData.cod_mod}`);
      if (res.data.ok) {
        alert('Institución eliminada exitosamente');
        fetchInstituciones();
        clearForm();
      }
    } catch (error) {
      console.error('Error deleting institucion:', error);
      alert('Error al eliminar la institución');
    }
  };

  const filteredInstituciones = instituciones.filter(inst => 
    inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inst.cod_mod.includes(searchTerm)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInstituciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInstituciones.length / itemsPerPage);

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

  return (
    <div className="registro-container">
      <div className="page-header">
        <h1>Registro de Instituciones Educativas - UGEL Santa</h1>
      </div>

      <div className="form-card">
        <h2 className="section-title">DATOS DE LA INSTITUCIÓN</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>CÓDIGO MODULAR:</label>
            <input type="text" maxLength="7" name="cod_mod" value={formData.cod_mod} onChange={handleChange} placeholder="Ej. 0234567" disabled={isEditing} />
          </div>
          <div className="form-group grid-span-2">
            <label>INSTITUCIÓN EDUCATIVA:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. I.E. 88001 EX 314" />
          </div>
          <div className="form-group">
            <label>DISTRITO:</label>
            <select name="id_distrito" value={formData.id_distrito} onChange={handleChange}>
              <option value="">SELECCIONA DISTRITO</option>
              {catalogos.distritos.length > 0 ? (
                catalogos.distritos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))
              ) : (
                <option value="1">Chimbote</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>ZONA:</label>
            <select name="id_zona" value={formData.id_zona} onChange={handleChange}>
              <option value="">SELECCIONA ZONA</option>
              {catalogos.zonas.length > 0 ? (
                catalogos.zonas.map(z => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">URBANA</option>
                  <option value="2">RURAL 1</option>
                  <option value="3">RURAL 2</option>
                  <option value="4">RURAL 3</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>GESTIÓN:</label>
            <select name="id_gestion" value={formData.id_gestion} onChange={handleChange}>
              <option value="">SELECCIONA GESTIÓN</option>
              {catalogos.gestiones.length > 0 ? (
                catalogos.gestiones.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">SEDE ADMINISTRATIVA</option>
                  <option value="2">ESTATAL</option>
                  <option value="3">CONVENIO - OTROS</option>
                  <option value="4">PARROQUIAL - ESTATAL</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>TIPO DE INSTITUCIÓN:</label>
            <select name="tipo_institucion" value={formData.tipo_institucion} onChange={handleChange}>
              <option value="">SELECCIONA TIPO</option>
              {catalogos.tiposInstitucion.length > 0 ? (
                catalogos.tiposInstitucion.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">UNIDOCENTE</option>
                  <option value="2">POLIDOCENTE COMPLETO</option>
                  <option value="3">MULTIGRADO</option>
                  <option value="4">NO APLICA</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>EIB (Bilingüe):</label>
            <div className="radio-options">
              <label className="radio-label">
                <input type="radio" name="es_eib" value="SI" checked={formData.es_eib === true} onChange={handleChange} />
                <span>SI</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="es_eib" value="NO" checked={formData.es_eib === false} onChange={handleChange} />
                <span>NO</span>
              </label>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-action btn-add" onClick={handleSubmit} disabled={isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />} />
            Guardar
          </button>
          <button className="btn-action btn-update" onClick={handleUpdate} disabled={!isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />} />
            Actualizar
          </button>
          <button className="btn-action btn-delete" onClick={handleDelete} disabled={!isEditing}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />} />
            Eliminar
          </button>
          <button className="btn-action btn-home" onClick={clearForm}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="search-toolbar-inline">
          <label>BUSCAR INSTITUCIÓN:</label>
          <div className="search-input-wrapper-dark">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
            <input type="text" placeholder="Buscar por Nombre o Código Modular..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Cód. Modular</th>
                <th>Institución</th>
                <th>Distrito</th>
                <th>Zona</th>
                <th>Gestión</th>
                <th>Tipo Inst.</th>
                <th>EIB</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(inst => (
                <tr key={inst.cod_mod} onClick={() => handleSelectRow(inst)} style={{ cursor: 'pointer' }} className={formData.cod_mod === inst.cod_mod ? 'selected-row' : ''}>
                  <td className="font-semibold text-purple">{inst.cod_mod}</td>
                  <td className="font-semibold">{inst.nombre}</td>
                  <td>{inst.distrito_nombre || inst.id_distrito}</td>
                  <td>{inst.zona_nombre || inst.id_zona}</td>
                  <td className="text-muted">{inst.gestion_nombre || inst.id_gestion}</td>
                  <td>{inst.tipo_institucion_nombre || inst.tipo_institucion}</td>
                  <td>
                    {inst.es_eib ? (
                      <span className="badge badge-purple">SI</span>
                    ) : (
                      <span className="badge badge-gray">NO</span>
                    )}
                  </td>
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
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredInstituciones.length)} de {filteredInstituciones.length} registros
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
