import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import AssignTicketModal from "../components/AssignTicketModal";
import { ticketsList } from "../data/ticketsData";
import "../styles/tickets.css";
import { useNavigate } from "react-router-dom";


function TicketsPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState(ticketsList);
  const [ticketToAssign, setTicketToAssign] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [responsibleFilter, setResponsibleFilter] =
    useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todos");
  const [dueFilter, setDueFilter] = useState("Todos");

  const unassignedCount = tickets.filter(
    (ticket) => !ticket.responsible
  ).length;

  const clients = [
    ...new Set(tickets.map((ticket) => ticket.client)),
  ];

  const responsibles = [
    ...new Set(
      tickets
        .map((ticket) => ticket.responsible)
        .filter(Boolean)
    ),
  ];

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesTab =
        activeTab === "all" || !ticket.responsible;

      const matchesSearch =
        !normalizedSearch ||
        ticket.folio.toLowerCase().includes(normalizedSearch) ||
        ticket.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        ticket.client.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        ticket.status === statusFilter;

      const matchesClient =
        clientFilter === "Todos" ||
        ticket.client === clientFilter;

      const matchesResponsible =
        responsibleFilter === "Todos" ||
        ticket.responsible === responsibleFilter;

      const matchesPriority =
        priorityFilter === "Todos" ||
        ticket.priority === priorityFilter;

      /*
       * Por ahora las fechas son textos como "28 Ago".
       * Cuando conectemos Django se realizará aquí el
       * filtrado real por rango de vencimiento.
       */
      const matchesDueDate =
        dueFilter === "Todos" || Boolean(ticket.dueDate);

      return (
        matchesTab &&
        matchesSearch &&
        matchesStatus &&
        matchesClient &&
        matchesResponsible &&
        matchesPriority &&
        matchesDueDate
      );
    });
  }, [
    tickets,
    activeTab,
    search,
    statusFilter,
    clientFilter,
    responsibleFilter,
    priorityFilter,
    dueFilter,
  ]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
    setClientFilter("Todos");
    setResponsibleFilter("Todos");
    setPriorityFilter("Todos");
    setDueFilter("Todos");
  }

  function getPriorityClass(priority) {
    const classes = {
      Alta: "is-high",
      Media: "is-medium",
      Baja: "is-low",
    };

    return classes[priority] || "";
  }

  function getStatusClass(status) {
    const classes = {
      Nuevo: "is-new",
      "En proceso": "is-progress",
      "En revisión": "is-review",
      Resuelto: "is-resolved",
    };

    return classes[status] || "";
  }

  function handleCreateTicket() {
    console.log("Abrir formulario para crear ticket");
  }

  function handleAssignTicket(ticketId) {
    const selectedTicket = tickets.find(
      (ticket) => ticket.id === ticketId
    );

    setTicketToAssign(selectedTicket || null);
  }

  function handleConfirmAssignment(assignment) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === assignment.ticketId
          ? {
              ...ticket,
              responsible: assignment.responsible,
              status:
                ticket.status === "Nuevo"
                  ? "En proceso"
                  : ticket.status,
            }
          : ticket
      )
    );

    setTicketToAssign(null);
  }
function handleOpenTicket(ticketId) {
  navigate(`/tickets/${ticketId}`);
}

  return (
    <section className="tickets-list-page">
      <header className="tickets-list-header">
        <div className="tickets-list-title-row">
          <h1>Tickets</h1>

          <button
            type="button"
            className="tickets-create-button"
            onClick={handleCreateTicket}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Nuevo</span>
            <ChevronDown size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="tickets-main-filters">
          <label>
            <span>Estado</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Nuevo</option>
              <option>En proceso</option>
              <option>En revisión</option>
              <option>Resuelto</option>
            </select>
          </label>

          <label>
            <span>Cliente</span>

            <select
              value={clientFilter}
              onChange={(event) =>
                setClientFilter(event.target.value)
              }
            >
              <option>Todos</option>

              {clients.map((client) => (
                <option key={client}>{client}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Responsable</span>

            <select
              value={responsibleFilter}
              onChange={(event) =>
                setResponsibleFilter(event.target.value)
              }
            >
              <option>Todos</option>

              {responsibles.map((responsible) => (
                <option key={responsible}>
                  {responsible}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Prioridad</span>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>

          <label>
            <span>Vencimiento</span>

            <select
              value={dueFilter}
              onChange={(event) =>
                setDueFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Esta semana</option>
              <option>Próxima semana</option>
            </select>
          </label>

          <button
            type="button"
            className="tickets-more-filters"
          >
            <Filter size={14} strokeWidth={2} />
            Más filtros
          </button>

          <button
            type="button"
            className="tickets-clear-filters"
            onClick={clearFilters}
          >
            Limpiar
          </button>
        </div>
      </header>

      <section className="tickets-list-card">
        <div className="tickets-list-toolbar">
          <div className="tickets-tabs">
            <button
              type="button"
              className={
                activeTab === "all" ? "is-active" : ""
              }
              onClick={() => setActiveTab("all")}
            >
              Todos
              <span>{tickets.length}</span>
            </button>

            <button
              type="button"
              className={
                activeTab === "unassigned"
                  ? "is-active"
                  : ""
              }
              onClick={() => setActiveTab("unassigned")}
            >
              Sin asignar
              <span>{unassignedCount}</span>
            </button>
          </div>

          <label className="tickets-search">
            <Search size={15} strokeWidth={1.8} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por folio o asunto..."
            />
          </label>
        </div>

        <div className="tickets-list-table-container">
          <table className="tickets-list-table">
            <thead>
              <tr>
                <th className="tickets-checkbox-column">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los tickets"
                  />
                </th>

                <th>Ticket</th>
                <th>Descripción</th>
                <th>Cliente/Proyecto</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Vencimiento</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="tickets-checkbox-column">
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar ${ticket.folio}`}
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ticket-folio-button"
                      onClick={() =>
                        handleOpenTicket(ticket.id)
                      }
                    >
                      {ticket.folio}
                    </button>
                  </td>

                  <td className="ticket-description-cell">
                    {ticket.description}
                  </td>

                  <td>
                    <div className="ticket-client-cell">
                      <strong>{ticket.client}</strong>
                      <span>{ticket.project}</span>
                    </div>
                  </td>

                  <td>{ticket.type}</td>

                  <td>
                    <span
                      className={`tickets-priority-badge ${getPriorityClass(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`tickets-status-badge ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    {ticket.responsible ? (
                      <span className="ticket-responsible-name">
                        {ticket.responsible}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="ticket-assign-button"
                        onClick={() =>
                          handleAssignTicket(ticket.id)
                        }
                      >
                        Asignar
                      </button>
                    )}
                  </td>

                  <td>{ticket.dueDate}</td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="tickets-empty-state"
                  >
                    No se encontraron tickets con los filtros
                    seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="tickets-list-footer">
          <span>
            Mostrando {filteredTickets.length} de{" "}
            {tickets.length} tickets
          </span>

          <div className="tickets-pagination">
            <button type="button">Anterior</button>

            <button
              type="button"
              className="is-active"
            >
              1
            </button>

            <button type="button">2</button>
            <button type="button">Siguiente</button>
          </div>
        </footer>
      </section>

      <AssignTicketModal
        isOpen={Boolean(ticketToAssign)}
        ticket={ticketToAssign}
        onClose={() => setTicketToAssign(null)}
        onAssign={handleConfirmAssignment}
      />
    </section>
  );
}

export default TicketsPage;