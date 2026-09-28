import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Paperclip,
  Plus,
  Send,
} from "lucide-react";

import ActivityProgressModal from "../components/ActivityProgressModal";
import ActivityStatusModal from "../components/ActivityStatusModal";
import { activitiesList } from "../data/activitiesData";
import "../styles/activities.css";

const initialComments = [
  {
    id: 1,
    author: "Mauricio Contreras",
    initials: "MC",
    date: "09 Sep 2026 · 20:00",
    text: "Se configuraron las credenciales de prueba y el webhook principal.",
    color: "dark",
  },
  {
    id: 2,
    author: "Mateo Silva",
    initials: "MS",
    date: "09 Sep 2026 · 12:05",
    text: "Los permisos del ambiente de pruebas ya fueron validados.",
    color: "blue",
  },
  {
    id: 3,
    author: "Ana Martínez",
    initials: "AM",
    date: "09 Sep 2026 · 13:10",
    text: "Queda pendiente ejecutar la prueba de conciliación.",
    color: "purple",
  },
];

function ActivityDetailPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] =
    useState(initialComments);

  const [newComment, setNewComment] = useState("");

  const [progressModalOpen, setProgressModalOpen] =
    useState(false);

  const [savedProgress, setSavedProgress] =
    useState(null);

  const [lastProgress, setLastProgress] =
    useState(null);

  const [registeredTime, setRegisteredTime] =
    useState(null);

  const [statusModalOpen, setStatusModalOpen] =
    useState(false);

  const [savedStatus, setSavedStatus] =
    useState(null);

  const [lastStatusUpdate, setLastStatusUpdate] =
    useState(null);

  const activity = useMemo(() => {
    let createdActivities = [];

    try {
      createdActivities = JSON.parse(
        sessionStorage.getItem("created-activities") ||
          "[]"
      );
    } catch {
      createdActivities = [];
    }

    const allActivities = [
      ...createdActivities,
      ...activitiesList,
    ];

    return allActivities.find(
      (item) =>
        String(item.id) === String(activityId) ||
        item.folio === activityId
    );
  }, [activityId]);

  function handleSubmitComment(event) {
    event.preventDefault();

    const cleanComment = newComment.trim();

    if (!cleanComment) {
      return;
    }

    setComments((currentComments) => [
      {
        id: Date.now(),
        author: "Armando Piña",
        initials: "AP",
        date: "Ahora",
        text: cleanComment,
        color: "cyan",
      },
      ...currentComments,
    ]);

    setNewComment("");
  }

  function handleSaveProgress(progressData) {
    setSavedProgress(progressData.progress);
    setLastProgress(progressData);
    setProgressModalOpen(false);

    const hours = progressData.registeredHours;
    const minutes = progressData.registeredMinutes;

    if (hours || minutes) {
      const timeParts = [];

      if (hours) {
        timeParts.push(`${hours} h`);
      }

      if (minutes) {
        timeParts.push(`${minutes} min`);
      }

      setRegisteredTime(timeParts.join(" "));
    }

    setComments((currentComments) => [
      {
        id: Date.now(),
        author: "Armando Piña",
        initials: "AP",
        date: "Ahora",
        text: progressData.comment,
        color: "cyan",
      },
      ...currentComments,
    ]);
  }

  function handleSaveStatus(statusData) {
    setSavedStatus(statusData.status);
    setLastStatusUpdate(statusData);
    setStatusModalOpen(false);

    setComments((currentComments) => [
      {
        id: Date.now(),
        author: "Armando Piña",
        initials: "AP",
        date: "Ahora",
        text: statusData.comment,
        color: "cyan",
      },
      ...currentComments,
    ]);
  }

  function getInitials(name) {
    if (!name || name === "Sin asignar") {
      return "SA";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  function getPriorityClass(priority) {
    return (priority || "Media")
      .toLowerCase()
      .replace("í", "i");
  }

  if (!activity) {
    return (
      <section className="activity-detail-page">
        <div className="activity-not-found">
          <h1>Actividad no encontrada</h1>

          <p>
            La actividad solicitada no existe o no está
            disponible.
          </p>

          <button
            type="button"
            onClick={() => navigate("/actividades")}
          >
            Volver a actividades
          </button>
        </div>
      </section>
    );
  }

  const responsible =
    activity.responsible || "Sin asignar";

  const project =
    activity.project || "Sin proyecto";

  const status =
    savedStatus ?? activity.status ?? "Nueva";

  const priority =
    activity.priority || "Media";

  const calculatedProgress =
    status === "Completada"
      ? 100
      : status === "Nueva"
        ? 0
        : status === "Planificada"
          ? 10
          : status === "En espera"
            ? 40
            : 60;

  const progress =
    savedProgress ?? calculatedProgress;

  const attachedFiles =
    Array.isArray(activity.files)
      ? activity.files.length
      : 3;

  const displayedRegisteredTime =
    registeredTime ||
    activity.registeredTime ||
    "0 h";

  return (
    <section className="activity-detail-page">
      <div className="activity-detail-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/actividades")}
        >
          Actividades
        </button>

        <span>/</span>
        <strong>{activity.folio}</strong>
      </div>

      <header className="activity-detail-header">
        <div className="activity-detail-title-area">
          <button
            type="button"
            className="activity-detail-back"
            onClick={() => navigate("/actividades")}
            aria-label="Regresar al listado"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>

          <div>
            <div className="activity-detail-title">
              <strong>{activity.folio}</strong>
              <h1>{activity.activity}</h1>
            </div>

            <p>
              {activity.client} · Proyecto {project}
            </p>
          </div>
        </div>

        <div className="activity-detail-badges">
          <span className="activity-detail-status">
            {status}
          </span>

          <span
            className={`activity-detail-priority priority-${getPriorityClass(
              priority
            )}`}
          >
            {priority === "Alta"
              ? "Alta prioridad"
              : `Prioridad ${priority.toLowerCase()}`}
          </span>

          <span className="activity-detail-remaining">
            {activity.endDate === "Por definir"
              ? "Fecha pendiente"
              : "3 días restantes"}
          </span>
        </div>

        <div className="activity-detail-actions">
          <button
            type="button"
            className="activity-detail-primary-action"
            onClick={() => setStatusModalOpen(true)}
          >
            Actualizar estado
            <ChevronDown size={14} strokeWidth={2} />
          </button>

          <button
            type="button"
            className="activity-detail-primary-action"
            onClick={() => setProgressModalOpen(true)}
          >
            <Plus size={15} strokeWidth={1.8} />
            Registrar avance
          </button>

         <button
  type="button"
  className="activity-detail-outline-action"
  onClick={() =>
    navigate(`/actividades/${activity.folio}/editar`)
  }
>
  <Edit3 size={15} strokeWidth={1.8} />
  Editar actividad
</button>
        </div>
      </header>

      {lastProgress && (
        <div className="activity-progress-message">
          <strong>
            Avance registrado correctamente.
          </strong>

          <span>
            La actividad ahora tiene un progreso de{" "}
            {lastProgress.progress}%.
          </span>
        </div>
      )}

      {lastStatusUpdate && (
        <div className="activity-status-message">
          <strong>
            Estado actualizado correctamente.
          </strong>

          <span>
            La actividad cambió de{" "}
            {lastStatusUpdate.previousStatus} a{" "}
            {lastStatusUpdate.status}.
          </span>
        </div>
      )}

      <div className="activity-detail-layout">
        <main className="activity-detail-main">
          <article className="activity-detail-card">
            <h2>Detalle de la actividad</h2>

            <div className="activity-information-grid">
              <div>
                <span>Tipo</span>

                <strong>
                  {activity.type || "Sin tipo"}
                </strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>{activity.client}</strong>
              </div>

              <div>
                <span>Proyecto</span>
                <strong>{project}</strong>
              </div>

              <div>
                <span>Creada</span>

                <strong>
                  {activity.startDate || "Hoy"}
                </strong>
              </div>
            </div>

            <div className="activity-description">
              <span>Descripción</span>

              <p>
                {activity.description ||
                  "Configurar y validar la integración de pagos con Stripe en el ambiente de pruebas."}
              </p>
            </div>

            <div className="activity-time-information">
              <div>
                <span>Inicio</span>

                <strong>
                  {activity.startDate || "Por definir"}
                </strong>
              </div>

              <div>
                <span>Vencimiento</span>

                <strong>
                  {activity.endDate || "Por definir"}
                </strong>
              </div>

              <div>
                <span>Tiempo estimado</span>

                <strong>
                  {activity.estimatedTime || "12 h"}
                </strong>
              </div>

              <div>
                <span>Tiempo registrado</span>

                <strong>
                  {displayedRegisteredTime}
                </strong>
              </div>
            </div>
          </article>

          <button
            type="button"
            className="activity-attachments-card"
          >
            <Paperclip size={15} strokeWidth={1.8} />

            <strong>
              {attachedFiles}{" "}
              {attachedFiles === 1
                ? "archivo adjunto"
                : "archivos adjuntos"}
            </strong>
          </button>

          <article className="activity-detail-card">
            <div className="activity-card-title">
              <h2>Relaciones y dependencias</h2>
              <span>2 vinculadas</span>
            </div>

            <div className="activity-relation is-ticket">
              <div className="activity-relation-labels">
                <strong>TCK-398</strong>
                <span>Ticket origen</span>
              </div>

              <h3>Integración API Stripe</h3>

              <div className="activity-relation-information">
                <div>
                  <span>Responsable</span>
                  <strong>Miguel Hernández</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>En atención</strong>
                </div>
              </div>

              <button type="button">
                Ver ticket
              </button>
            </div>

            <div className="activity-relation is-dependency">
              <div className="activity-relation-labels">
                <strong>ACT-099</strong>
                <span>Dependencia</span>
              </div>

              <h3>Validar permisos de integración</h3>

              <div className="activity-relation-information">
                <div>
                  <span>Responsable</span>
                  <strong>Mateo Silva</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>En progreso</strong>
                </div>
              </div>

              <button type="button">
                Ver actividad
              </button>
            </div>
          </article>

          <article className="activity-detail-card">
            <h2>Avances y comentarios</h2>

            <form
              className="activity-comment-form"
              onSubmit={handleSubmitComment}
            >
              <div className="activity-comment-avatar">
                AP
              </div>

              <input
                type="text"
                value={newComment}
                onChange={(event) =>
                  setNewComment(event.target.value)
                }
                placeholder="Escribe un comentario..."
              />

              <button
                type="submit"
                disabled={!newComment.trim()}
              >
                <Send size={14} strokeWidth={1.8} />
                Publicar
              </button>
            </form>

            <div className="activity-comments">
              {activity.initialComments && (
                <div className="activity-comment">
                  <div className="activity-comment-avatar is-cyan">
                    AP
                  </div>

                  <div>
                    <div className="activity-comment-heading">
                      <strong>Armando Piña</strong>
                      <span>Comentario inicial</span>
                    </div>

                    <p>{activity.initialComments}</p>
                  </div>
                </div>
              )}

              {comments.map((comment) => (
                <div
                  className="activity-comment"
                  key={comment.id}
                >
                  <div
                    className={`activity-comment-avatar is-${comment.color}`}
                  >
                    {comment.initials}
                  </div>

                  <div>
                    <div className="activity-comment-heading">
                      <strong>{comment.author}</strong>
                      <span>{comment.date}</span>
                    </div>

                    <p>{comment.text}</p>

                    <button type="button">
                      Responder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </main>

        <aside className="activity-detail-sidebar">
          <article className="activity-detail-card">
            <h2>Responsable</h2>

            <div className="activity-responsible">
              <div className="activity-responsible-avatar">
                {getInitials(responsible)}
              </div>

              <div>
                <strong>{responsible}</strong>

                <span>
                  {activity.module ||
                    "Responsable de actividad"}
                </span>
              </div>
            </div>

            <div className="activity-responsible-status">
              <i />

              {responsible === "Sin asignar"
                ? "Pendiente de asignación"
                : "Disponible"}
            </div>

            <small>
              {responsible === "Sin asignar"
                ? "Sin actividades asignadas"
                : "4 actividades activas"}
            </small>
          </article>

          <article className="activity-detail-card">
            <h2>Seguimiento</h2>

            <div className="activity-tracking-row">
              <span>Estado</span>

              <strong className="tracking-progress">
                {status}
              </strong>
            </div>

            <div className="activity-tracking-row">
              <span>Prioridad</span>

              <strong className="tracking-high">
                {priority}
              </strong>
            </div>

            <div className="activity-progress-heading">
              <span>Progreso</span>
              <strong>{progress}%</strong>
            </div>

            <div className="activity-progress-bar">
              <span
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="activity-tracking-date">
              <span>Inicio</span>

              <strong>
                {activity.startDate || "Por definir"}
              </strong>
            </div>

            <div className="activity-tracking-date">
              <span>Vencimiento</span>

              <strong>
                {activity.endDate || "Por definir"}
              </strong>
            </div>

            <div className="activity-tracking-date">
              <span>Tiempo registrado</span>

              <strong>
                {displayedRegisteredTime}
              </strong>
            </div>
          </article>

          <article className="activity-detail-card">
            <h2>Actividad reciente</h2>

            <div className="activity-recent-list">
              {lastStatusUpdate && (
                <div>
                  <i />
                  <span>Ahora</span>

                  <p>
                    Estado actualizado de{" "}
                    {lastStatusUpdate.previousStatus} a{" "}
                    {lastStatusUpdate.status}
                  </p>
                </div>
              )}

              {lastProgress && (
                <div>
                  <i />
                  <span>Ahora</span>

                  <p>
                    Armando Piña registró un avance de{" "}
                    {lastProgress.progress}%
                  </p>
                </div>
              )}

              <div>
                <i />
                <span>Hoy · 11:20</span>

                <p>
                  {responsible === "Sin asignar"
                    ? "Actividad creada y pendiente de asignación"
                    : `${responsible} registró un avance`}
                </p>
              </div>

              <div>
                <i />
                <span>Hoy · 11:18</span>

                <p>Estado actual: {status}</p>
              </div>

              <div>
                <i />
                <span>09 Sep 2026 · 10:05</span>

                <p>
                  ACT-099 se vinculó como dependencia
                </p>
              </div>

              <div>
                <i />
                <span>08 Sep 2026 · 09:22</span>

                <p>
                  {responsible === "Sin asignar"
                    ? "Actividad registrada sin responsable"
                    : `Actividad asignada a ${responsible}`}
                </p>
              </div>
            </div>
          </article>
        </aside>
      </div>

      <ActivityProgressModal
        open={progressModalOpen}
        activity={activity}
        currentProgress={progress}
        onClose={() => setProgressModalOpen(false)}
        onSave={handleSaveProgress}
      />

      <ActivityStatusModal
        open={statusModalOpen}
        activity={activity}
        currentStatus={status}
        onClose={() => setStatusModalOpen(false)}
        onSave={handleSaveStatus}
      />
    </section>
  );
}

export default ActivityDetailPage;