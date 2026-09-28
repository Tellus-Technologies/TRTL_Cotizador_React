import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Paperclip,
  X,
} from "lucide-react";

const ticketStatuses = [
  "Nuevo",
  "En atención",
  "En espera",
  "En revisión",
  "Resuelto",
  "Cerrado",
];

function ProgressModal({
  isOpen,
  ticket,
  currentStatus,
  currentProgress,
  onClose,
  onSubmit,
}) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [progress, setProgress] = useState(currentProgress);
  const [comment, setComment] = useState("");
  const [waitingReason, setWaitingReason] = useState("");
  const [dependency, setDependency] = useState("");
  const [resumeDate, setResumeDate] = useState("");
  const [resumeTime, setResumeTime] = useState("");
  const [visibility, setVisibility] = useState("team");
  const [fileName, setFileName] = useState("");
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setNewStatus(currentStatus);
      setProgress(currentProgress);
      setComment("");
      setWaitingReason("");
      setDependency("");
      setResumeDate("");
      setResumeTime("");
      setVisibility("team");
      setFileName("");
      setNotify(true);
    }
  }, [isOpen, currentStatus, currentProgress, ticket]);

  if (!isOpen || !ticket) {
    return null;
  }

  const requiresWaitingInformation = newStatus === "En espera";

  const formIsValid =
    newStatus &&
    comment.trim() &&
    (!requiresWaitingInformation || waitingReason.trim());

  function handleSubmit(event) {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    onSubmit({
      ticketId: ticket.id,
      previousStatus: currentStatus,
      status: newStatus,
      progress: Number(progress),
      comment: comment.trim(),
      waitingReason: waitingReason.trim(),
      dependency,
      resumeDate,
      resumeTime,
      visibility,
      fileName,
      notify,
      updatedAt: new Date().toISOString(),
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
        className="progress-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-modal-title"
      >
        <header className="progress-modal-header">
          <div>
            <h2 id="progress-modal-title">
              Actualizar avance
            </h2>

            <p>
              Registra el avance y la situación actual del ticket
            </p>
          </div>

          <button
            type="button"
            className="progress-modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </header>

        <div className="progress-ticket-reference">
          <strong>
            {ticket.folio}: {ticket.description}
          </strong>
        </div>

        <form
          className="progress-modal-form"
          onSubmit={handleSubmit}
        >
          <section className="progress-form-section">
            <h3>Cambio de estado</h3>

            <div className="progress-status-grid">
              <div className="progress-status-field">
                <span>Estado actual</span>

                <strong className="progress-current-status">
                  {currentStatus}
                </strong>
              </div>

              <span className="progress-status-arrow">
                →
              </span>

              <label className="progress-status-field">
                <span>
                  Nuevo estado
                  <b>*</b>
                </span>

                <select
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(event.target.value)
                  }
                  required
                >
                  {ticketStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="progress-percentage-heading">
              <span>Avance reportado</span>
              <strong>{progress}%</strong>
            </div>

            <input
              className="progress-range"
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(event) =>
                setProgress(event.target.value)
              }
              style={{
                "--progress-value": `${progress}%`,
              }}
              aria-label="Porcentaje de avance"
            />

            <small className="progress-range-help">
              Indica el progreso real del ticket.
            </small>
          </section>

          <section className="progress-form-section">
            <h3>Información de la actualización</h3>

            <label className="progress-form-group">
              <span>
                Comentario de avance
                <b>*</b>
              </span>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Describe el avance realizado, resultados o situación actual..."
                rows="3"
                required
              />
            </label>

            {requiresWaitingInformation && (
              <label className="progress-form-group">
                <span>
                  Motivo de espera
                  <b>*</b>
                </span>

                <select
                  value={waitingReason}
                  onChange={(event) =>
                    setWaitingReason(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Selecciona el motivo de espera
                  </option>

                  <option value="Dependencia pendiente">
                    Dependencia pendiente
                  </option>

                  <option value="Información del cliente">
                    Información pendiente del cliente
                  </option>

                  <option value="Validación funcional">
                    Validación funcional pendiente
                  </option>

                  <option value="Acceso o permisos">
                    Acceso o permisos pendientes
                  </option>

                  <option value="Disponibilidad del sistema">
                    Disponibilidad del sistema
                  </option>

                  <option value="Otro">
                    Otro
                  </option>
                </select>
              </label>
            )}

            <label className="progress-form-group">
              <span>
                Dependencia relacionada
                <small>Opcional</small>
              </span>

              <select
                value={dependency}
                onChange={(event) =>
                  setDependency(event.target.value)
                }
              >
                <option value="">
                  Selecciona una dependencia
                </option>

                <option value="APO-024">
                  APO-024 · Validar permisos de autenticación
                </option>
              </select>

              {dependency && (
                <div className="progress-dependency-selected">
                  <span>{dependency}</span>

                  <strong>
                    Validar permisos de autenticación
                  </strong>

                  <em>Bloqueante</em>
                </div>
              )}
            </label>

            <div className="progress-resume-grid">
              <label className="progress-form-group">
                <span>
                  Reanudación estimada
                  <small>Opcional</small>
                </span>

                <div className="progress-input-icon">
                  <CalendarDays size={15} strokeWidth={1.8} />

                  <input
                    type="date"
                    value={resumeDate}
                    onChange={(event) =>
                      setResumeDate(event.target.value)
                    }
                  />
                </div>
              </label>

              <label className="progress-form-group">
                <span>
                  Hora
                  <small>Opcional</small>
                </span>

                <div className="progress-input-icon">
                  <Clock3 size={15} strokeWidth={1.8} />

                  <input
                    type="time"
                    value={resumeTime}
                    onChange={(event) =>
                      setResumeTime(event.target.value)
                    }
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="progress-form-section">
            <h3>Comunicación</h3>

            <div className="progress-visibility-label">
              Visibilidad del comentario
            </div>

            <div className="progress-visibility-options">
              <button
                type="button"
                className={
                  visibility === "team" ? "is-active" : ""
                }
                onClick={() => setVisibility("team")}
              >
                Solo equipo
              </button>

              <button
                type="button"
                className={
                  visibility === "client" ? "is-active" : ""
                }
                onClick={() => setVisibility("client")}
              >
                Cliente y equipo
              </button>
            </div>

            <label className="progress-file-input">
              <Paperclip size={15} strokeWidth={1.8} />

              <span>
                {fileName || "Adjuntar evidencia · Opcional"}
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

            <label className="progress-notify-option">
              <input
                type="checkbox"
                checked={notify}
                onChange={(event) =>
                  setNotify(event.target.checked)
                }
              />

              <span>
                Notificar al responsable y participantes
              </span>
            </label>

            <div className="progress-information-message">
              El cambio se registrará en la actividad reciente y
              en el historial del ticket.
            </div>
          </section>

          <footer className="progress-modal-footer">
            <button
              type="button"
              className="progress-cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="progress-submit-button"
              disabled={!formIsValid}
            >
              Actualizar estado
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default ProgressModal;