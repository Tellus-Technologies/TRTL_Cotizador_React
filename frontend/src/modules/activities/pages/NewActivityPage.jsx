import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Trash2,
  UploadCloud,
} from "lucide-react";

import "../styles/activities.css";

function NewActivityPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client: "",
    project: "",
    activityType: "",
    module: "",
    affectedArea: "",
    title: "",
    description: "",
    priority: "Media",
    responsible: "",
    secondaryResponsible: "",
    initialComments: "",
    status: "Nueva",
  });

  const [files, setFiles] = useState([]);
  const [created, setCreated] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handlePriorityChange(priority) {
    setFormData((currentData) => ({
      ...currentData,
      priority,
    }));
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    const newFiles = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    }));

    setFiles((currentFiles) => [
      ...currentFiles,
      ...newFiles,
    ]);

    event.target.value = "";
  }

  function removeFile(fileId) {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newActivity = {
      id: Date.now(),
      folio: `ACT-${Date.now().toString().slice(-3)}`,
      activity: formData.title,
      client: formData.client,
      project: formData.project,
      type: formData.activityType,
      priority: formData.priority,
      status: formData.status,
      responsible:
        formData.responsible || "Sin asignar",
      startDate: "Hoy",
      endDate: "Por definir",
      supportRequest: false,
      module: formData.module,
      affectedArea: formData.affectedArea,
      description: formData.description,
      secondaryResponsible:
        formData.secondaryResponsible,
      initialComments: formData.initialComments,
      files,
    };

    const savedActivities = JSON.parse(
      sessionStorage.getItem("created-activities") || "[]"
    );

    sessionStorage.setItem(
      "created-activities",
      JSON.stringify([newActivity, ...savedActivities])
    );

    setCreated(true);

    window.setTimeout(() => {
      navigate("/actividades");
    }, 800);
  }

  const formIsValid =
    formData.client &&
    formData.activityType &&
    formData.module &&
    formData.title.trim() &&
    formData.description.trim();

  return (
    <section className="new-activity-page">
      <div className="new-activity-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/actividades")}
        >
          Actividades
        </button>

        <span>/</span>
        <strong>Nueva actividad</strong>
      </div>

      <header className="new-activity-header">
        <button
          type="button"
          className="new-activity-back"
          onClick={() => navigate("/actividades")}
          aria-label="Regresar al listado de actividades"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
        </button>

        <div>
          <h1>Nueva actividad</h1>

          <p>
            Registra la información básica de la actividad.
          </p>
        </div>
      </header>

      {created && (
        <div className="new-activity-success">
          Actividad creada correctamente. Regresando al
          listado…
        </div>
      )}

      <form
        className="new-activity-form"
        onSubmit={handleSubmit}
      >
        <section className="new-activity-section">
          <h2>Información general</h2>

          <div className="new-activity-grid new-activity-grid-two">
            <label className="new-activity-field">
              <span>
                Cliente <b>*</b>
              </span>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="">Escoge un cliente...</option>
                <option value="Vitafoods">Vitafoods</option>

                <option value="Mitsubishi Electric">
                  Mitsubishi Electric
                </option>

                <option value="Contabilidad Pro">
                  Contabilidad Pro
                </option>

                <option value="TechNova">TechNova</option>
                <option value="Rehau">Rehau</option>
              </select>
            </label>

            <label className="new-activity-field">
              <span>
                Proyecto <small>Opcional</small>
              </span>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
              >
                <option value="">
                  Selecciona un proyecto...
                </option>

                <option value="Portal Web">Portal Web</option>

                <option value="Implementación">
                  Implementación
                </option>

                <option value="Desarrollo">Desarrollo</option>
                <option value="Soporte">Soporte</option>

                <option value="Infraestructura">
                  Infraestructura
                </option>
              </select>
            </label>
          </div>

          <div className="new-activity-grid new-activity-grid-three">
            <label className="new-activity-field">
              <span>
                Tipo de actividad <b>*</b>
              </span>

              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo...</option>
                <option value="Reunión">Reunión</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Integración">Integración</option>
                <option value="Soporte">Soporte</option>
                <option value="Acceso">Acceso</option>

                <option value="Administración">
                  Administración
                </option>
              </select>
            </label>

            <label className="new-activity-field">
              <span>
                Módulo <b>*</b>
              </span>

              <select
                name="module"
                value={formData.module}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona un módulo...
                </option>

                <option value="SAP FI">SAP FI</option>
                <option value="SAP SD">SAP SD</option>
                <option value="SAP MM">SAP MM</option>
                <option value="SAP PM">SAP PM</option>
                <option value="SAP WM">SAP WM</option>

                <option value="Infraestructura">
                  Infraestructura
                </option>

                <option value="Autenticación">
                  Autenticación
                </option>
              </select>
            </label>

            <label className="new-activity-field">
              <span>
                Área afectada <small>Opcional</small>
              </span>

              <select
                name="affectedArea"
                value={formData.affectedArea}
                onChange={handleChange}
              >
                <option value="">
                  Selecciona un área...
                </option>

                <option value="Operaciones">Operaciones</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Ventas">Ventas</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Tecnología">Tecnología</option>
              </select>
            </label>
          </div>
        </section>

        <section className="new-activity-section">
          <h2>Detalle de la actividad</h2>

          <div className="new-activity-grid new-activity-grid-two">
            <label className="new-activity-field">
              <span>
                Título <b>*</b>
              </span>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Escribe el título de la actividad..."
                required
              />
            </label>

            <label className="new-activity-field">
              <span>
                Descripción <b>*</b>
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el problema o solicitud detalladamente..."
                maxLength={1600}
                required
              />

              <small>
                {formData.description.length}/1600
              </small>
            </label>
          </div>

          <div className="new-activity-files">
            <span>
              Archivos adjuntos <small>Opcional</small>
            </span>

            <label className="new-activity-upload">
              <UploadCloud size={20} strokeWidth={1.6} />

              <strong>
                Arrastra archivos aquí o haz clic para adjuntar
              </strong>

              <small>PNG, JPG, PDF hasta 10 MB</small>

              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="new-activity-file-list">
                {files.map((file) => (
                  <div
                    className="new-activity-file"
                    key={file.id}
                  >
                    <FileText size={15} strokeWidth={1.7} />

                    <div>
                      <strong>{file.name}</strong>
                      <span>{file.size}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      aria-label={`Eliminar ${file.name}`}
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="new-activity-section">
          <h2>Asignación inicial</h2>

          <div className="new-activity-assignment">
            <div>
              <div className="new-activity-priority">
                <span>
                  Prioridad <b>*</b>
                </span>

                <div className="new-activity-priority-options">
                  {["Baja", "Media", "Alta", "Crítica"].map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        className={
                          formData.priority === priority
                            ? `is-active priority-${priority
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

              <label className="new-activity-field">
                <span>
                  Comentarios iniciales{" "}
                  <small>Opcional</small>
                </span>

                <textarea
                  name="initialComments"
                  value={formData.initialComments}
                  onChange={handleChange}
                  placeholder="Escribe observaciones o contexto adicional para el equipo..."
                  maxLength={300}
                />

                <small>
                  {formData.initialComments.length}/300
                </small>
              </label>

              <label className="new-activity-field">
                <span>Estado inicial</span>

                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  readOnly
                />

                <small>Se asigna automáticamente</small>
              </label>
            </div>

            <div>
              <label className="new-activity-field">
                <span>Responsable</span>

                <select
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                >
                  <option value="">Sin asignar</option>

                  <option value="Mauricio Contreras">
                    Mauricio Contreras
                  </option>

                  <option value="Luis Murguía">
                    Luis Murguía
                  </option>

                  <option value="Ana Martínez">
                    Ana Martínez
                  </option>

                  <option value="Diego López">
                    Diego López
                  </option>
                </select>

                <small>Puede asignarse después</small>
              </label>

              <label className="new-activity-field">
                <span>
                  Responsable secundario o apoyo{" "}
                  <small>Opcional</small>
                </span>

                <select
                  name="secondaryResponsible"
                  value={formData.secondaryResponsible}
                  onChange={handleChange}
                >
                  <option value="">Sin asignar</option>

                  <option value="Mateo Silva">
                    Mateo Silva
                  </option>

                  <option value="Ana Martínez">
                    Ana Martínez
                  </option>

                  <option value="Miguel Hernández">
                    Miguel Hernández
                  </option>
                </select>

                <small>Puede asignarse después</small>
              </label>
            </div>
          </div>
        </section>

        <footer className="new-activity-footer">
          <button
            type="button"
            className="new-activity-cancel"
            onClick={() => navigate("/actividades")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="new-activity-submit"
            disabled={!formIsValid || created}
          >
            Crear actividad
          </button>
        </footer>
      </form>
    </section>
  );
}

export default NewActivityPage;