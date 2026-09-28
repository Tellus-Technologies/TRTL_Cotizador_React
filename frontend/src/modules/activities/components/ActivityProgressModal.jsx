import { useEffect, useState } from "react";
import {
  Clock3,
  Paperclip,
  X,
} from "lucide-react";

function ActivityProgressModal({
  open,
  activity,
  currentProgress = 0,
  onClose,
  onSave,
}) {
  const [progress, setProgress] =
    useState(currentProgress);

  const [registeredHours, setRegisteredHours] =
    useState("");

  const [registeredMinutes, setRegisteredMinutes] =
    useState("0");

  const [comment, setComment] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }

    setProgress(currentProgress);
    setRegisteredHours("");
    setRegisteredMinutes("0");
    setComment("");
    setEvidence(null);
    setNotify(true);
  }, [open, currentProgress]);

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

    if (!cleanComment) {
      return;
    }

    onSave({
      id: Date.now(),
      progress: Number(progress),
      registeredHours: Number(registeredHours || 0),
      registeredMinutes: Number(registeredMinutes || 0),
      comment: cleanComment,
      evidence,
      notify,
      createdAt: "Ahora",
    });
  }

  if (!open || !activity) {
    return null;
  }

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
        className="activity-progress-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-progress-title"
      >
        <header className="activity-progress-modal-header">
          <div>
            <h2 id="activity-progress-title">
              Registrar avance
            </h2>

            <p>
              Registra el progreso y el tiempo invertido en
              la actividad.
            </p>
          </div>

          <button
            type="button"
            className="activity-progress-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </header>

        <div className="activity-progress-reference">
          <strong>{activity.folio}</strong>
          <span>{activity.activity}</span>
        </div>

        <form
          className="activity-progress-form"
          onSubmit={handleSubmit}
        >
          <section className="activity-progress-section">
            <h3>Progreso de la actividad</h3>

            <div className="activity-progress-value">
              <span>Porcentaje completado</span>
              <strong>{progress}%</strong>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(event) =>
                setProgress(event.target.value)
              }
              className="activity-progress-range"
              style={{
                "--activity-progress": `${progress}%`,
              }}
            />

            <div className="activity-progress-scale">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </section>

          <section className="activity-progress-section">
            <h3>Tiempo registrado</h3>

            <div className="activity-progress-time-grid">
              <label>
                <span>Horas</span>

                <div className="activity-progress-input-icon">
                  <Clock3 size={14} strokeWidth={1.7} />

                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={registeredHours}
                    onChange={(event) =>
                      setRegisteredHours(
                        event.target.value
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </label>

              <label>
                <span>Minutos</span>

                <select
                  value={registeredMinutes}
                  onChange={(event) =>
                    setRegisteredMinutes(
                      event.target.value
                    )
                  }
                >
                  <option value="0">0 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                </select>
              </label>
            </div>
          </section>

          <section className="activity-progress-section">
            <label className="activity-progress-field">
              <span>
                Comentario del avance <b>*</b>
              </span>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Describe el trabajo realizado, los resultados y cualquier pendiente..."
                maxLength={600}
                required
              />

              <small>{comment.length}/600</small>
            </label>

            <label className="activity-progress-file">
              <Paperclip size={15} strokeWidth={1.8} />

              <span>
                {evidence
                  ? evidence.name
                  : "Adjuntar evidencia"}
              </span>

              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(event) =>
                  setEvidence(
                    event.target.files?.[0] || null
                  )
                }
              />
            </label>

            <label className="activity-progress-notify">
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
          </section>

          <footer className="activity-progress-footer">
            <button
              type="button"
              className="activity-progress-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="activity-progress-submit"
              disabled={!comment.trim()}
            >
              Registrar avance
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default ActivityProgressModal;