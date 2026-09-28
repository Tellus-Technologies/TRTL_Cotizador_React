import { useEffect, useState } from "react";
import {
  ArrowRight,
  Info,
  X,
} from "lucide-react";

function ActivityStatusModal({
  open,
  activity,
  currentStatus,
  onClose,
  onSave,
}) {
  const [newStatus, setNewStatus] =
    useState(currentStatus || "Nueva");

  const [comment, setComment] = useState("");
  const [waitingReason, setWaitingReason] =
    useState("");

  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }

    setNewStatus(currentStatus || "Nueva");
    setComment("");
    setWaitingReason("");
    setNotify(true);
  }, [open, currentStatus]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanComment = comment.trim();
    const cleanWaitingReason = waitingReason.trim();

    if (!cleanComment) {
      return;
    }

    if (
      newStatus === "En espera" &&
      !cleanWaitingReason
    ) {
      return;
    }

    onSave({
      id: Date.now(),
      previousStatus: currentStatus,
      status: newStatus,
      comment: cleanComment,
      waitingReason:
        newStatus === "En espera"
          ? cleanWaitingReason
          : "",
      notify,
      createdAt: "Ahora",
    });
  }

  if (!open || !activity) {
    return null;
  }

  const formIsValid =
    comment.trim() &&
    (newStatus !== "En espera" ||
      waitingReason.trim());

  return (
    <div
      className="activity-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="activity-status-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-status-title"
      >
        <header className="activity-status-modal-header">
          <div>
            <h2 id="activity-status-title">
              Actualizar estado
            </h2>

            <p>
              Cambia el estado actual de la actividad.
            </p>
          </div>

          <button
            type="button"
            className="activity-status-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </header>

        <div className="activity-status-reference">
          <strong>{activity.folio}</strong>
          <span>{activity.activity}</span>
        </div>

        <form
          className="activity-status-form"
          onSubmit={handleSubmit}
        >
          <section className="activity-status-section">
            <h3>Estado de la actividad</h3>

            <div className="activity-status-change">
              <label>
                <span>Estado actual</span>

                <div className="activity-current-status">
                  {currentStatus}
                </div>
              </label>

              <div className="activity-status-arrow">
                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                />
              </div>

              <label>
                <span>
                  Nuevo estado <b>*</b>
                </span>

                <select
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(event.target.value)
                  }
                  required
                >
                  <option value="Nueva">Nueva</option>

                  <option value="Planificada">
                    Planificada
                  </option>

                  <option value="En progreso">
                    En progreso
                  </option>

                  <option value="En espera">
                    En espera
                  </option>

                  <option value="Completada">
                    Completada
                  </option>

                  <option value="Cancelada">
                    Cancelada
                  </option>
                </select>
              </label>
            </div>
          </section>

          {newStatus === "En espera" && (
            <section className="activity-status-section">
              <label className="activity-status-field">
                <span>
                  Motivo de espera <b>*</b>
                </span>

                <textarea
                  value={waitingReason}
                  onChange={(event) =>
                    setWaitingReason(
                      event.target.value
                    )
                  }
                  placeholder="Explica por qué la actividad quedará en espera..."
                  maxLength={400}
                  required
                />

                <small>
                  {waitingReason.length}/400
                </small>
              </label>
            </section>
          )}

          <section className="activity-status-section">
            <label className="activity-status-field">
              <span>
                Comentario del cambio <b>*</b>
              </span>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Describe el motivo o resultado del cambio de estado..."
                maxLength={600}
                required
              />

              <small>{comment.length}/600</small>
            </label>

            <label className="activity-status-notify">
              <input
                type="checkbox"
                checked={notify}
                onChange={(event) =>
                  setNotify(event.target.checked)
                }
              />

              <span>
                Notificar a los responsables de la actividad
              </span>
            </label>

            <div className="activity-status-information">
              <Info size={14} strokeWidth={1.8} />

              <span>
                Este cambio se registrará en el historial de
                la actividad.
              </span>
            </div>
          </section>

          <footer className="activity-status-footer">
            <button
              type="button"
              className="activity-status-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="activity-status-submit"
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

export default ActivityStatusModal;