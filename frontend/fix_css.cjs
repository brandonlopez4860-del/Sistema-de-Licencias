const fs = require('fs');
const file = 'c:/Users/brand/Documents/Proyectos/Sistema/frontend/src/pages/system/EscalafonConsultas.css';
let content = fs.readFileSync(file, 'utf8');
content = content.split('/* ================= BOT')[0].trim() + '\n\n';
const css = `/* ================= BOTÓN Y POPOVER DE FILTROS ================= */
.filter-wrapper { position: relative; }
.btn-secondary { display: flex; align-items: center; gap: 8px; background-color: transparent; color: var(--text-main, #e4e4e7); border: 1px solid var(--border-light, #3f3f46); padding: 10px 16px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background-color: var(--bg-hover, #27272a); border-color: var(--border-light, #52525b); }
.btn-secondary .panel-icon { width: 18px; height: 18px; }
.filter-popover { position: absolute; top: calc(100% + 8px); right: 0; width: 400px; background-color: var(--card-bg, #18181b); border: 1px solid var(--border-light, #3f3f46); border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); z-index: 100; display: flex; flex-direction: column; }
.popover-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border-light, #27272a); }
.popover-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-main, #fff); }
.btn-close { background: none; border: none; color: var(--text-muted, #a1a1aa); font-size: 1.2rem; cursor: pointer; }
.btn-close:hover { color: var(--text-main, #fff); }
.popover-body { padding: 16px; display: flex; flex-direction: column; gap: 20px; }
.filter-section h4 { margin: 0 0 10px 0; font-size: 0.8rem; font-weight: 700; color: var(--text-main, #a5a3ff); text-transform: uppercase; letter-spacing: 0.5px; }
.filter-row { display: flex; align-items: center; gap: 8px; }
.filter-row label { font-size: 0.8rem; color: var(--text-main, #e4e4e7); font-weight: 600; }
.filter-row input { background-color: var(--bg-hover, #27272a); border: 1px solid var(--border-light, #3f3f46); border-radius: 6px; padding: 8px 10px; color: var(--text-main, #fff); font-size: 0.85rem; outline: none; flex: 1; }
.filter-row input:focus { border-color: var(--primary-purple, #5c59e8); }
.filter-row input[type="date"]::-webkit-calendar-picker-indicator { filter: var(--icon-invert, invert(1)); cursor: pointer; }
.input-mini { max-width: 60px; text-align: center; }
.btn-action { background-color: var(--border-light, #3f3f46); color: var(--text-main, #e4e4e7); border: 1px solid var(--border-light, #52525b); border-radius: 6px; padding: 8px 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-action:hover { background-color: var(--primary-hover, #52525b); color: #fff; }
.popover-footer { display: flex; justify-content: space-between; padding: 16px; border-top: 1px solid var(--border-light, #27272a); background-color: var(--bg-hover, #27272a); border-radius: 0 0 12px 12px; }
.btn-reset { background-color: transparent; color: var(--text-main, #e4e4e7); border: 1px solid var(--border-light, #52525b); padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-reset:hover { background-color: var(--border-light, #3f3f46); }
.btn-primary { background-color: var(--primary-purple, #5c59e8); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background-color: var(--primary-hover, #4a47b8); }
`;
fs.writeFileSync(file, content + css, 'utf8');
console.log('Fixed CSS');
