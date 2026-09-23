import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

const EXCHANGE_RATE = 17.064;

const projects = {
  "4000000003": {
    id: "4000000003",
    client: "Vitafoods",
    name: "Proyecto de prueba",
    methodology: "ASAP",
    fiscalYear: "2026",
    startDate: "2026-09-18",
    endDate: "2026-10-06",
    businessDays: 13,
    assignedDays: 10,
    hours: 80,
    exchangeRate: EXCHANGE_RATE,
    discountType: "percentage",
    discountValue: 6,
    comment: "",
    clientComment: "Cliente Vitafoods",
    subtotalUsd: 8000,
    subtotalMxn: 136512,
    discountUsd: 480,
    discountMxn: 8190.72,
    finalUsd: 7520,
    finalMxn: 128321.28,
    modules: [
      {
        module: "FI",
        hourlyRateUsd: 100,
        hourlyRateMxn: 1706.4,
        days: 10,
        hours: 80,
        totalUsd: 8000,
        totalMxn: 136512,
      },
    ],
    phases: [
      {
        order: 1,
        name: "Preparación del proyecto",
        days: 5,
        percentage: 20,
        startDay: 1,
        estimatedUsd: 1600,
        estimatedMxn: 27302.4,
        finalUsd: 1504,
        finalMxn: 25661.06,
        dates: "18/09/2026 - 24/09/2026",
      },
      {
        order: 2,
        name: "Planes de negocio",
        days: 3,
        percentage: 20,
        startDay: 6,
        estimatedUsd: 1600,
        estimatedMxn: 27302.4,
        finalUsd: 1504,
        finalMxn: 25661.06,
        dates: "25/09/2026 - 29/09/2026",
      },
      {
        order: 3,
        name: "Realización",
        days: 2,
        percentage: 20,
        startDay: 8,
        estimatedUsd: 1600,
        estimatedMxn: 27302.4,
        finalUsd: 1504,
        finalMxn: 25661.06,
        dates: "29/09/2026 - 30/09/2026",
      },
      {
        order: 4,
        name: "Preparación final",
        days: 2,
        percentage: 20,
        startDay: 9,
        estimatedUsd: 1600,
        estimatedMxn: 27302.4,
        finalUsd: 1504,
        finalMxn: 25661.06,
        dates: "30/09/2026 - 01/10/2026",
      },
      {
        order: 5,
        name: "Go Live",
        days: 1,
        percentage: 20,
        startDay: 11,
        estimatedUsd: 1600,
        estimatedMxn: 27302.4,
        finalUsd: 1504,
        finalMxn: 25661.04,
        dates: "02/10/2026",
      },
    ],
    resources: [
      {
        module: "FI",
        number: 1,
        hourlyRateUsd: 100,
        hourlyRateMxn: 1706.4,
        days: 5,
        hours: 40,
        totalUsd: 4000,
        totalMxn: 68256,
        dates:
          "18/09/2026, 21/09/2026 - 24/09/2026",
      },
      {
        module: "FI",
        number: 2,
        hourlyRateUsd: 100,
        hourlyRateMxn: 1706.4,
        days: 5,
        hours: 40,
        totalUsd: 4000,
        totalMxn: 68256,
        dates:
          "25/09/2026, 28/09/2026 - 01/10/2026",
      },
    ],
  },

  "4000000002": {
    id: "4000000002",
    client: "Vitafoods",
    name: "Proyecto Vita",
    methodology: "SAP Activate",
    fiscalYear: "2026",
    startDate: "2026-06-08",
    endDate: "2026-10-01",
    businessDays: 84,
    assignedDays: 44,
    hours: 352,
    exchangeRate: EXCHANGE_RATE,
    discountType: "percentage",
    discountValue: 15,
    comment: "",
    clientComment: "Cliente Vitafoods",
    subtotalUsd: 4655.41,
    subtotalMxn: 79440,
    discountUsd: 698.31,
    discountMxn: 11916,
    finalUsd: 3957.1,
    finalMxn: 67524,
    modules: [
      {
        module: "SD",
        hourlyRateUsd: 100,
        hourlyRateMxn: 1706.4,
        days: 44,
        hours: 352,
        totalUsd: 4655.41,
        totalMxn: 79440,
      },
    ],
    phases: [],
    resources: [],
  },

  "4000000001": {
    id: "4000000001",
    client: "Mitsubishi",
    name: "Proyecto de soporte",
    methodology: "ITIL",
    fiscalYear: "2026",
    startDate: "2026-04-21",
    endDate: "2026-05-31",
    businessDays: 29,
    assignedDays: 20,
    hours: 160,
    exchangeRate: EXCHANGE_RATE,
    discountType: "none",
    discountValue: 0,
    comment: "",
    clientComment: "Cliente Mitsubishi",
    subtotalUsd: 2095.64,
    subtotalMxn: 35760,
    discountUsd: 0,
    discountMxn: 0,
    finalUsd: 2095.64,
    finalMxn: 35760,
    modules: [
      {
        module: "PM",
        hourlyRateUsd: 75,
        hourlyRateMxn: 1279.8,
        days: 20,
        hours: 160,
        totalUsd: 2095.64,
        totalMxn: 35760,
      },
    ],
    phases: [],
    resources: [],
  },
};

function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const originalProject =
    projects[projectId] ?? null;

  const [project, setProject] = useState(
    originalProject
  );

  const [draftProject, setDraftProject] =
    useState(originalProject);

  const [isEditing, setIsEditing] =
    useState(false);

  const phaseTotals = useMemo(() => {
    if (!project) {
      return {
        percentage: 0,
        days: 0,
        estimatedUsd: 0,
        estimatedMxn: 0,
        finalUsd: 0,
        finalMxn: 0,
      };
    }

    return project.phases.reduce(
      (totals, phase) => ({
        percentage:
          totals.percentage +
          phase.percentage,
        days: totals.days + phase.days,
        estimatedUsd:
          totals.estimatedUsd +
          phase.estimatedUsd,
        estimatedMxn:
          totals.estimatedMxn +
          phase.estimatedMxn,
        finalUsd:
          totals.finalUsd +
          phase.finalUsd,
        finalMxn:
          totals.finalMxn +
          phase.finalMxn,
      }),
      {
        percentage: 0,
        days: 0,
        estimatedUsd: 0,
        estimatedMxn: 0,
        finalUsd: 0,
        finalMxn: 0,
      }
    );
  }, [project]);

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(
      new Date(`${value}T00:00:00`)
    );
  }

  function handleDraftChange(event) {
    const { name, value } = event.target;

    setDraftProject((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  }

  function handleStartEditing() {
    setDraftProject(project);
    setIsEditing(true);
  }

  function handleCancelEditing() {
    setDraftProject(project);
    setIsEditing(false);
  }

  function handleSaveProject() {
    setProject(draftProject);
    setIsEditing(false);
  }

  if (!project) {
    return (
      <section className="project-detail-card">
        <header className="project-detail-header">
          <div>
            <h1>Proyecto no encontrado</h1>

            <p>
              No existe información para el proyecto{" "}
              {projectId}.
            </p>
          </div>

          <button
            type="button"
            className="project-back-button"
            onClick={() => navigate("/proyectos")}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </header>
      </section>
    );
  }

  return (
    <section className="project-detail-card">
      <header className="project-detail-header">
        <div>
          <h1>Detalle del proyecto</h1>

          <p>Proyecto #{project.id}</p>
        </div>

        <div className="project-detail-header-actions">
          <button
            type="button"
            className="project-back-button"
            onClick={() => navigate("/proyectos")}
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          {isEditing ? (
            <>
              <button
                type="button"
                className="project-cancel-edit-button"
                onClick={handleCancelEditing}
              >
                <X size={15} />
                Cancelar
              </button>

              <button
                type="button"
                className="project-edit-button"
                onClick={handleSaveProject}
              >
                <Save size={15} />
                Guardar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="project-edit-button"
              onClick={handleStartEditing}
            >
              <Pencil size={15} />
              Editar
            </button>
          )}
        </div>
      </header>

      <div className="project-detail-badges">
        <span className="is-primary">
          Cliente: {project.client}
        </span>

        <span>
          Metodología: {project.methodology}
        </span>

        <span>
          Año fiscal: {project.fiscalYear}
        </span>

        <span>
          Días: {project.assignedDays}
        </span>

        <span>Horas: {project.hours}</span>
      </div>

      <section className="project-detail-section">
        <h2>Datos generales</h2>

        <div className="project-general-grid">
          <div className="project-detail-field">
            <label htmlFor="detail-project-name">
              Nombre del proyecto
            </label>

            <input
              id="detail-project-name"
              name="name"
              type="text"
              value={
                isEditing
                  ? draftProject.name
                  : project.name
              }
              onChange={handleDraftChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="project-detail-field">
            <label htmlFor="detail-exchange-rate">
              Tipo de cambio
            </label>

            <input
              id="detail-exchange-rate"
              type="text"
              value={project.exchangeRate}
              readOnly
            />
          </div>

          <div className="project-detail-field">
            <label htmlFor="detail-start-date">
              Fecha de inicio
            </label>

            <input
              id="detail-start-date"
              name="startDate"
              type={isEditing ? "date" : "text"}
              value={
                isEditing
                  ? draftProject.startDate
                  : formatDate(
                      project.startDate
                    )
              }
              onChange={handleDraftChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="project-detail-field">
            <label htmlFor="detail-end-date">
              Fecha de fin
            </label>

            <input
              id="detail-end-date"
              name="endDate"
              type={isEditing ? "date" : "text"}
              value={
                isEditing
                  ? draftProject.endDate
                  : formatDate(project.endDate)
              }
              onChange={handleDraftChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="project-detail-field project-comment-field">
            <label htmlFor="detail-comment">
              Comentario del proyecto
            </label>

            <textarea
              id="detail-comment"
              name="comment"
              rows="3"
              value={
                isEditing
                  ? draftProject.comment
                  : project.comment
              }
              onChange={handleDraftChange}
              readOnly={!isEditing}
              placeholder="Sin comentarios"
            />
          </div>
        </div>

        <p className="project-client-comment">
          <strong>Comentario del cliente:</strong>{" "}
          {project.clientComment}
        </p>
      </section>

      <section className="project-detail-section">
        <h2>Descuento y totales</h2>

        <div className="project-discount-information">
          <div>
            <span>Tipo de descuento</span>
            <strong>
              {project.discountType ===
              "percentage"
                ? "Porcentaje"
                : project.discountType === "fixed"
                  ? "Monto fijo"
                  : "Sin descuento"}
            </strong>
          </div>

          <div>
            <span>Descuento</span>
            <strong>
              {project.discountType ===
              "percentage"
                ? `${project.discountValue}%`
                : formatCurrency(
                    project.discountValue,
                    "MXN"
                  )}
            </strong>
          </div>
        </div>

        <div className="project-detail-table-container">
          <table className="project-totals-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>MXN</th>
                <th>USD</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Subtotal</td>

                <td>
                  {formatCurrency(
                    project.subtotalMxn,
                    "MXN"
                  )}
                </td>

                <td>
                  {formatCurrency(
                    project.subtotalUsd,
                    "USD"
                  )}
                </td>
              </tr>

              <tr>
                <td>Descuento</td>

                <td>
                  {formatCurrency(
                    project.discountMxn,
                    "MXN"
                  )}
                </td>

                <td>
                  {formatCurrency(
                    project.discountUsd,
                    "USD"
                  )}
                </td>
              </tr>

              <tr className="project-total-row">
                <td>Total final</td>

                <td>
                  {formatCurrency(
                    project.finalMxn,
                    "MXN"
                  )}
                </td>

                <td>
                  {formatCurrency(
                    project.finalUsd,
                    "USD"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="project-detail-list-section">
        <h2>Módulos del proyecto</h2>

        <div className="project-detail-table-container">
          <table className="project-modules-detail-table">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Tarifa USD/h</th>
                <th>Tarifa MXN/h</th>
                <th>Días</th>
                <th>Horas</th>
                <th>Total USD</th>
                <th>Total MXN</th>
              </tr>
            </thead>

            <tbody>
              {project.modules.map((module) => (
                <tr key={module.module}>
                  <td>{module.module}</td>

                  <td>
                    {formatCurrency(
                      module.hourlyRateUsd,
                      "USD"
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      module.hourlyRateMxn,
                      "MXN"
                    )}
                  </td>

                  <td>{module.days}</td>
                  <td>{module.hours}</td>

                  <td>
                    {formatCurrency(
                      module.totalUsd,
                      "USD"
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      module.totalMxn,
                      "MXN"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="project-detail-list-section">
        <h2>Fases del proyecto</h2>

        {project.phases.length > 0 ? (
          <div className="project-detail-table-container">
            <table className="project-phases-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fase</th>
                  <th>Días</th>
                  <th>%</th>
                  <th>Inicio</th>
                  <th>Estimado USD</th>
                  <th>Estimado MXN</th>
                  <th>Final USD</th>
                  <th>Final MXN</th>
                  <th>Fechas</th>
                </tr>
              </thead>

              <tbody>
                {project.phases.map((phase) => (
                  <tr key={phase.order}>
                    <td>{phase.order}</td>
                    <td>{phase.name}</td>
                    <td>{phase.days}</td>

                    <td>
                      {phase.percentage}%
                    </td>

                    <td>{phase.startDay}</td>

                    <td>
                      {formatCurrency(
                        phase.estimatedUsd,
                        "USD"
                      )}
                    </td>

                    <td>
                      {formatCurrency(
                        phase.estimatedMxn,
                        "MXN"
                      )}
                    </td>

                    <td>
                      {formatCurrency(
                        phase.finalUsd,
                        "USD"
                      )}
                    </td>

                    <td>
                      {formatCurrency(
                        phase.finalMxn,
                        "MXN"
                      )}
                    </td>

                    <td>{phase.dates}</td>
                  </tr>
                ))}

                <tr className="project-phase-total-row">
                  <td colSpan="2">Total</td>
                  <td>{phaseTotals.days}</td>

                  <td>
                    {phaseTotals.percentage}%
                  </td>

                  <td></td>

                  <td>
                    {formatCurrency(
                      phaseTotals.estimatedUsd,
                      "USD"
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      phaseTotals.estimatedMxn,
                      "MXN"
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      phaseTotals.finalUsd,
                      "USD"
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      phaseTotals.finalMxn,
                      "MXN"
                    )}
                  </td>

                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="project-detail-empty">
            No hay fases registradas para este
            proyecto.
          </div>
        )}
      </section>

      <section className="project-detail-list-section">
        <h2>Recursos planeados</h2>

        {project.resources.length > 0 ? (
          <div className="project-detail-table-container">
            <table className="project-resources-detail-table">
              <thead>
                <tr>
                  <th>Recurso</th>
                  <th>#</th>
                  <th>Tarifa USD/h</th>
                  <th>Tarifa MXN/h</th>
                  <th>Días</th>
                  <th>Horas</th>
                  <th>Total USD</th>
                  <th>Total MXN</th>
                  <th>Fechas</th>
                </tr>
              </thead>

              <tbody>
                {project.resources.map(
                  (resource) => (
                    <tr
                      key={`${resource.module}-${resource.number}`}
                    >
                      <td>{resource.module}</td>
                      <td>{resource.number}</td>

                      <td>
                        {formatCurrency(
                          resource.hourlyRateUsd,
                          "USD"
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          resource.hourlyRateMxn,
                          "MXN"
                        )}
                      </td>

                      <td>{resource.days}</td>
                      <td>{resource.hours}</td>

                      <td>
                        {formatCurrency(
                          resource.totalUsd,
                          "USD"
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          resource.totalMxn,
                          "MXN"
                        )}
                      </td>

                      <td>{resource.dates}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="project-detail-empty">
            No hay recursos planeados para este
            proyecto.
          </div>
        )}
      </section>
    </section>
  );
}

export default ProjectDetailPage;