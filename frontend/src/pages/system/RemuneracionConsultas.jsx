import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import './RemuneracionConsultas.css';

export default function RemuneracionConsultas() {
  const [tableData, setTableData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterLetra, setFilterLetra] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Computed data based on filters
  const filteredData = tableData.filter(row => {
    let matchText = true;
    let matchLetra = true;
    let matchDate = true;

    if (filterText) {
      const ft = filterText.toLowerCase();
      matchText = 
        (row.dni && row.dni.toLowerCase().includes(ft)) ||
        (row.nombres && row.nombres.toLowerCase().includes(ft)) ||
        (row.apePat && row.apePat.toLowerCase().includes(ft)) ||
        (row.apeMat && row.apeMat.toLowerCase().includes(ft)) ||
        (row.expediente && String(row.expediente).toLowerCase().includes(ft)) ||
        (row.codigo && String(row.codigo).toLowerCase().includes(ft)) ||
        (row.colegio && row.colegio.toLowerCase().includes(ft)) ||
        (row.institucion && row.institucion.toLowerCase().includes(ft));
    }

    if (filterLetra) {
      matchLetra = row.apePat && row.apePat.charAt(0).toLowerCase() === filterLetra.toLowerCase();
    }

    if (startDate || endDate) {
      if (row.registro) {
        // row.registro format is dd/mm/yyyy
        const parts = row.registro.split('/');
        if (parts.length === 3) {
          const rowDate = new Date(parts[2], parts[1] - 1, parts[0]);
          if (startDate && rowDate < startDate) matchDate = false;
          if (endDate && rowDate > endDate) matchDate = false;
        }
      }
    }

    return matchText && matchLetra && matchDate;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, filterLetra, startDate, endDate]);

  const limpiarFiltros = () => {
    setStartDate(null);
    setEndDate(null);
    setFilterText('');
    setFilterLetra('');
  };

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

  // Integración real con el backend (Mantenida de nuestra implementación anterior)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/remuneracion/consultas');
        const json = await response.json();
        if (json.ok) {
          setTableData(json.data);
        } else {
          setError('Error al cargar datos');
        }
      } catch (err) {
        console.error(err);
        setError('Error de red al cargar datos');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const generarPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFontSize(18);
      doc.text('Reporte de Licencias y Permisos - Remuneración', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

      const columnas = ["Expediente", "Trabajador", "DNI", "Paterno", "Materno", "Nombres", "Tipo Trab.", "Sub Tipo", "Cargo", "Categoria", "Institucion", "Registro", "Inicio", "Fin", "Total", "Permiso", "Cod Per.", "Tipo Per.", "Dias", "Pendientes", "Subsidio", "Exp-dias"];
      const filas = filteredData.map(row => [
        row.expediente || row.codigo, row.trabajador || '-', row.dni, row.apePat, row.apeMat, row.nombres, row.tipoTrabajador || '-', row.subTipo || '-', row.cargo || '-', row.categoria || '-', row.colegio || row.institucion || '-',
        row.registro, row.inicio, row.final, row.dias, row.permiso, row.cPermiso, row.tPermiso, row.n_dias_rem || '-', row.pendientes_rem || '-', row.subsidio || '-', row.exp_dias_rem || '-'
      ]);

      autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 35, 
        theme: 'grid',
        headStyles: { fillColor: [92, 89, 232], textColor: 255 },
        styles: { fontSize: 7, cellPadding: 2 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      doc.autoPrint();
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

    } catch (error) {
      alert("Error al intentar imprimir: " + error.message);
      console.error(error);
    }
  };

  const exportarExcel = () => {
    try {
      const columnas = ["Expediente", "Trabajador", "DNI", "A. Paterno", "A. Materno", "Nombres", "Tipo Trab.", "Sub Tipo", "Cargo", "Categoria", "Institucion", "Registro", "Inicio", "Fin", "Total", "Permiso", "Cod Per.", "Tipo Per.", "Dias", "Pendientes", "Subsidio", "Exp-dias"];
      const filas = filteredData.map(row => [
        row.expediente || row.codigo, row.trabajador || '-', row.dni, row.apePat, row.apeMat, row.nombres, row.tipoTrabajador || '-', row.subTipo || '-', row.cargo || '-', row.categoria || '-', row.colegio || row.institucion || '-', row.registro, row.inicio, row.final, row.dias, row.permiso, row.cPermiso, row.tPermiso, row.n_dias_rem || '-', row.pendientes_rem || '-', row.subsidio || '-', row.exp_dias_rem || '-'
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet([columnas, ...filas]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte_Remuneracion");
      XLSX.writeFile(workbook, "Reporte_Remuneracion.xlsx");
    } catch (error) {
      alert("Error al exportar a Excel: " + error.message);
      console.error(error);
    }
  };

  const SortIcon = () => (
    <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />} className="sort-icon" />
  );

  return (
    <div className="data-table-container">
      
      {/* HEADER */}
      <div className="page-header">
        <h1>Consultas Remuneración</h1>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* NUEVO BOTÓN FLOTANTE DE FILTROS */}
          <div className="filter-wrapper">
            <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)}>
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />} />
              Filtros
            </button>
            
            {showFilters && (
              <div className="filter-popover">
                <div className="popover-header">
                  <h3>Filtros Avanzados</h3>
                  <button className="btn-close" onClick={() => setShowFilters(false)}>✕</button>
                </div>
                
                <div className="popover-body">
                  <div className="filter-section">
                    <h4>FILTRO POR DATOS</h4>
                    <div className="filter-row">
                      <input type="text" placeholder="Ingrese dato..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                  </div>

                  <div className="filter-section">
                    <h4>RANGO DE FECHAS</h4>
                    <div className="filter-row">
                      <label>INICIO:</label>
                      <DatePicker 
                        selected={startDate} 
                        onChange={(date) => setStartDate(date)} 
                        selectsStart 
                        startDate={startDate} 
                        endDate={endDate} 
                        placeholderText="dd / mm / aaaa"
                        className="custom-datepicker-input"
                        wrapperClassName="custom-datepicker-wrapper"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                        showIcon
                        locale={es}
                      />
                    </div>
                    <div className="filter-row" style={{ marginTop: '8px' }}>
                      <label>FIN:</label>
                      <DatePicker 
                        selected={endDate} 
                        onChange={(date) => setEndDate(date)} 
                        selectsEnd 
                        startDate={startDate} 
                        endDate={endDate} 
                        minDate={startDate}
                        placeholderText="dd / mm / aaaa"
                        className="custom-datepicker-input"
                        wrapperClassName="custom-datepicker-wrapper"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                        showIcon
                        locale={es}
                      />
                    </div>
                  </div>

                  <div className="filter-section">
                    <h4>FILTRO DE LETRAS</h4>
                    <div className="filter-row">
                      <input type="text" maxLength="1" className="input-mini" placeholder="A" value={filterLetra} onChange={(e) => setFilterLetra(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="popover-footer">
                  <button className="btn-reset" onClick={limpiarFiltros}>Limpiar</button>
                  <button className="btn-primary" onClick={() => setShowFilters(false)}>Aplicar Filtros</button>
                </div>
              </div>
            )}
          </div>

          <button className="btn-excel" onClick={exportarExcel}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />} />
            Exportar Excel
          </button>

          <button className="btn-print" onClick={generarPDF}>
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />} />
            Imprimir PDF
          </button>
        </div>
      </div>

      <div className="data-table-card">
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
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

        {/* TABLA CON SCROLL */}
        <div className="table-responsive">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Expediente <SortIcon /></th>
                <th>Trabajador <SortIcon /></th>
                <th>DNI <SortIcon /></th>
                <th>Paterno <SortIcon /></th>
                <th>Materno <SortIcon /></th>
                <th>Nombres <SortIcon /></th>
                <th>Tipo Trab. <SortIcon /></th>
                <th>Sub Tipo <SortIcon /></th>
                <th>Cargo <SortIcon /></th>
                <th>Categoria <SortIcon /></th>
                <th>Institucion <SortIcon /></th>
                <th>Registro <SortIcon /></th>
                <th>Inicio <SortIcon /></th>
                <th>Fin <SortIcon /></th>
                <th>Total <SortIcon /></th>
                <th>Permiso <SortIcon /></th>
                <th>Cod Per. <SortIcon /></th>
                <th>Tipo Per. <SortIcon /></th>
                <th>Dias <SortIcon /></th>
                <th>Pendientes <SortIcon /></th>
                <th>Subsidio <SortIcon /></th>
                <th>Exp-dias <SortIcon /></th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
               <tr>
                  <td colSpan="22" style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="22" style={{ textAlign: 'center', padding: '20px', color: '#f87171' }}>{error}</td>
                </tr>
              )}
              {!cargando && !error && currentItems.map((row, index) => (
                <tr key={index}>
                  <td className="font-semibold text-purple">{row.expediente || row.codigo}</td>
                  <td>{row.trabajador || '-'}</td>
                  <td className="font-semibold">{row.dni}</td>
                  <td>{row.apePat}</td>
                  <td>{row.apeMat}</td>
                  <td>{row.nombres}</td>
                  <td>{row.tipoTrabajador || '-'}</td>
                  <td>{row.subTipo || '-'}</td>
                  <td>{row.cargo || '-'}</td>
                  <td>{row.categoria || '-'}</td>
                  <td className="text-muted">{row.colegio || row.institucion || '-'}</td>
                  <td>{row.registro}</td>
                  <td>{row.inicio}</td>
                  <td>{row.final}</td>
                  <td className="font-semibold" style={{ textAlign: 'center' }}>{row.dias}</td>
                  <td>{row.permiso}</td>
                  <td className="text-muted">{row.cPermiso}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: row.tipo_goce === 'CON_GOCE' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: row.tipo_goce === 'CON_GOCE' ? '#4ade80' : '#f87171'
                    }}>
                      {row.tPermiso}
                    </span>
                  </td>
                  <td>{row.n_dias_rem || '-'}</td>
                  <td>{row.pendientes_rem || '-'}</td>
                  <td>{row.subsidio || '-'}</td>
                  <td>{row.exp_dias_rem || '-'}</td>
                </tr>
              ))}
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
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} registros
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
