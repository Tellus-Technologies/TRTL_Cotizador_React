import {
  ChevronDown,
  Filter,
  Plus,
} from "lucide-react";

import {
  clientSummary,
  dashboardTickets,
  statusSummary,
  teamStatus,
} from "../data/ticketsData";

import "../styles/tickets.css";

function TicketsDashboardPage() {
  function getTicketTypeClass(type) {
    return type === "Actividad"
      ? "dashboard-type-activity"
      : "dashboard-type-ticket";
  }

  function getTicketStatusClass(status) {
    return status === "Atrasado"
      ? "dashboard-status-delayed"
      : "dashboard-status-warning";
  }

  return (
    <section className="tickets-dashboard-page">
      <header className="tickets-dashboard-header">
        <div>
          <h1>Resumen de Gestión de Tickets</h1>

          <div className="dashboard-filters">
            <label>
              <span>Proyecto</span>

              <select defaultValue="Todos">
                <option>Todos</option>
                <option>Implementación SAP</option>
                <option>Soporte SAP</option>
              </select>
            </label>

            <label>
              <span>Estado</span>

              <select defaultValue="Todos">
                <option>Todos</option>
                <option>Abierto</option>
                <option>En progreso</option>
                <option>Resuelto</option>
              </select>
            </label>

            <label>
              <span>Responsable</span>

              <select defaultValue="Todos">
                <option>Todos</option>
                <option>Alejandra Bravo</option>
                <option>Mauricio Contreras</option>
                <option>Luis Murguía</option>
                <option>Carlos Ruiz</option>
              </select>
            </label>

            <label>
              <span>Vencimiento</span>

              <select defaultValue="Todos">
                <option>Todos</option>
                <option>Vencidos</option>
                <option>Por vencer</option>
                <option>En tiempo</option>
              </select>
            </label>
          </div>
        </div>

        <button type="button" className="dashboard-new-button">
          <Plus size={16} strokeWidth={2} />
          <span>Nuevo</span>
          <ChevronDown size={15} strokeWidth={2} />
        </button>
      </header>

      <section className="dashboard-section dashboard-team-section">
        <h2>Estado del Equipo</h2>

        <div className="dashboard-team-grid">
          {teamStatus.map((member) => (
            <article className="dashboard-team-card" key={member.id}>
              <div className="dashboard-member-header">
                <div className="dashboard-member-profile">
                  <div className="dashboard-member-avatar">
                    {member.initials}
                  </div>

                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                </div>

                <div className="dashboard-workload">
                  <strong>{member.workload}%</strong>
                  <span>Carga actual</span>
                </div>
              </div>

              <div
                className={`dashboard-member-status ${member.statusType}`}
              >
                <span></span>
                {member.status}
              </div>

              <div className="dashboard-progress">
                <span
                  style={{
                    width: `${member.workload}%`,
                    backgroundColor: member.progressColor,
                  }}
                ></span>
              </div>

              <p className="dashboard-member-summary">
                <b>{member.tickets}</b> tickets
                <span>•</span>

                {member.delayed > 0 ? (
                  <em>{member.delayed} atrasados</em>
                ) : (
                  <em className="is-current">Al día</em>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="dashboard-summary-grid">
        <section className="dashboard-section dashboard-status-section">
          <div className="dashboard-section-heading">
            <h2>Resumen por Estado</h2>
            <span>198 tickets totales</span>
          </div>

          <div className="dashboard-status-content">
            <div className="dashboard-donut">
              <div className="dashboard-donut-center">
                <strong>198</strong>
                <span>Tickets totales</span>
              </div>
            </div>

            <div className="dashboard-status-legend">
              {statusSummary.map((status) => (
                <div className="dashboard-legend-row" key={status.id}>
                  <span
                    className="dashboard-legend-color"
                    style={{ backgroundColor: status.color }}
                  ></span>

                  <span className="dashboard-legend-label">
                    {status.label}
                  </span>

                  <strong>{status.value}</strong>
                  <small>{status.percentage}%</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-section dashboard-client-section">
          <div className="dashboard-section-heading">
            <h2>Resumen por Cliente</h2>
          </div>

          <div className="dashboard-client-list">
            {clientSummary.map((client) => (
              <article className="dashboard-client-row" key={client.id}>
                <div className="dashboard-client-information">
                  <strong>{client.client}</strong>

                  <div>
                    <span>{client.tickets} tickets</span>
                    <em>{client.delayed} atrasados</em>
                  </div>
                </div>

                <div className="dashboard-client-progress">
                  <span
                    style={{
                      width: `${client.percentage}%`,
                      backgroundColor: client.color,
                    }}
                  >
                    <b style={{ backgroundColor: client.color }}></b>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-section dashboard-list-section">
        <div className="dashboard-list-heading">
          <div>
            <h2>Listado de Tickets / Actividades</h2>
            <p>Elementos críticos que requieren atención</p>
          </div>
        </div>

        <div className="dashboard-table-filters">
          <label>
            Tipo:
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>Ticket</option>
              <option>Actividad</option>
            </select>
          </label>

          <label>
            Estatus:
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>Atrasado</option>
              <option>Por vencer</option>
            </select>
          </label>

          <label>
            Prioridad:
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>Alta</option>
              <option>Media</option>
            </select>
          </label>

          <label>
            Cliente:
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>Vitafoods</option>
              <option>TechNova</option>
            </select>
          </label>

          <button type="button" className="dashboard-filter-button">
            <Filter size={14} strokeWidth={2} />
            Filtrar
          </button>
        </div>

        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Elemento</th>
                <th>Tipo</th>
                <th>Responsable</th>
                <th>Cliente</th>
                <th>Prioridad</th>
                <th>Estatus</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Días</th>
                <th>T. respuesta</th>
              </tr>
            </thead>

            <tbody>
              {dashboardTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>

                  <td>
                    <div className="dashboard-element-cell">
                      <strong>{ticket.code}</strong>
                      <span>{ticket.subject}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`dashboard-type-badge ${getTicketTypeClass(
                        ticket.type
                      )}`}
                    >
                      {ticket.type}
                    </span>
                  </td>

                  <td>{ticket.responsible}</td>
                  <td>{ticket.client}</td>

                  <td>
                    <div className="dashboard-priority">
                      <span
                        className={
                          ticket.priority === "Alta"
                            ? "is-high"
                            : "is-medium"
                        }
                      ></span>

                      {ticket.priority}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`dashboard-ticket-status ${getTicketStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td>{ticket.start}</td>
                  <td>{ticket.end}</td>

                  <td
                    className={
                      ticket.days < 0
                        ? "dashboard-negative-days"
                        : "dashboard-positive-days"
                    }
                  >
                    {ticket.days > 0 ? `+${ticket.days}` : ticket.days}
                  </td>

                  <td className="dashboard-response-time">
                    {ticket.responseTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="dashboard-table-footer">
          <span>
            Mostrando 6 de 15 elementos
          </span>

          <div className="dashboard-pagination">
            <button type="button">Anterior</button>
            <button type="button" className="is-active">1</button>
            <button type="button">2</button>
            <button type="button">Siguiente</button>
          </div>
        </footer>
      </section>
    </section>
  );
}

export default TicketsDashboardPage;