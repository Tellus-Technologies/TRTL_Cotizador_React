import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { activitiesList } from "../data/activitiesData";
import "../styles/activities.css";

function EditActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const activity = useMemo(() => {
    let createdActivities = [];
    let activityOverrides = {};

    try {
      createdActivities = JSON.parse(
        sessionStorage.getItem("created-activities") ||
          "[]"
      );

      activityOverrides = JSON.parse(
        sessionStorage.getItem("activity-overrides") ||
          "{}"
      );
    } catch {
      createdActivities = [];
      activityOverrides = {};
    }

    const allActivities = [
      ...createdActivities,
      ...activitiesList,
    ];

    const foundActivity = allActivities.find(
      (item) =>
        String(item.id) === String(activityId) ||
        item.folio === activityId
    );

    if (!foundActivity) {
      return null;
    }

    return {
      ...foundActivity,
      ...(activityOverrides[foundActivity.folio] || {}),
    };
  }, [activityId]);

  const [formData, setFormData] = useState(() => ({
    client: activity?.client || "",
    project: activity?.project || "",
    activityType: activity?.type || "",
    module: activity?.module || "",
    affectedArea: activity?.affectedArea || "",
    title: activity?.activity || "",
    description: activity?.description || "",
    priority: activity?.priority || "Media",
    responsible: activity?.responsible || "",
    secondaryResponsible:
      activity?.secondaryResponsible || "",
    initialComments: activity?.initialComments || "",
    status: activity?.status || "Nueva",
  }));

  const [files, setFiles] = useState(
    Array.isArray(activity?.files)
      ? activity.files
      : []
  );

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

    const updatedActivity = {
      ...activity,
      activity: formData.title.trim(),
      client: formData.client,
      project: formData.project,
      type: formData.activityType,
      module: formData.module,
      affectedArea: formData.affectedArea,
      description: formData.description.trim(),
      priority: formData.priority,
      responsible:
        formData.responsible || "Sin asignar",
      secondaryResponsible:
        formData.secondaryResponsible,
      initialComments: formData.initialComments,
      status: formData.status,
      files,
    };

    let activityOverrides = {};

    try {
      activityOverrides = JSON.parse(
        sessionStorage.getItem("activity-overrides") ||
          "{}"
      );
    } catch {
      activityOverrides = {};
    }

    activityOverrides[activity.folio] =
      updatedActivity;

    sessionStorage.setItem(
      "activity-overrides",
      JSON.stringify(activityOverrides)
    );

    setSaved(true);

    window.setTimeout(() => {
      navigate(`/actividades/${activity.folio}`);
    }, 700);
  }

  const formIsValid =
    formData.client &&
    formData.activityType &&
    formData.module &&
    formData.title.trim() &&
    formData.description.trim();

  if (!activity) {
    return (
      <section className="new-activity-page">
        <div className="activity-not-found">
          <h1>Actividad no encontrada</h1>

          <p>
            La actividad que deseas editar no existe o no
            está disponible.
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

        <button
          type="button"
          onClick={() =>
            navigate(`/actividades/${activity.folio}`)
          }
        >
          {activity.folio}
        </button>

        <span>/</span>
        <strong>Editar actividad</strong>
      </div>

      <header className="new-activity-header">
        <button
          type="button"
          className="new-activity-back"
          onClick={() =>
            navigate(`/actividades/${activity.folio}`)
          }
          aria-label="Regresar al detalle"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
        </button>

        <div>
          <h1>Editar actividad</h1>

          <p>
            Actualiza la información de {activity.folio}.
          </p>
        </div>
      </header>

      {saved && (
        <div className="new-activity-success">
          Cambios guardados correctamente. Regresando al
          detalle…
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
                <option value="Grupo Andino">
                  Grupo Andino
                </option>
                <option value="Teletec">Teletec</option>
                <option value="GlobalFarma">
                  GlobalFarma
                </option>
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

                <option value="Administración">
                  Administración
                </option>
                <option value="Seguridad">Seguridad</option>
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

                <option value="Infraestructura">
                  Infraestructura
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
                Arrastra archivos aquí o haz clic para
                adjuntar
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
          <h2>Asignación</h2>

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
                  Comentarios internos{" "}
                  <small>Opcional</small>
                </span>

                <textarea
                  name="initialComments"
                  value={formData.initialComments}
                  onChange={handleChange}
                  maxLength={300}
                />

                <small>
                  {formData.initialComments.length}/300
                </small>
              </label>

              <label className="new-activity-field">
                <span>Estado</span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
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

                  <option value="Miguel Hernández">
                    Miguel Hernández
                  </option>
                </select>
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
              </label>
            </div>
          </div>
        </section>

        <footer className="new-activity-footer">
          <button
            type="button"
            className="new-activity-cancel"
            onClick={() =>
              navigate(`/actividades/${activity.folio}`)
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="new-activity-submit"
            disabled={!formIsValid || saved}
          >
            Guardar cambios
          </button>
        </footer>
      </form>
    </section>
  );
}

export default EditActivityPage;