import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

// Colores para el Anillo (Sustentos) - Paleta Pastel Actualizada
const SUSTENTO_COLORS = {
  'CITT': '#93a5ff', // Azul pastel
  'Particular': '#d8b4fe', // Morado pastel
  'Ninguno': '#a5b4fc', // Lavanda pastel
  'default': '#cbd5e1'
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Anual');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const [dataLine, setDataLine] = useState([]);
  const [dataPago, setDataPago] = useState([]);
  const [dataSustento, setDataSustento] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalInstituciones: 0,
    totalTrabajadores: 0,
    totalEscalafon: 0,
    totalRemuneraciones: 0,
  });
  const [chartStats, setChartStats] = useState({ escalafon: 0, remuneracion: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:3006/api/dashboard/stats?period=${selectedPeriod}&month=${selectedMonth}`);
      const result = await response.json();
      
      if (result.success) {
        setDataLine(result.dataLine);
        setDataPago(result.dataPago);
        setAvailableYears(result.availableYears || []);
        if (result.data) {
          setDashboardStats({
            totalInstituciones: result.data.totalInstituciones || 0,
            totalTrabajadores: result.data.totalTrabajadores || 0,
            totalEscalafon: result.data.totalEscalafon || 0,
            totalRemuneraciones: result.data.totalRemuneraciones || 0
          });
        }
        if (result.chartStats) {
          setChartStats(result.chartStats);
        }
        if (result.targetYear && (selectedPeriod === 'Anual' || !selectedPeriod)) {
            setSelectedPeriod(result.targetYear);
        }
        
        // Mapear colores para el anillo
        const formattedSustento = result.dataSustento.map(item => {
          let name = item.name;
          if (name === 'CITT') name = 'CITT';
          else if (name !== 'Ninguno') name = 'Particular'; // asume que cualquier otro es particular

          return {
            ...item,
            name,
            color: SUSTENTO_COLORS[name] || SUSTENTO_COLORS['default']
          };
        });
        
        setDataSustento(formattedSustento);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, selectedMonth]);

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period);
    setSelectedMonth('Todos'); // Reiniciar mes al cambiar año
  };

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
  };

  const monthNames = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Ene', value: '1' }, { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' },
    { label: 'Abr', value: '4' }, { label: 'May', value: '5' }, { label: 'Jun', value: '6' },
    { label: 'Jul', value: '7' }, { label: 'Ago', value: '8' }, { label: 'Sep', value: '9' },
    { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dic', value: '12' }
  ];

  // Datos para el gráfico pastel
  const totalPie = dashboardStats.totalInstituciones + dashboardStats.totalTrabajadores;
  const dataPie = [
    { name: 'Instituciones', value: dashboardStats.totalInstituciones, color: '#93a5ff' },
    { name: 'Trabajadores', value: dashboardStats.totalTrabajadores, color: '#d8b4fe' }
  ];

  return (
    <div className="dashboard-blank-container">
      
      {/* ================= TÍTULO DE LA PÁGINA ================= */}
      <div className="page-header">
        <h1>DASHBOARD</h1>
      </div>

      {/* ================= TARJETAS DE RESUMEN ================= */}
      <div className="summary-cards-grid">
        <div className="summary-card">
          <div className="summary-icon icon-instituciones">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 9h6m-6 2.25h6m-6 2.25h6M9 15h6" />} />
          </div>
          <h2>{dashboardStats.totalInstituciones}</h2>
          <div className="summary-footer">
            <span>Total Instituciones</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon icon-trabajadores">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />} />
          </div>
          <h2>{dashboardStats.totalTrabajadores}</h2>
          <div className="summary-footer">
            <span>Total Trabajadores</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon icon-escalafon">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />} />
          </div>
          <h2>{dashboardStats.totalEscalafon}</h2>
          <div className="summary-footer">
            <span>Total Escalafón</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon icon-remuneracion">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
          </div>
          <h2>{dashboardStats.totalRemuneraciones}</h2>
          <div className="summary-footer">
            <span>Total Remuneración</span>
          </div>
        </div>
      </div>

      {/* ================= ÁREA DE CONTENIDO (GRÁFICO) ================= */}
      <div className="empty-content-area">
        
        <div className="chart-card">
          {/* Header del Gráfico */}
          <div className="chart-header">
            <div className="chart-metrics-wrapper">
              {/* Métrica 1 (Línea Azul) */}
              <div className="metric-box">
                <div className="metric-label">
                  <span className="dot dot-blue"></span>
                  Registro Escalafón
                </div>
                <div className="metric-values">
                  <h2>{chartStats.escalafon}</h2>
                  <span className="trend positive">Total de registros</span>
                </div>
              </div>

              {/* Métrica 2 (Línea Morada) */}
              <div className="metric-box">
                <div className="metric-label">
                  <span className="dot dot-purple"></span>
                  Registro Remuneración
                </div>
                <div className="metric-values">
                  <h2>{chartStats.remuneracion}</h2>
                  <span className="trend positive">Total de registros</span>
                </div>
              </div>
            </div>

            {/* Selector de periodo (Custom Dropdown) */}
            <div className="chart-actions" style={{ display: 'flex', gap: '10px' }}>
              <div className="custom-period-dropdown">
                <button 
                  className="period-btn" 
                  onClick={() => { setIsPeriodOpen(!isPeriodOpen); setIsMonthOpen(false); }}
                >
                  {selectedPeriod}
                  <Icon 
                    className="chevron-icon" 
                    path={isPeriodOpen 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />} 
                  />
                </button>
                
                {isPeriodOpen && (
                  <div className="period-menu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {availableYears.map(year => (
                      <div 
                        key={year}
                        className={`period-option ${selectedPeriod === year ? 'selected' : ''}`}
                        onClick={() => handleSelectPeriod(year)}
                      >
                        {year}
                        {selectedPeriod === year && <Icon className="check-icon" path={<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selector de MESES */}
              <div className="custom-period-dropdown">
                <button 
                  className="period-btn" 
                  onClick={() => { setIsMonthOpen(!isMonthOpen); setIsPeriodOpen(false); }}
                >
                  {monthNames.find(m => m.value === selectedMonth)?.label || 'Mes'}
                  <Icon 
                    className="chevron-icon" 
                    path={isMonthOpen 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />} 
                  />
                </button>
                
                {isMonthOpen && (
                  <div className="period-menu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {monthNames.map(m => (
                      <div 
                        key={m.value}
                        className={`period-option ${selectedMonth === m.value ? 'selected' : ''}`}
                        onClick={() => handleSelectMonth(m.value)}
                      >
                        {m.label}
                        {selectedMonth === m.value && <Icon className="check-icon" path={<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* El Gráfico de Áreas usando Recharts */}
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dataLine} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMedicas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPersonales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                {/* Cuadrícula horizontal tenue */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-input, #e4e4e7)" />
                
                {/* Ejes */}
                <XAxis dataKey="name" stroke="var(--text-muted, #71717a)" tick={{fill: 'var(--text-muted, #71717a)', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--text-muted, #71717a)" tick={{fill: 'var(--text-muted, #71717a)', fontSize: 12}} axisLine={false} tickLine={false} />
                
                {/* Tooltip (Ventana al pasar el mouse) */}
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card, #fff)', borderColor: 'var(--border-light, #e4e4e7)', borderRadius: '8px', color: 'var(--text-main, #18181b)' }}
                  itemStyle={{ color: 'var(--text-main, #18181b)' }}
                />
                
                {/* Línea 1: Escalafon (Morado claro) */}
                <Area type="monotone" dataKey="escalafon" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorPersonales)" activeDot={{ r: 6, fill: "#c084fc", stroke: "var(--bg-card, #fff)", strokeWidth: 2 }} />
                
                {/* Línea 2: Remuneracion (Azul/Índigo) */}
                <Area type="monotone" dataKey="remuneracion" stroke="#4338ca" strokeWidth={2} fillOpacity={1} fill="url(#colorMedicas)" activeDot={{ r: 6, fill: "#4338ca", stroke: "var(--bg-card, #fff)", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NUEVA GRILLA PARA LOS GRÁFICOS INFERIORES */}
        <div className="secondary-charts-grid">
          
          {/* Gráfico 2: Barras Apiladas (Con Goce vs Sin Goce) */}
          <div className="chart-card">
            <div className="chart-header minimal">
              <h3>Evolución: Con Goce vs. Sin Goce</h3>
              <button className="btn-icon-only">...</button>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataPago} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-input, #e4e4e7)" />
                  <XAxis dataKey="name" stroke="var(--text-muted, #71717a)" tick={{fill: 'var(--text-muted, #71717a)', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted, #71717a)" tick={{fill: 'var(--text-muted, #71717a)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip cursor={{fill: 'var(--bg-hover, #27272a)'}} contentStyle={{ backgroundColor: 'var(--bg-card, #fff)', borderColor: 'var(--border-light, #e4e4e7)', borderRadius: '8px', color: 'var(--text-main, #18181b)' }} itemStyle={{ color: 'var(--text-main, #18181b)' }} />
                  
                  {/* El secreto de las barras apiladas: usar el mismo stackId */}
                  <Bar dataKey="conGoce" name="Con Goce (Días)" stackId="a" fill="#3b82f6" barSize={16} /> {/* Base Azul */}
                  <Bar dataKey="sinGoce" name="Sin Goce (Días)" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} /> {/* Punta Naranja */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 3: Anillo (Instituciones y Trabajadores) - NUEVO DISEÑO */}
          <div className="chart-card">
            <div className="chart-header minimal">
              <h3>Distribución</h3>
              <button className="btn-icon-only">...</button>
            </div>
            
            <div className="donut-content">
              <div className="donut-chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={dataPie}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={6}
                      cornerRadius={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card, #fff)', borderColor: 'var(--border-light, #e4e4e7)', borderRadius: '8px', color: 'var(--text-main, #18181b)' }} itemStyle={{ color: 'var(--text-main, #18181b)' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Texto central del anillo */}
                <div className="donut-center-text">
                  <h4>{totalPie}</h4>
                  <span>Total</span>
                </div>
              </div>

              {/* NUEVA Leyenda Horizontal */}
              <div className="donut-legend-horizontal">
                {dataPie.map((item, index) => (
                  <div className="legend-item-horizontal" key={index}>
                    <span className="dot-square" style={{ backgroundColor: item.color }}></span>
                    <span className="legend-text-horizontal">
                      {item.name} {totalPie > 0 ? Math.round((item.value / totalPie) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
