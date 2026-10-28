import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import Icon from '../../components/Icon';
import './RegistroRemuneracion.css';

export default function RegistroRemuneracion() {
  // Estado para controlar la ventana del perfil del trabajador
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fechaRegistro, setFechaRegistro] = useState(new Date());
  const [inicioDescanso, setInicioDescanso] = useState(null);
  const [finDescanso, setFinDescanso] = useState(null);
  
  // Datos del formulario de permiso
  const [sustento, setSustento] = useState('SELECCIONA');
  const [codigoPermiso, setCodigoPermiso] = useState('');
  const [tipoPermiso, setTipoPermiso] = useState('SELECCIONA');
  
  // Campos de Remuneración
  const [nDiasRem, setNDiasRem] = useState('');
  const [pendientesRem, setPendientesRem] = useState('');
  const [codigoRem, setCodigoRem] = useState('SELECCIONA');
  const [expDiasRem, setExpDiasRem] = useState('');
  
  // Catálogos desde BD
  const [catPermisos, setCatPermisos] = useState([]);
  const [catTiposPermiso, setCatTiposPermiso] = useState([]);
  const [catSubsidios, setCatSubsidios] = useState([]);

  // Data de la BD
  const [consultas, setConsultas] = useState([]);
  const [dniSearch, setDniSearch] = useState('');
  const [trabajadorData, setTrabajadorData] = useState(null);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [editandoCodigo, setEditandoCodigo] = useState(null);
  
  // Filtro de la tabla inferior
  const [filtroTabla, setFiltroTabla] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchConsultas();
    fetchCatalogos();
  }, []);

  const fetchCatalogos = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/remuneracion/catalogos');
      if (res.data.ok) {
        setCatPermisos(res.data.data.permisos || []);
        setCatTiposPermiso(res.data.data.tiposPermiso || []);
        setCatSubsidios(res.data.data.subsidios || []);
      }
    } catch (error) {
      console.error('Error fetching catalogos', error);
    }
  };

  const fetchConsultas = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/remuneracion/consultas');
      if (res.data.ok) {
        setConsultas(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching consultas', error);
    }
  };

  const handleSearchDni = async () => {
    if (!dniSearch) return;
    try {
      const res = await axios.get(`http://localhost:3006/api/escalafon/trabajador/${dniSearch}`);
      if (res.data.ok) {
        setTrabajadorData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching trabajador', error);
      alert('Trabajador no encontrado');
      setTrabajadorData(null);
    }
  };

  const handleConfirmarTrabajador = () => {
    setTrabajadorSeleccionado(trabajadorData);
    setIsModalOpen(false);
  };

  // Calcula total de días (incluye inicio y fin)
  const calcularDias = () => {
    if (inicioDescanso && finDescanso) {
      const diffTime = Math.abs(finDescanso - inicioDescanso);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 porque cuenta el día de inicio
      return diffDays;
    }
    return 0;
  };

  const handleGuardar = async () => {
    if (!trabajadorSeleccionado || !fechaRegistro || !inicioDescanso || !finDescanso || sustento === 'SELECCIONA' || tipoPermiso === 'SELECCIONA') {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        id_trabajador: trabajadorSeleccionado.id_trabajador,
        id_historial_laboral: trabajadorSeleccionado.id_historial,
        fecha_registro: fechaRegistro.toISOString().split('T')[0],
        inicio_descanso: inicioDescanso.toISOString().split('T')[0],
        fin_descanso: finDescanso.toISOString().split('T')[0],
        dias: calcularDias(),
        sustento,
        codigo_permiso: codigoPermiso,
        tipo_permiso: tipoPermiso,
        n_dias_rem: nDiasRem,
        pendientes_rem: pendientesRem,
        codigo_rem: codigoRem,
        exp_dias_rem: expDiasRem
      };

      const res = await axios.post('http://localhost:3006/api/remuneracion/licencia', payload);
      if (res.data.ok) {
        alert('Licencia registrada exitosamente');
        fetchConsultas(); // Recargar tabla
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al guardar', error);
      alert('Hubo un error al guardar la licencia');
    }
  };

  const limpiarFormulario = () => {
    setEditandoCodigo(null);
    setTrabajadorSeleccionado(null);
    setFechaRegistro(new Date());
    setInicioDescanso(null);
    setFinDescanso(null);
    setSustento('SELECCIONA');
    setCodigoPermiso('');
    setTipoPermiso('SELECCIONA');
    setNDiasRem('');
    setPendientesRem('');
    setCodigoRem('SELECCIONA');
    setExpDiasRem('');
  };

  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
  };

  const handleSelectRow = async (row) => {
    setEditandoCodigo(row.codigo);
    
    setFechaRegistro(parseDateString(row.registro) || new Date());
    setInicioDescanso(parseDateString(row.inicio));
    setFinDescanso(parseDateString(row.final));

    setSustento(row.id_permiso ? String(row.id_permiso) : (row.permiso || 'SELECCIONA'));
    setCodigoPermiso(row.cPermiso || '');
    setTipoPermiso(row.id_tipo_permiso ? String(row.id_tipo_permiso) : (row.tPermiso || 'SELECCIONA'));
    
    // Cargar campos de remuneracion
    setNDiasRem(row.n_dias_rem || '');
    setPendientesRem(row.pendientes_rem || '');
    setCodigoRem(row.id_subsidio ? String(row.id_subsidio) : (row.codigo_rem || 'SELECCIONA'));
    setExpDiasRem(row.exp_dias_rem || '');

    try {
      const res = await axios.get(`http://localhost:3006/api/escalafon/trabajador/${row.dni}`);
      if (res.data.ok) {
        setTrabajadorSeleccionado(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching selected worker', error);
    }
  };

  const handleActualizar = async () => {
    if (!editandoCodigo) {
      alert('Seleccione un registro de la tabla para actualizar');
      return;
    }
    if (!trabajadorSeleccionado || !fechaRegistro || !inicioDescanso || !finDescanso || sustento === 'SELECCIONA' || tipoPermiso === 'SELECCIONA') {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        id_trabajador: trabajadorSeleccionado.id_trabajador,
        id_historial_laboral: trabajadorSeleccionado.id_historial,
        fecha_registro: fechaRegistro.toISOString().split('T')[0],
        inicio_descanso: inicioDescanso.toISOString().split('T')[0],
        fin_descanso: finDescanso.toISOString().split('T')[0],
        dias: calcularDias(),
        sustento,
        codigo_permiso: codigoPermiso,
        tipo_permiso: tipoPermiso,
        n_dias_rem: nDiasRem,
        pendientes_rem: pendientesRem,
        codigo_rem: codigoRem,
        exp_dias_rem: expDiasRem
      };

      const res = await axios.put(`http://localhost:3006/api/remuneracion/licencia/${editandoCodigo}`, payload);
      if (res.data.ok) {
        alert('Licencia actualizada exitosamente');
        fetchConsultas(); // Recargar tabla
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al actualizar', error);
      alert('Hubo un error al actualizar la licencia');
    }
  };

  const handleEliminar = async () => {
    if (!editandoCodigo) {
      alert('Seleccione un registro de la tabla para eliminar');
      return;
    }
    
    if (window.confirm('¿Está seguro de que desea eliminar permanentemente esta licencia?')) {
      try {
        const res = await axios.delete(`http://localhost:3006/api/remuneracion/licencia/${editandoCodigo}`);
        if (res.data.ok) {
          alert('Licencia eliminada exitosamente');
          fetchConsultas();
          limpiarFormulario();
        }
      } catch (error) {
        console.error('Error al eliminar', error);
        alert('Hubo un error al eliminar la licencia');
      }
    }
  };

  // Filtrar consultas según lo que se escriba en el buscador
  const consultasFiltradas = consultas.filter(c => 
    c.dni.includes(filtroTabla) || 
    (c.apePat && c.apePat.toLowerCase().includes(filtroTabla.toLowerCase())) || 
    (c.nombres && c.nombres.toLowerCase().includes(filtroTabla.toLowerCase())) ||
    (c.codigo && String(c.codigo).toLowerCase().includes(filtroTabla.toLowerCase()))
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consultasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consultasFiltradas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

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

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroTabla]);

  return (
    <div className="registro-container">
      {/* HEADER DE LA PÁGINA */}
      <div className="page-header">
        <h1>Registro de Licencias - Remuneración</h1>
      </div>

      {/* ================= SECCIÓN 1: FORMULARIO DE DATOS ================= */}
      <div className="form-card">
        
        {/* FORMULARIO SIMPLIFICADO: 8 Campos en 2 Filas */}
        <div className="form-grid">
          {/* Fila 1 */}
          <div className="form-group">
            <label>DNI TRABAJADOR:</label>
            <div className="input-with-button">
              <input type="text" placeholder="Ej. 12345678" value={trabajadorSeleccionado ? trabajadorSeleccionado.dni : ''} readOnly />
              {/* Al hacer clic, abrimos el modal */}
              <button className="btn-search-stacked" onClick={() => setIsModalOpen(true)}>
                <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
                Buscar
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>FECHA DE REGISTRO:</label>
            <input 
              type="text" 
              readOnly 
              className="input-readonly" 
              value={fechaRegistro.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
            />
          </div>
          <div className="form-group">
            <label>INICIO DE DESCANSO:</label>
            <DatePicker 
              selected={inicioDescanso} 
              onChange={(date) => setInicioDescanso(date)} 
              placeholderText="dd / mm / aaaa"
              className="custom-datepicker-input"
              wrapperClassName="custom-datepicker-wrapper"
              dateFormat="dd/MM/yyyy"
              isClearable
              showIcon
              locale={es}
            />
          </div>
          <div className="form-group">
            <label>FIN DE DESCANSO:</label>
            <DatePicker 
              selected={finDescanso} 
              onChange={(date) => setFinDescanso(date)} 
              placeholderText="dd / mm / aaaa"
              className="custom-datepicker-input"
              wrapperClassName="custom-datepicker-wrapper"
              dateFormat="dd/MM/yyyy"
              isClearable
              showIcon
              locale={es}
            />
          </div>

          {/* Fila 2 */}
          <div className="form-group">
            <label>TOTAL (DÍAS):</label>
            <input type="number" readOnly className="input-readonly" value={calcularDias()} />
          </div>
          <div className="form-group">
            <label>PERMISO (SUSTENTO):</label>
            <select value={sustento} onChange={(e) => setSustento(e.target.value)}>
              <option value="SELECCIONA">SELECCIONA</option>
              {catPermisos.length > 0 ? (
                catPermisos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">CITT</option>
                  <option value="2">CMP / CERTIFICADO PARTICULAR</option>
                  <option value="6">RESOLUCIÓN / NINGUNO</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>CÓDIGO DE PERMISO:</label>
            <input type="text" placeholder="Ej. 12345-CITT" value={codigoPermiso} onChange={(e) => setCodigoPermiso(e.target.value)} />
          </div>
          <div className="form-group">
            <label>TIPO DE PERMISO:</label>
            <select value={tipoPermiso} onChange={(e) => setTipoPermiso(e.target.value)}>
              <option value="SELECCIONA">SELECCIONA</option>
              {catTiposPermiso.length > 0 ? (
                catTiposPermiso.map(tp => (
                  <option key={tp.id} value={tp.id}>{tp.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">ENFERMEDAD</option>
                  <option value="2">ENF. ONCOLOGICA</option>
                  <option value="3">ENF. GRAVE</option>
                  <option value="4">HOSPITALIZACION</option>
                  <option value="5">MATERNIDAD</option>
                  <option value="6">PATERNIDAD</option>
                  <option value="7">LUTO Y SEPELIO</option>
                  <option value="8">REGULARIZAR</option>
                </>
              )}
            </select>
          </div>

          {/* Fila 3: Remuneraciones */}
          <div className="form-group">
            <label>N° DIAS:</label>
            <input type="text" placeholder="Ej. 5" value={nDiasRem} onChange={(e) => setNDiasRem(e.target.value)} />
          </div>
          <div className="form-group">
            <label>PENDIENTES:</label>
            <input type="text" placeholder="Ej. 2" value={pendientesRem} onChange={(e) => setPendientesRem(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CODIGO (SUBSIDIO):</label>
            <select value={codigoRem} onChange={(e) => setCodigoRem(e.target.value)}>
              <option value="SELECCIONA">SELECCIONA</option>
              {catSubsidios.length > 0 ? (
                catSubsidios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))
              ) : (
                <>
                  <option value="1">ENF(21)</option>
                  <option value="2">MAT(22)</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>EXP - DIAS:</label>
            <input type="text" placeholder="Ej. 10" value={expDiasRem} onChange={(e) => setExpDiasRem(e.target.value)} />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="action-buttons">
          <button className="btn-action btn-add" onClick={handleGuardar} disabled={editandoCodigo !== null}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />} />
            Guardar
          </button>
          <button className="btn-action btn-update" onClick={handleActualizar} disabled={editandoCodigo === null}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />} />
            Actualizar
          </button>
          <button className="btn-action btn-delete" onClick={handleEliminar} disabled={editandoCodigo === null}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />} />
            Eliminar
          </button>
          <button className="btn-action btn-home" onClick={limpiarFormulario}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            Limpiar
          </button>
        </div>
      </div>

      {/* ================= SECCIÓN 2: TABLA ================= */}
      <div className="table-card">
        
        {/* BUSCADOR DE LA TABLA Y PAGINADOR */}
        <div className="search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label>BUSCAR REGISTRO:</label>
            <div className="search-input-wrapper">
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
              <input 
                type="text" 
                placeholder="Buscar por DNI, Nombre o Código..." 
                value={filtroTabla}
                onChange={(e) => setFiltroTabla(e.target.value)}
              />
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

        <div className="table-responsive">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Expediente</th>
                <th>Trabajador</th>
                <th>DNI</th>
                <th>Paterno</th>
                <th>Materno</th>
                <th>Nombres</th>
                <th>Tipo Trab.</th>
                <th>Sub Tipo</th>
                <th>Cargo</th>
                <th>Categoria</th>
                <th>Institucion</th>
                <th>Registro</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Total</th>
                <th>Permiso</th>
                <th>Cod Per.</th>
                <th>Tipo Per.</th>
                <th>Dias</th>
                <th>Pendientes</th>
                <th>Subsidio</th>
                <th>Exp-dias</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((c, i) => (
                  <tr 
                    key={i} 
                    onClick={() => handleSelectRow(c)} 
                    className={editandoCodigo === c.codigo ? 'selected-row' : ''} 
                    style={{cursor: 'pointer'}}
                  >
                    <td className="font-semibold text-purple">{c.expediente || c.codigo}</td>
                    <td>{c.trabajador || '-'}</td>
                    <td className="font-semibold">{c.dni}</td>
                    <td>{c.apePat}</td>
                    <td>{c.apeMat}</td>
                    <td>{c.nombres}</td>
                    <td>{c.tipoTrabajador || '-'}</td>
                    <td>{c.subTipo || '-'}</td>
                    <td>{c.cargo || '-'}</td>
                    <td>{c.categoria || '-'}</td>
                    <td className="text-muted">{c.colegio || c.institucion || '-'}</td>
                    <td>{c.registro}</td>
                    <td>{c.inicio}</td>
                    <td>{c.final}</td>
                    <td className="font-semibold text-center">{c.dias}</td>
                    <td>{c.permiso}</td>
                    <td className="text-muted">{c.cPermiso}</td>
                    <td><span className="badge badge-purple">{c.tPermiso}</span></td>
                    <td>{c.n_dias_rem || '-'}</td>
                    <td>{c.pendientes_rem || '-'}</td>
                    <td>{c.subsidio || '-'}</td>
                    <td>{c.exp_dias_rem || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="22" style={{ textAlign: 'center', padding: '20px', color: '#71717a' }}>
                    No se encontraron registros que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 0 && (
          <div className="table-footer">
            <div className="pagination">
              <button className="page-btn" onClick={goToPrevious} disabled={currentPage === 1}>
                <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />} />
              </button>
              
              {getPaginationGroup().map((page, index) => (
                <button 
                  key={index} 
                  className={`page-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  disabled={page === '...'}
                  style={page === '...' ? { cursor: 'default', background: 'transparent', border: 'none', color: '#71717a' } : {}}
                >
                  {page}
                </button>
              ))}

              <button className="page-btn" onClick={goToNext} disabled={currentPage === totalPages}>
                <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />} />
              </button>
            </div>
            <div className="showing-info">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, consultasFiltradas.length)} de {consultasFiltradas.length} registros
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL DEL PERFIL DEL TRABAJADOR ================= */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Búsqueda de Trabajador</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              {/* Buscador de DNI Superior */}
              <div className="form-group search-in-modal">
                <label>DNI <span className="text-red">*</span></label>
                <div className="input-with-button">
                  <input 
                    type="text" 
                    placeholder="Ingrese DNI..." 
                    maxLength="8" 
                    value={dniSearch} 
                    onChange={(e) => setDniSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchDni()}
                  />
                  <button className="btn-search-small" onClick={handleSearchDni}>
                    <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
                    Buscar
                  </button>
                </div>
              </div>

              <hr className="modal-divider" />

              {/* Cuadrícula de Datos Personales Encontrados */}
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>DNI Trabajador</label>
                  <div className="data-display">{trabajadorData ? trabajadorData.dni : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Nombres</label>
                  <div className="data-display">{trabajadorData ? trabajadorData.nombres : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Apellido Paterno</label>
                  <div className="data-display">{trabajadorData ? trabajadorData.ape_pat : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Apellido Materno</label>
                  <div className="data-display">{trabajadorData ? trabajadorData.ape_mat : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Tipo de Trabajador</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.tipoTrabajador || trabajadorData.tipo_trabajador_nombre || '-') : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Sub Tipo</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.subTipo || trabajadorData.subtipo_trabajador_nombre || '-') : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Cargo</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.cargo || trabajadorData.cargo_nombre || '-') : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.categoria || trabajadorData.categoria_nombre || '-') : '-'}</div>
                </div>
                <div className="form-group">
                  <label>Ley</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.ley || trabajadorData.ley_nombre || '-') : '-'}</div>
                </div>
                <div className="form-group grid-span-2">
                  <label>Institución Educativa</label>
                  <div className="data-display">{trabajadorData ? (trabajadorData.colegio || trabajadorData.institucion_nombre || '-') : '-'}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-discard" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleConfirmarTrabajador} disabled={!trabajadorData}>Confirmar Trabajador</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
