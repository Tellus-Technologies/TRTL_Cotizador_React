import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react";

import { ticketsList } from "../data/ticketsData";
import "../styles/tickets.css";

const initialFiles = [
  {
    id: 1,
    name: "captura-error.png",
    size: "1.2 MB",
    type: "image",
  },
  {
    id: 2,
    name: "registro-acceso.pdf",
    size: "860 KB",
    type: "document",
  },
];

function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const ticket = useMemo(() => {
    return ticketsList.find(
      (item) =>
        String(item.id) === String(ticketId) ||
        item.folio === ticketId
    );
  }, [ticketId]);

  const [formData, setFormData] = useState({
    client: ticket?.client || "Vitafoods",
    project: ticket?.project || "Portal de clientes",
    type: ticket?.type || "Incidente",
    module: "Accesos y autenticación",
    affectedArea: "Operaciones",
    subject: ticket?.description || "Error al iniciar sesión",
    description:
      "El usuario no puede iniciar sesión después de actualizar sus credenciales. El sistema muestra un error de autenticación.",
    priority: ticket?.priority || "Media",
    responsible: ticket?.responsible || "Luis Mejía",
    secondaryResponsible: "Diego López",
    internalComments:
      "Mantener logs de autenticación y validar configuraciones en réplica antes de actualizar. Solicitar evidencia adicional si es necesario.",
    status: "En atención",
  });

  const [files, setFiles] = useState(initialFiles);
  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSaved(false);
  }

  function handlePriorityChange(priority) {
    setFormData((currentData) => ({
      ...currentData,
      priority,
    }));

    setSaved(false);
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    const newFiles = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type.includes("image") ? "image" : "document",
    }));

    setFiles((currentFiles) => [
      ...currentFiles,
      ...newFiles,
    ]);

    event.target.value = "";
    setSaved(false);
  }

  function removeFile(fileId) {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId)
    );

    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const editedTicket = {
      ...ticket,
      ...formData,
      files,
    };

    sessionStorage.setItem(
      `edited-ticket-${ticketId}`,
      JSON.stringify(editedTicket)
    );

    setSaved(true);

    window.setTimeout(() => {
      navigate(`/tickets/${ticketId}`);
    }, 700);
  }

  if (!ticket) {
    return (
      <section className="edit-ticket-page">
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
    <section className="edit-ticket-page">
      <div className="edit-ticket-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/tickets")}
        >
          Tickets
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() => navigate(`/tickets/${ticketId}`)}
        >
          {ticket.folio}
        </button>

        <span>/</span>
        <strong>Editar ticket</strong>
      </div>

      <header className="edit-ticket-header">
        <button
          type="button"
          className="edit-ticket-back"
          onClick={() => navigate(`/tickets/${ticketId}`)}
          aria-label="Regresar al detalle del ticket"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
        </button>

        <div>
          <div className="edit-ticket-title">
            <h1>Editar ticket</h1>
            <span>{ticket.folio}</span>
          </div>

          <p>
            Actualiza la información del ticket. Los campos con
            asterisco son obligatorios.
          </p>

          <small>
            Creado el 09 Ago 2026 · Última actualización 10 Ago 2026
          </small>
        </div>
      </header>

      {saved && (
        <div className="edit-ticket-success">
          Los cambios se guardaron correctamente. Regresando al
          detalle del ticket…
        </div>
      )}

      <form
        className="edit-ticket-form"
        onSubmit={handleSubmit}
      >
        <section className="edit-ticket-section">
          <h2>Información general</h2>

          <div className="edit-ticket-grid edit-ticket-grid-two">
            <label className="edit-ticket-field">
              <span>
                Cliente <b>*</b>
              </span>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="Vit​​afoods">Vitafoods</option>
                <option value="Mitsubishi Electric">
                  Mitsubishi Electric
                </option>
                <option value="Rehau">Rehau</option>
                <option value="Contabilidad Pro">
                  Contabilidad Pro
                </option>
              </select>
            </label>

            <label className="edit-ticket-field">
              <span>Proyecto</span>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
              >
                <option value="Portal de clientes">
                  Portal de clientes
                </option>
                <option value="Implementación SAP">
                  Implementación SAP
                </option>
                <option value="Soporte operativo">
                  Soporte operativo
                </option>
              </select>
            </label>
          </div>

          <div className="edit-ticket-grid edit-ticket-grid-three">
            <label className="edit-ticket-field">
              <span>
                Tipo de ticket <b>*</b>
              </span>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Incidente">Incidente</option>
                <option value="Solicitud">Solicitud</option>
                <option value="Acceso">Acceso</option>
                <option value="Consulta">Consulta</option>
              </select>
            </label>

            <label className="edit-ticket-field">
              <span>
                Módulo <b>*</b>
              </span>

              <select
                name="module"
                value={formData.module}
                onChange={handleChange}
                required
              >
                <option value="Accesos y autenticación">
                  Accesos y autenticación
                </option>
                <option value="SAP SD">SAP SD</option>
                <option value="SAP MM">SAP MM</option>
                <option value="SAP FI">SAP FI</option>
                <option value="Infraestructura">
                  Infraestructura
                </option>
              </select>
            </label>

            <label className="edit-ticket-field">
              <span>Área afectada</span>

              <select
                name="affectedArea"
                value={formData.affectedArea}
                onChange={handleChange}
              >
                <option value="Operaciones">Operaciones</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Ventas">Ventas</option>
                <option value="Tecnología">Tecnología</option>
              </select>
            </label>
          </div>
        </section>

        <section className="edit-ticket-section">
          <h2>Detalle del ticket</h2>

          <div className="edit-ticket-grid edit-ticket-grid-two">
            <label className="edit-ticket-field">
              <span>
                Asunto <b>*</b>
              </span>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </label>

            <label className="edit-ticket-field">
              <span>
                Descripción <b>*</b>
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="edit-ticket-files">
            <span>Archivos adjuntos</span>

            {files.map((file) => (
              <div
                className="edit-ticket-file"
                key={file.id}
              >
                <div
                  className={`edit-ticket-file-icon ${
                    file.type === "image"
                      ? "is-image"
                      : "is-document"
                  }`}
                >
                  {file.type === "image" ? (
                    <Paperclip size={14} />
                  ) : (
                    <FileText size={14} />
                  )}
                </div>

                <div className="edit-ticket-file-information">
                  <strong>{file.name}</strong>
                  <span>{file.size}</span>
                </div>

                <button
                  type="button"
                  aria-label={`Descargar ${file.name}`}
                >
                  <Download size={14} strokeWidth={1.8} />
                </button>

                <button
                  type="button"
                  className="edit-ticket-file-delete"
                  onClick={() => removeFile(file.id)}
                  aria-label={`Eliminar ${file.name}`}
                >
                  <Trash2 size={14} strokeWidth={1.8} />
                </button>
              </div>
            ))}

            <label className="edit-ticket-add-file">
              <Upload size={14} strokeWidth={1.8} />
              <span>Agregar archivo</span>

              <input
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        </section>

        <section className="edit-ticket-section">
          <h2>Asignación</h2>

          <div className="edit-ticket-assignment-grid">
            <div>
              <div className="edit-ticket-priority">
                <span>
                  Prioridad <b>*</b>
                </span>

                <div className="edit-ticket-priority-options">
                  {["Baja", "Media", "Alta", "Crítica"].map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        className={
                          formData.priority === priority
                            ? `is-active is-${priority
                                .toLowerCase()
                                .replace("í", "i")}`
                            : ""
                        }
                        onClick={() =>
                          handlePriorityChange(priority)
                        }
                      >
                        <i />
                        {priority}
                      </button>
                    )
                  )}
                </div>
              </div>

              <label className="edit-ticket-field">
                <span>Comentario interno</span>

                <textarea
                  name="internalComments"
                  value={formData.internalComments}
                  onChange={handleChange}
                  maxLength={1000}
                />

                <small>
                  {formData.internalComments.length}/1000
                </small>
              </label>

              <label className="edit-ticket-field">
                <span>
                  Estado <b>*</b>
                </span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="En atención">
                    En atención
                  </option>
                  <option value="En espera">En espera</option>
                  <option value="Resuelto">Resuelto</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </label>
            </div>

            <div>
              <label className="edit-ticket-field">
                <span>Responsable</span>

                <select
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                >
                  <option value="Luis Mejía">Luis Mejía</option>
                  <option value="Mauricio Contreras">
                    Mauricio Contreras
                  </option>
                  <option value="Ana Martínez">
                    Ana Martínez
                  </option>
                  <option value="Diego López">Diego López</option>
                </select>
              </label>

              <label className="edit-ticket-field">
                <span>Responsable secundario</span>

                <select
                  name="secondaryResponsible"
                  value={formData.secondaryResponsible}
                  onChange={handleChange}
                >
                  <option value="">Sin responsable secundario</option>
                  <option value="Diego López">Diego López</option>
                  <option value="Ana Martínez">
                    Ana Martínez
                  </option>
                  <option value="Mauricio Contreras">
                    Mauricio Contreras
                  </option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <footer className="edit-ticket-footer">
          <button
            type="button"
            className="edit-ticket-cancel"
            onClick={() => navigate(`/tickets/${ticketId}`)}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="edit-ticket-save"
          >
            Guardar cambios
          </button>
        </footer>
      </form>
    </section>
  );
}

export default EditTicketPage;