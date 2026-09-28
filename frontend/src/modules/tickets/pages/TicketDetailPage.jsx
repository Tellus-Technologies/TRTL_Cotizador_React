import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Paperclip,
  Send,
  UserPlus,
} from "lucide-react";

import ProgressModal from "../components/ProgressModal";
import SupportRequestModal from "../components/SupportRequestModal";
import { ticketsList } from "../data/ticketsData";
import "../styles/tickets.css";

const initialComments = [
  {
    id: 1,
    author: "Mauricio Contreras",
    initials: "MC",
    date: "09 Ago 2026 · 09:15",
    text: "El usuario ingresó de manera incorrecta después de actualizar sus credenciales.",
    color: "blue",
  },
  {
    id: 2,
    author: "Mateo Silva",
    initials: "MS",
    date: "09 Ago 2026 · 11:32",
    text: "Revisé los permisos del servicio. Actualizaré un reporte de largo alcance.",
    color: "cyan",
    support: true,
  },
  {
    id: 3,
    author: "Ana Martínez",
    initials: "AM",
    date: "09 Ago 2026 · 12:08",
    text: "Safari en SD y en un año no se presentan las tardanzas en los navegadores.",
    color: "purple",
  },
];

function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [createdSupport, setCreatedSupport] = useState(null);

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState("En atención");
  const [ticketProgress, setTicketProgress] = useState(25);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(null);

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const ticket = useMemo(() => {
    return ticketsList.find(
      (item) =>
        String(item.id) === String(ticketId) ||
        item.folio === ticketId
    );
  }, [ticketId]);

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
        color: "blue",
      },
      ...currentComments,
    ]);

    setNewComment("");
  }

  function handleCreateSupport(supportRequest) {
    setCreatedSupport(supportRequest);
    setSupportModalOpen(false);

    setComments((currentComments) => [
      {
        id: Date.now(),
        author: "Armando Piña",
        initials: "AP",
        date: "Ahora",
        text: `Se solicitó apoyo a ${supportRequest.assigneeName}: ${supportRequest.reason}`,
        color: "blue",
        support: true,
      },
      ...currentComments,
    ]);
  }

  function handleProgressUpdate(progressUpdate) {
    setTicketStatus(progressUpdate.status);
    setTicketProgress(progressUpdate.progress);
    setLastProgressUpdate(progressUpdate);
    setProgressModalOpen(false);

    setComments((currentComments) => [
      {
        id: Date.now(),
        author: "Armando Piña",
        initials: "AP",
        date: "Ahora",
        text: progressUpdate.comment,
        color: "blue",
        progress: progressUpdate.progress,
      },
      ...currentComments,
    ]);
  }

  if (!ticket) {
    return (
      <section className="ticket-detail-page">
        <div className="ticket-not-found">
          <h1>Ticket no encontrado</h1>

          <p>
            El ticket solicitado no existe o no está disponible.
          </p>

          <button
            type="button"
            onClick={() => navigate("/tickets")}
          >
            Volver a tickets
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="ticket-detail-page">
      <div className="ticket-detail-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/tickets")}
        >
          Tickets
        </button>

        <span>/</span>
        <strong>{ticket.folio}</strong>
      </div>

      <header className="ticket-detail-header">
        <div className="ticket-detail-title-area">
          <button
            type="button"
            className="ticket-detail-back"
            onClick={() => navigate("/tickets")}
            aria-label="Regresar al listado"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>

          <div>
            <div className="ticket-detail-title">
              <strong>{ticket.folio}</strong>
              <h1>{ticket.description}</h1>
            </div>

            <p>
              {ticket.client} · Proyecto {ticket.project}
            </p>
          </div>
        </div>

        <div className="ticket-detail-header-status">
          <span className="detail-status-delayed">
            Atrasado
          </span>

          <span className="detail-status-attention">
            {ticketStatus}
          </span>

          <span className="detail-status-days">
            7 días de atraso
          </span>
        </div>

        <div className="ticket-detail-actions">
          <button
            type="button"
            className="detail-primary-action"
            onClick={() => setProgressModalOpen(true)}
          >
            Actualizar avance
            <ChevronDown size={14} strokeWidth={2} />
          </button>

          <button
            type="button"
            className="detail-primary-action"
            onClick={() => setSupportModalOpen(true)}
          >
            <UserPlus size={15} strokeWidth={1.8} />
            Solicitar apoyo
          </button>

          <button
          type="button"
          className="detail-primary-action"
          onClick={() => navigate(`/tickets/${ticketId}/editar`)}
             >
  <Edit3 size={15} strokeWidth={1.8} />
  Editar ticket
</button>
        </div>
      </header>

      {lastProgressUpdate && (
        <div className="progress-created-message">
          <strong>
            Avance actualizado correctamente.
          </strong>

          <span>
            El ticket ahora se encuentra en{" "}
            {lastProgressUpdate.status} con un avance de{" "}
            {lastProgressUpdate.progress}%.
          </span>
        </div>
      )}

      {createdSupport && (
        <div className="support-created-message">
          <strong>
            Solicitud de apoyo enviada correctamente.
          </strong>

          <span>
            El apoyo fue asignado a{" "}
            {createdSupport.assigneeName}.
          </span>
        </div>
      )}

      <div className="ticket-detail-layout">
        <main className="ticket-detail-main">
          <article className="ticket-detail-card">
            <h2>Detalle del ticket</h2>

            <div className="ticket-information-grid">
              <div>
                <span>Tipo</span>
                <strong>{ticket.type}</strong>
              </div>

              <div>
                <span>Módulo</span>
                <strong>Autenticación</strong>
              </div>

              <div>
                <span>Área afectada</span>
                <strong>Seguridad</strong>
              </div>

              <div>
                <span>Creado</span>
                <strong>09 Ago 2026</strong>
              </div>
            </div>

            <div className="ticket-description-block">
              <span>Descripción</span>

              <p>
                El usuario no puede iniciar sesión después de actualizar
                sus credenciales. El sistema muestra un error de
                autenticación.
              </p>
            </div>
          </article>

          <button
            type="button"
            className="ticket-attachments-card"
          >
            <Paperclip size={15} strokeWidth={1.8} />
            <strong>2 archivos adjuntos</strong>
          </button>

          <article className="ticket-detail-card">
            <div className="ticket-card-title-with-badge">
              <h2>Apoyos y dependencias</h2>

              <span>
                {createdSupport ? "2 activas" : "1 activa"}
              </span>
            </div>

            {createdSupport && (
              <div className="ticket-support-item">
                <div className="ticket-support-labels">
                  <strong>
                    {createdSupport.id.slice(0, 11)}
                  </strong>

                  {createdSupport.blocksTicket && (
                    <span className="support-blocking">
                      Bloqueante
                    </span>
                  )}

                  <span className="support-active">
                    {createdSupport.status}
                  </span>
                </div>

                <h3>{createdSupport.supportType}</h3>

                <div className="ticket-support-information">
                  <div>
                    <span>Responsable</span>

                    <strong>
                      {createdSupport.assigneeName} /{" "}
                      {createdSupport.assigneeRole}
                    </strong>
                  </div>

                  <div>
                    <span>Solicitado por</span>
                    <strong>Armando Piña</strong>
                  </div>

                  <div>
                    <span>Requerido</span>

                    <strong>
                      {createdSupport.requiredDate} ·{" "}
                      {createdSupport.requiredTime}
                    </strong>
                  </div>
                </div>

                <p>{createdSupport.reason}</p>

                <button type="button">
                  Ver detalle
                </button>
              </div>
            )}

            <div className="ticket-support-item">
              <div className="ticket-support-labels">
                <strong>APO-024</strong>

                <span className="support-blocking">
                  Bloqueante
                </span>

                <span className="support-active">
                  En curso
                </span>
              </div>

              <h3>
                Validar permisos del servicio de autenticación
              </h3>

              <div className="ticket-support-information">
                <div>
                  <span>Responsable</span>
                  <strong>Mateo Silva / Soporte L3</strong>
                </div>

                <div>
                  <span>Solicitado por</span>
                  <strong>Mauricio Contreras</strong>
                </div>

                <div>
                  <span>Requerido</span>
                  <strong>02 Sep · 14:00</strong>
                </div>
              </div>

              <p>
                Confirmar los permisos y comprobar la existencia de
                acceso estático.
              </p>

              <button type="button">
                Ver detalle
              </button>
            </div>
          </article>

          <article className="ticket-detail-card ticket-comments-card">
            <h2>Avances y comentarios</h2>

            <form
              className="ticket-comment-form"
              onSubmit={handleSubmitComment}
            >
              <span className="ticket-comment-avatar is-blue">
                AP
              </span>

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
                Enviar comentario
              </button>
            </form>

            <div className="ticket-comments-list">
              {comments.map((comment) => (
                <article
                  className="ticket-comment"
                  key={comment.id}
                >
                  <span
                    className={`ticket-comment-avatar is-${comment.color}`}
                  >
                    {comment.initials}
                  </span>

                  <div>
                    <div className="ticket-comment-heading">
                      <strong>{comment.author}</strong>

                      {comment.support && (
                        <span>APOYO</span>
                      )}

                      {comment.progress !== undefined && (
                        <span>
                          AVANCE {comment.progress}%
                        </span>
                      )}

                      <small>{comment.date}</small>
                    </div>

                    <p>{comment.text}</p>

                    <button type="button">
                      Responder
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </main>

        <aside className="ticket-detail-sidebar">
          <article className="ticket-detail-card">
            <h2>Responsable</h2>

            <div className="ticket-responsible-profile">
              <span className="ticket-responsible-avatar">
                MC
              </span>

              <div>
                <strong>
                  {ticket.responsible || "Mauricio Contreras"}
                </strong>

                <span>Consultor SAP FI</span>
              </div>
            </div>

            <p className="ticket-responsible-availability">
              <span></span>
              Disponible
            </p>

            <small>8 tickets activos</small>
          </article>

          <article className="ticket-detail-card">
            <h2>Seguimiento</h2>

            <div className="ticket-tracking-row">
              <span>Estado</span>

              <strong className="tracking-progress">
                {ticketStatus}
              </strong>
            </div>

            <div className="ticket-tracking-row">
              <span>Prioridad</span>

              <strong className="tracking-priority">
                {ticket.priority}
              </strong>
            </div>

            <div className="ticket-progress-heading">
              <span>Progreso</span>
              <strong>{ticketProgress}%</strong>
            </div>

            <div className="ticket-detail-progress">
              <span
                style={{ width: `${ticketProgress}%` }}
              ></span>
            </div>

            <div className="ticket-tracking-dates">
              <div>
                <span className="tracking-start-label">
                  Inicio
                </span>

                <strong>08 Sep 2026</strong>
              </div>

              <div>
                <span>Vencimiento</span>
                <strong>17 Sep 2026</strong>
              </div>

              <div>
                <span>Tiempo registrado</span>
                <strong>-</strong>
              </div>

              {lastProgressUpdate?.resumeDate && (
                <div>
                  <span>Reanudación estimada</span>

                  <strong>
                    {lastProgressUpdate.resumeDate}
                    {lastProgressUpdate.resumeTime
                      ? ` · ${lastProgressUpdate.resumeTime}`
                      : ""}
                  </strong>
                </div>
              )}
            </div>
          </article>

          <article className="ticket-detail-card">
            <h2>Actividad reciente</h2>

            <div className="ticket-recent-activity">
              {lastProgressUpdate && (
                <article>
                  <span></span>

                  <div>
                    <small>Ahora</small>

                    <strong>
                      Estado actualizado de{" "}
                      {lastProgressUpdate.previousStatus} a{" "}
                      {lastProgressUpdate.status}
                    </strong>

                    <p>
                      Avance reportado:{" "}
                      {lastProgressUpdate.progress}%.
                    </p>
                  </div>
                </article>
              )}

              {createdSupport && (
                <article>
                  <span></span>

                  <div>
                    <small>Ahora</small>

                    <strong>
                      Apoyo solicitado a{" "}
                      {createdSupport.assigneeName}
                    </strong>

                    <p>{createdSupport.reason}</p>
                  </div>
                </article>
              )}

              <article>
                <span></span>

                <div>
                  <small>10 Ago 2026 · 12:40</small>

                  <strong>
                    Mauricio Contreras añadió TCK-401
                  </strong>

                  <p>
                    Nota: Se revisarán los registros de
                    autenticación.
                  </p>
                </div>
              </article>

              <article>
                <span></span>

                <div>
                  <small>09 Ago 2026 · 10:05</small>

                  <strong>
                    Estado cambiado de Nuevo a En atención
                  </strong>
                </div>
              </article>

              <article>
                <span></span>

                <div>
                  <small>09 Ago 2026 · 09:22</small>

                  <strong>
                    Ticket asignado a Mauricio Contreras
                  </strong>
                </div>
              </article>

              <article>
                <span></span>

                <div>
                  <small>09 Ago 2026 · 09:15</small>

                  <strong>
                    Ticket creado por Armando Piña
                  </strong>
                </div>
              </article>
            </div>
          </article>
        </aside>
      </div>

      <ProgressModal
        isOpen={progressModalOpen}
        ticket={ticket}
        currentStatus={ticketStatus}
        currentProgress={ticketProgress}
        onClose={() => setProgressModalOpen(false)}
        onSubmit={handleProgressUpdate}
      />

      <SupportRequestModal
        isOpen={supportModalOpen}
        ticket={ticket}
        onClose={() => setSupportModalOpen(false)}
        onSubmit={handleCreateSupport}
      />
    </section>
  );
}

export default TicketDetailPage;