import React, { useState } from 'react';
import Icon from '../../components/Icon';

export default function ManageTeam() {
  const [teamData, setTeamData] = useState([]);
  return (
    <>
      <div className="page-header">
        <h1>Gestionar Equipo</h1>
        <div className="breadcrumb">
          Inicio <span className="separator">{'>'}</span> <strong>Gestionar Equipo</strong>
        </div>
      </div>

      <div className="data-card">
        <div className="data-toolbar">
          <div className="data-search">
            <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />} />
            <input type="text" placeholder="Buscar por id, nombre o correo..." />
          </div>
          
          <div className="toolbar-actions">
            <button className="btn-filter">
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />} />
              Filtrar
            </button>
            <button className="btn-primary-add">
              <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />} />
              Añadir Miembro
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID <span className="sort-icon">↕</span></th>
                <th>Nombre <span className="sort-icon">↕</span></th>
                <th>Correo <span className="sort-icon">↕</span></th>
                <th>Correo Verificado <span className="sort-icon">↕</span></th>
                <th>Rol <span className="sort-icon">↕</span></th>
                <th>Fecha de Ingreso <span className="sort-icon">↕</span></th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((user, index) => (
                <tr key={index}>
                  <td className="text-muted">{user.id}</td>
                  <td className="font-semibold">{user.name}</td>
                  <td className="text-muted">{user.email}</td>
                  <td><span className="badge-verified">Verificado</span></td>
                  <td className="text-muted">{user.role}</td>
                  <td className="text-muted">{user.date}</td>
                  <td>
                    <button className="btn-action">
                      <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}