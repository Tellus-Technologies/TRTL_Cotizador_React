import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialProjects = [
  {
    id: "4000000003",
    client: "Vitafoods",
    name: "Proyecto de prueba",
    methodology: "ASAP",
    startDate: "2026-09-18",
    endDate: "2026-10-06",
    subtotalMxn: 136512,
    discountMxn: 8190.72,
    finalMxn: 128321.28,
    finalUsd: 7520,
  },
  {
    id: "4000000002",
    client: "Vitafoods",
    name: "Proyecto Vita",
    methodology: "SAP Activate",
    startDate: "2026-06-08",
    endDate: "2026-10-01",
    subtotalMxn: 79440,
    discountMxn: 11916,
    finalMxn: 67524,
    finalUsd: 3957.57,
  },
  {
    id: "4000000001",
    client: "Mitsubishi",
    name: "Proyecto de soporte",
    methodology: "ITIL",
    startDate: "2026-04-21",
    endDate: "2026-05-31",
    subtotalMxn: 35760,
    discountMxn: 0,
    finalMxn: 35760,
    finalUsd: 2095.64,
  },
];

const emptyFilters = {
  client: "",
  projectNumber: "",
  methodology: "",
};

function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState(initialProjects);

  const [filters, setFilters] =
    useState(emptyFilters);

  const [appliedFilters, setAppliedFilters] =
    useState(emptyFilters);

  const filteredProjects = useMemo(() => {
    const normalizedNumber =
      appliedFilters.projectNumber
        .trim()
        .toLowerCase();

    return projects.filter((project) => {
      const matchesClient =
        !appliedFilters.client ||
        project.client ===
          appliedFilters.client;

      const matchesMethodology =
        !appliedFilters.methodology ||
        project.methodology ===
          appliedFilters.methodology;

      const matchesNumber =
        !normalizedNumber ||
        project.id
          .toLowerCase()
          .includes(normalizedNumber) ||
        project.name
          .toLowerCase()
          .includes(normalizedNumber);

      return (
        matchesClient &&
        matchesMethodology &&
        matchesNumber
      );
    });
  }, [projects, appliedFilters]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleApplyFilters(event) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  function handleClearFilters() {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  function handleViewProject(projectId) {
    navigate(`/proyectos/${projectId}`);
  }

  function handleDeleteProject(project) {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar el proyecto ${project.id} - ${project.name}?`
    );

    if (!shouldDelete) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter(
        (currentProject) =>
          currentProject.id !== project.id
      )
    );
  }

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
    }).format(new Date(`${value}T00:00:00`));
  }

  return (
  <section className="projects-list-card">
  <header className="projects-list-header">
    <div>
      <h1>Proyectos</h1>

      <p>
        Consulta los proyectos registrados y accede
        a su información detallada.
      </p>
    </div>
  </header>

      <section className="projects-list-content">
        <div className="projects-filters-heading">
          <h2>Filtros</h2>

          <span>
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
              ? "proyecto"
              : "proyectos"}
          </span>
        </div>

        <form
          className="projects-filters"
          onSubmit={handleApplyFilters}
        >
          <div className="projects-filter-field">
            <label htmlFor="projects-client">
              Cliente
            </label>

            <select
              id="projects-client"
              name="client"
              value={filters.client}
              onChange={handleFilterChange}
            >
              <option value="">
                Todos los clientes
              </option>

              <option value="Vitafoods">
                Vitafoods
              </option>

              <option value="Mitsubishi">
                Mitsubishi
              </option>

              <option value="Rehau">
                Rehau
              </option>

              <option value="Cotemar">
                Cotemar
              </option>
            </select>
          </div>

          <div className="projects-filter-field">
            <label htmlFor="project-number">
              Número o nombre
            </label>

            <div className="project-search-input">
              <Search size={14} />

              <input
                id="project-number"
                name="projectNumber"
                type="text"
                value={filters.projectNumber}
                onChange={handleFilterChange}
                placeholder="Número de proyecto"
              />
            </div>
          </div>

          <div className="projects-filter-field">
            <label htmlFor="projects-methodology">
              Metodología
            </label>

            <select
              id="projects-methodology"
              name="methodology"
              value={filters.methodology}
              onChange={handleFilterChange}
            >
              <option value="">
                Todas las metodologías
              </option>

              <option value="ASAP">ASAP</option>

              <option value="SAP Activate">
                SAP Activate
              </option>

              <option value="Agile">
                Agile
              </option>

              <option value="Scrum">
                Scrum
              </option>

              <option value="ITIL">ITIL</option>
            </select>
          </div>

          <div className="projects-filter-actions">
            <button
              type="submit"
              className="apply-project-filters"
            >
              Aplicar filtros
            </button>

            <button
              type="button"
              className="clear-project-filters"
              onClick={handleClearFilters}
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="projects-table-container">
          <table className="projects-list-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Nombre</th>
                <th>Metodología</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th className="project-number-column">
                  Subtotal MXN
                </th>
                <th className="project-number-column">
                  Descuento
                </th>
                <th className="project-number-column">
                  Total final MXN
                </th>
                <th className="project-number-column">
                  Total final USD
                </th>
                <th className="project-actions-column">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="project-id">
                    {project.id}
                  </td>

                  <td>{project.client}</td>

                  <td className="project-name">
                    {project.name}
                  </td>

                  <td>
                    <span className="project-methodology">
                      {project.methodology}
                    </span>
                  </td>

                  <td>
                    {formatDate(project.startDate)}
                  </td>

                  <td>
                    {formatDate(project.endDate)}
                  </td>

                  <td className="project-number-column">
                    {formatCurrency(
                      project.subtotalMxn,
                      "MXN"
                    )}
                  </td>

                  <td className="project-number-column">
                    {project.discountMxn > 0 ? (
                      <span className="project-discount">
                        -
                        {formatCurrency(
                          project.discountMxn,
                          "MXN"
                        )}
                      </span>
                    ) : (
                      <span className="project-no-discount">
                        N/A
                      </span>
                    )}
                  </td>

                  <td className="project-number-column project-final-amount">
                    {formatCurrency(
                      project.finalMxn,
                      "MXN"
                    )}
                  </td>

                  <td className="project-number-column project-final-amount">
                    {formatCurrency(
                      project.finalUsd,
                      "USD"
                    )}
                  </td>

                  <td>
                    <div className="project-row-actions">
                      <button
                        type="button"
                        className="view-project-button"
                        onClick={() =>
                          handleViewProject(project.id)
                        }
                        aria-label={`Ver proyecto ${project.id}`}
                        title="Ver detalle"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        className="delete-project-button"
                        onClick={() =>
                          handleDeleteProject(project)
                        }
                        aria-label={`Eliminar proyecto ${project.id}`}
                        title="Eliminar proyecto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan="11"
                    className="projects-empty-message"
                  >
                    No se encontraron proyectos con
                    los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default ProjectsPage;