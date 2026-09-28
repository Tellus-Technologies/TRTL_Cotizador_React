import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Paperclip,
  X,
} from "lucide-react";

import { ticketAssignees } from "../data/ticketsData";

function SupportRequestModal({
  isOpen,
  ticket,
  onClose,
  onSubmit,
}) {
  const [supportAssigneeId, setSupportAssigneeId] = useState("");
  const [supportType, setSupportType] = useState("");
  const [supportLevel, setSupportLevel] = useState("");
  const [reason, setReason] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [requiredTime, setRequiredTime] = useState("");
  const [blocksTicket, setBlocksTicket] = useState(true);
  const [notify, setNotify] = useState(true);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSupportAssigneeId("");
      setSupportType("");
      setSupportLevel("");
      setReason("");
      setExpectedResult("");
      setRequiredDate("");
      setRequiredTime("");
      setBlocksTicket(true);
      setNotify(true);
      setFileName("");
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) {
    return null;
  }

  const selectedAssignee = ticketAssignees.find(
    (assignee) => String(assignee.id) === supportAssigneeId
  );

  const formIsValid =
    supportAssigneeId &&
    supportType &&
    supportLevel &&
    reason.trim() &&
    expectedResult.trim() &&
    requiredDate &&
    requiredTime;

  function handleSubmit(event) {
    event.preventDefault();

    if (!formIsValid || !selectedAssignee) {
      return;
    }

    onSubmit({
      id: `APO-${Date.now()}`,
      ticketId: ticket.id,
      ticketFolio: ticket.folio,
      assigneeId: selectedAssignee.id,
      assigneeName: selectedAssignee.name,
      assigneeRole: selectedAssignee.role,
      supportType,
      supportLevel,
      reason: reason.trim(),
      expectedResult: expectedResult.trim(),
      requiredDate,
      requiredTime,
      blocksTicket,
      notify,
      fileName,
      status: "En curso",
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
        className="support-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-request-title"
      >
        <header className="support-modal-header">
          <div>
            <h2 id="support-request-title">
              Solicitar apoyo
            </h2>

            <p>
              Crea una dependencia vinculada al ticket
            </p>
          </div>

          <button
            type="button"
            className="support-modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </header>

        <div className="support-ticket-reference">
          <strong>
            {ticket.folio}: {ticket.description}
          </strong>
        </div>

        <form
          className="support-request-form"
          onSubmit={handleSubmit}
        >
          <div className="support-form-group">
            <label htmlFor="supportAssignee">
              Asignación del apoyo
              <span>*</span>
            </label>

            <select
              id="supportAssignee"
              value={supportAssigneeId}
              onChange={(event) =>
                setSupportAssigneeId(event.target.value)
              }
              required
            >
              <option value="">
                Selecciona a la persona responsable
              </option>

              {ticketAssignees.map((assignee) => (
                <option
                  key={assignee.id}
                  value={assignee.id}
                >
                  {assignee.name} — {assignee.role}
                </option>
              ))}
            </select>

            {selectedAssignee && (
              <div className="support-selected-person">
                <span className="support-person-avatar">
                  {selectedAssignee.initials}
                </span>

                <div>
                  <strong>{selectedAssignee.name}</strong>
                  <span>{selectedAssignee.role}</span>

                  <small>
                    {selectedAssignee.status} ·{" "}
                    {selectedAssignee.assignedTickets} tickets activos
                  </small>
                </div>
              </div>
            )}
          </div>

          <div className="support-form-group">
            <label htmlFor="supportType">
              Tipo de apoyo
              <span>*</span>
            </label>

            <select
              id="supportType"
              value={supportType}
              onChange={(event) =>
                setSupportType(event.target.value)
              }
              required
            >
              <option value="">Selecciona un tipo de apoyo</option>
              <option value="Análisis técnico">
                Análisis técnico
              </option>
              <option value="Configuración">
                Configuración
              </option>
              <option value="Desarrollo">
                Desarrollo
              </option>
              <option value="Pruebas">
                Pruebas
              </option>
              <option value="Validación funcional">
                Validación funcional
              </option>
            </select>
          </div>

          <div className="support-form-group">
            <label htmlFor="supportLevel">
              Nivel de soporte
              <span>*</span>
            </label>

            <select
              id="supportLevel"
              value={supportLevel}
              onChange={(event) =>
                setSupportLevel(event.target.value)
              }
              required
            >
              <option value="">
                Selecciona el nivel de soporte
              </option>
              <option value="L1 - Atención inicial">
                L1 - Atención inicial
              </option>
              <option value="L2 - Soporte especializado">
                L2 - Soporte especializado
              </option>
              <option value="L3 - Especialista">
                L3 - Especialista
              </option>
            </select>
          </div>

          <div className="support-form-section">
            <h3>Detalle de la solicitud</h3>

            <div className="support-form-group">
              <label htmlFor="supportReason">
                Motivo
                <span>*</span>
              </label>

              <textarea
                id="supportReason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Describe por qué se necesita el apoyo..."
                rows="3"
                required
              />
            </div>

            <div className="support-form-group">
              <label htmlFor="expectedResult">
                Resultado esperado
                <span>*</span>
              </label>

              <textarea
                id="expectedResult"
                value={expectedResult}
                onChange={(event) =>
                  setExpectedResult(event.target.value)
                }
                placeholder="Describe el resultado que se espera obtener..."
                rows="3"
                required
              />
            </div>

            <div className="support-required-grid">
              <div className="support-form-group">
                <label htmlFor="requiredDate">
                  Fecha requerida
                  <span>*</span>
                </label>

                <div className="support-input-with-icon">
                  <CalendarDays size={15} strokeWidth={1.8} />

                  <input
                    id="requiredDate"
                    type="date"
                    value={requiredDate}
                    onChange={(event) =>
                      setRequiredDate(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="support-form-group">
                <label htmlFor="requiredTime">
                  Hora
                  <span>*</span>
                </label>

                <div className="support-input-with-icon">
                  <Clock3 size={15} strokeWidth={1.8} />

                  <input
                    id="requiredTime"
                    type="time"
                    value={requiredTime}
                    onChange={(event) =>
                      setRequiredTime(event.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="support-blocking-option">
            <input
              type="checkbox"
              checked={blocksTicket}
              onChange={(event) =>
                setBlocksTicket(event.target.checked)
              }
            />

            <span className="support-switch"></span>

            <span>
              <strong>
                Este apoyo bloquea el avance del ticket
              </strong>

              <small>
                El ticket no podrá continuar hasta recibir el apoyo
                solicitado.
              </small>
            </span>
          </label>

          <label className="support-file-input">
            <Paperclip size={15} strokeWidth={1.8} />

            <span>
              {fileName || "Adjuntar archivo · Opcional"}
            </span>

            <input
              type="file"
              onChange={(event) =>
                setFileName(
                  event.target.files?.[0]?.name || ""
                )
              }
            />
          </label>

          <label className="support-notify-option">
            <input
              type="checkbox"
              checked={notify}
              onChange={(event) =>
                setNotify(event.target.checked)
              }
            />

            <span>
              Notificar al responsable del apoyo
            </span>
          </label>

          <footer className="support-modal-footer">
            <button
              type="button"
              className="support-cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="support-submit-button"
              disabled={!formIsValid}
            >
              Enviar solicitud
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default SupportRequestModal;