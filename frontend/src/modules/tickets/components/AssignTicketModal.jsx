import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { ticketAssignees } from "../data/ticketsData";

function AssignTicketModal({
  isOpen,
  ticket,
  onClose,
  onAssign,
}) {
  const [search, setSearch] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);
  const [secondaryAssigneeId, setSecondaryAssigneeId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedAssigneeId(null);
      setSecondaryAssigneeId("");
      setInstructions("");
      setNotify(true);
    }
  }, [isOpen, ticket]);

  const filteredAssignees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return ticketAssignees;
    }

    return ticketAssignees.filter((assignee) => {
      return (
        assignee.name.toLowerCase().includes(normalizedSearch) ||
        assignee.role.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search]);

  if (!isOpen || !ticket) {
    return null;
  }

  const selectedAssignee = ticketAssignees.find(
    (assignee) => assignee.id === selectedAssigneeId
  );

  function getWorkloadClass(workload) {
    if (workload >= 75) {
      return "is-high";
    }

    if (workload >= 50) {
      return "is-medium";
    }

    return "is-low";
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedAssignee) {
      return;
    }

    onAssign({
      ticketId: ticket.id,
      responsible: selectedAssignee.name,
      responsibleId: selectedAssignee.id,
      secondaryAssigneeId,
      instructions: instructions.trim(),
      notify,
    });
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="ticket-modal-backdrop"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="assign-ticket-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-ticket-title"
      >
        <header className="assign-modal-header">
          <div>
            <h2 id="assign-ticket-title">Asignar ticket</h2>

            <p>
              <strong>{ticket.folio}</strong>
              <span>•</span>
              {ticket.description}
            </p>
          </div>

          <button
            type="button"
            className="assign-modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="assign-ticket-summary">
            <div>
              <span>Cliente</span>
              <strong>{ticket.client}</strong>
            </div>

            <div>
              <span>Proyecto</span>
              <strong>{ticket.project}</strong>
            </div>

            <div>
              <span>Prioridad</span>
              <strong
                className={`assign-priority assign-priority-${ticket.priority.toLowerCase()}`}
              >
                {ticket.priority}
              </strong>
            </div>

            <div>
              <span>Vencimiento</span>
              <strong>{ticket.dueDate}</strong>
            </div>
          </div>

          <div className="assign-modal-section">
            <h3>Selecciona un responsable</h3>

            <label className="assign-search">
              <Search size={15} strokeWidth={1.8} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar responsable por nombre o especialidad..."
                autoFocus
              />
            </label>

            <div className="assign-team-grid">
              {filteredAssignees.map((assignee) => {
                const isSelected =
                  selectedAssigneeId === assignee.id;

                return (
                  <button
                    type="button"
                    className={`assign-team-card ${
                      isSelected ? "is-selected" : ""
                    }`}
                    key={assignee.id}
                    onClick={() =>
                      setSelectedAssigneeId(assignee.id)
                    }
                  >
                    <div className="assign-team-card-header">
                      <div className="assign-team-profile">
                        <span className="assign-team-avatar">
                          {assignee.initials}
                        </span>

                        <div>
                          <strong>{assignee.name}</strong>
                          <small>{assignee.role}</small>
                        </div>
                      </div>

                      {assignee.recommended && (
                        <span className="assign-recommended">
                          Recomendado
                        </span>
                      )}
                    </div>

                    <div
                      className={`assign-member-status ${assignee.statusType}`}
                    >
                      <span></span>
                      {assignee.status}
                    </div>

                    <div className="assign-workload-track">
                      <span
                        className={getWorkloadClass(assignee.workload)}
                        style={{ width: `${assignee.workload}%` }}
                      ></span>
                    </div>

                    <div className="assign-workload-information">
                      <span>{assignee.workload}% de carga</span>
                      <span>
                        {assignee.assignedTickets} tickets asignados
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredAssignees.length === 0 && (
              <p className="assign-empty-result">
                No se encontraron colaboradores.
              </p>
            )}
          </div>

          <div className="assign-form-group">
            <label htmlFor="secondaryAssignee">
              Responsable secundario o de apoyo
              <span>Opcional</span>
            </label>

            <select
              id="secondaryAssignee"
              value={secondaryAssigneeId}
              onChange={(event) =>
                setSecondaryAssigneeId(event.target.value)
              }
            >
              <option value="">
                Selecciona un responsable secundario
              </option>

              {ticketAssignees
                .filter(
                  (assignee) => assignee.id !== selectedAssigneeId
                )
                .map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} — {assignee.role}
                  </option>
                ))}
            </select>
          </div>

          <div className="assign-form-group">
            <label htmlFor="assignmentInstructions">
              Indicaciones para el responsable
              <span>Opcional</span>
            </label>

            <textarea
              id="assignmentInstructions"
              value={instructions}
              onChange={(event) =>
                setInstructions(event.target.value.slice(0, 300))
              }
              placeholder="Agrega indicaciones o contexto adicional para quien resolverá este ticket..."
              rows="3"
            />

            <small className="assign-character-counter">
              {instructions.length}/300
            </small>
          </div>

          <label className="assign-notify-option">
            <input
              type="checkbox"
              checked={notify}
              onChange={(event) => setNotify(event.target.checked)}
            />

            <span>Notificar al responsable</span>
          </label>

          <footer className="assign-modal-footer">
            <button
              type="button"
              className="assign-cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="assign-confirm-button"
              disabled={!selectedAssignee}
            >
              Asignar ticket
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default AssignTicketModal;