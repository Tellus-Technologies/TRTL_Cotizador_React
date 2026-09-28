import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import { activitiesList } from "../data/activitiesData";
import "../styles/activities.css";

function ActivitiesPage() {
  const navigate = useNavigate();

  const [createdActivities] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("created-activities") || "[]"
      );
    } catch {
      return [];
    }
  });

  const allActivities = useMemo(
    () => [...createdActivities, ...activitiesList],
    [createdActivities]
  );

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("Todos");

  const [clientFilter, setClientFilter] =
    useState("Todos");

  const [responsibleFilter, setResponsibleFilter] =
    useState("Todos");

  const [typeFilter, setTypeFilter] =
    useState("Todos");

  const [periodFilter, setPeriodFilter] =
    useState("Todos");

  const [priorityFilter, setPriorityFilter] =
    useState("Todos");

  const [selectedActivities, setSelectedActivities] =
    useState([]);

  const clients = useMemo(() => {
    return [
      ...new Set(
        allActivities
          .map((activity) => activity.client)
          .filter(Boolean)
      ),
    ];
  }, [allActivities]);

  const responsibles = useMemo(() => {
    return [
      ...new Set(
        allActivities
          .map((activity) => activity.responsible)
          .filter(Boolean)
      ),
    ];
  }, [allActivities]);

  const types = useMemo(() => {
    return [
      ...new Set(
        allActivities
          .map((activity) => activity.type)
          .filter(Boolean)
      ),
    ];
  }, [allActivities]);

  const filteredActivities = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return allActivities.filter((activity) => {
      const folio = activity.folio || "";
      const activityName = activity.activity || "";
      const client = activity.client || "";
      const project = activity.project || "";
      const responsible = activity.responsible || "";

      const matchesTab =
        activeTab === "all" || activity.supportRequest;

      const matchesSearch =
        !cleanSearch ||
        folio.toLowerCase().includes(cleanSearch) ||
        activityName.toLowerCase().includes(cleanSearch) ||
        client.toLowerCase().includes(cleanSearch) ||
        project.toLowerCase().includes(cleanSearch) ||
        responsible.toLowerCase().includes(cleanSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        activity.status === statusFilter;

      const matchesClient =
        clientFilter === "Todos" ||
        activity.client === clientFilter;

      const matchesResponsible =
        responsibleFilter === "Todos" ||
        activity.responsible === responsibleFilter;

      const matchesType =
        typeFilter === "Todos" ||
        activity.type === typeFilter;

      const matchesPriority =
        priorityFilter === "Todos" ||
        activity.priority === priorityFilter;

      const matchesPeriod =
        periodFilter === "Todos" ||
        (periodFilter === "Septiembre 2026" &&
          (activity.startDate || "").includes("Sep"));

      return (
        matchesTab &&
        matchesSearch &&
        matchesStatus &&
        matchesClient &&
        matchesResponsible &&
        matchesType &&
        matchesPriority &&
        matchesPeriod
      );
    });
  }, [
    allActivities,
    activeTab,
    search,
    statusFilter,
    clientFilter,
    responsibleFilter,
    typeFilter,
    periodFilter,
    priorityFilter,
  ]);

  const supportRequestsTotal = allActivities.filter(
    (activity) => activity.supportRequest
  ).length;

  const allVisibleSelected =
    filteredActivities.length > 0 &&
    filteredActivities.every((activity) =>
      selectedActivities.includes(activity.id)
    );

  function toggleActivity(activityId) {
    setSelectedActivities((currentSelection) => {
      if (currentSelection.includes(activityId)) {
        return currentSelection.filter(
          (id) => id !== activityId
        );
      }

      return [...currentSelection, activityId];
    });
  }

  function toggleAllVisible() {
    const visibleIds = filteredActivities.map(
      (activity) => activity.id
    );

    if (allVisibleSelected) {
      setSelectedActivities((currentSelection) =>
        currentSelection.filter(
          (id) => !visibleIds.includes(id)
        )
      );

      return;
    }

    setSelectedActivities((currentSelection) => [
      ...new Set([
        ...currentSelection,
        ...visibleIds,
      ]),
    ]);
  }

  function clearFilters() {
    setStatusFilter("Todos");
    setClientFilter("Todos");
    setResponsibleFilter("Todos");
    setTypeFilter("Todos");
    setPeriodFilter("Todos");
    setPriorityFilter("Todos");
    setSearch("");
  }

  function getPriorityClass(priority) {
    const classes = {
      Baja: "is-low",
      Media: "is-medium",
      Alta: "is-high",
      Crítica: "is-critical",
    };

    return classes[priority] || "";
  }

  function getStatusClass(status) {
    const classes = {
      Nueva: "is-new",
      "En progreso": "is-progress",
      "En espera": "is-waiting",
      Completada: "is-completed",
      Planificada: "is-planned",
    };

    return classes[status] || "";
  }

  return (
    <section className="activities-page">
      <header className="activities-header">
        <div>
          <h1>Listado de Actividades</h1>

          <p>
            Consulta, filtra y administra las actividades
            registradas.
          </p>
        </div>

        <button
          type="button"
          className="activities-new-button"
          onClick={() => navigate("/actividades/nueva")}
        >
          <Plus size={15} strokeWidth={2} />
          Nueva actividad
        </button>
      </header>

      <section className="activities-filter-section">
        <div className="activities-filters">
          <label>
            <span>Estado</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Nueva</option>
              <option>En progreso</option>
              <option>En espera</option>
              <option>Planificada</option>
              <option>Completada</option>
            </select>
          </label>

          <label>
            <span>Cliente</span>

            <select
              value={clientFilter}
              onChange={(event) =>
                setClientFilter(event.target.value)
              }
            >
              <option>Todos</option>

              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Responsable</span>

            <select
              value={responsibleFilter}
              onChange={(event) =>
                setResponsibleFilter(event.target.value)
              }
            >
              <option>Todos</option>

              {responsibles.map((responsible) => (
                <option
                  key={responsible}
                  value={responsible}
                >
                  {responsible}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tipo</span>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
            >
              <option>Todos</option>

              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Periodo</span>

            <select
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Septiembre 2026</option>
            </select>
          </label>

          <label>
            <span>Prioridad</span>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option>Todos</option>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </label>

          <button
            type="button"
            className="activities-clear-button"
            onClick={clearFilters}
          >
            Limpiar
          </button>
        </div>
      </section>

      <section className="activities-content">
        <div className="activities-toolbar">
          <div className="activities-tabs">
            <button
              type="button"
              className={
                activeTab === "all" ? "is-active" : ""
              }
              onClick={() => setActiveTab("all")}
            >
              Todas
              <span>{allActivities.length}</span>
            </button>

            <button
              type="button"
              className={
                activeTab === "support"
                  ? "is-active"
                  : ""
              }
              onClick={() => setActiveTab("support")}
            >
              Solicitudes de apoyo
              <span>{supportRequestsTotal}</span>
            </button>
          </div>

          <label className="activities-search">
            <Search size={14} strokeWidth={1.8} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por folio o actividad..."
            />
          </label>
        </div>

        <div className="activities-table-container">
          <table className="activities-table">
            <thead>
              <tr>
                <th className="activities-checkbox-column">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    aria-label="Seleccionar actividades visibles"
                  />
                </th>

                <th>Folio</th>
                <th>Actividad</th>
                <th>Cliente/Proyecto</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Inicio</th>
                <th>Término</th>
              </tr>
            </thead>

            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="activities-checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(
                        activity.id
                      )}
                      onChange={() =>
                        toggleActivity(activity.id)
                      }
                      aria-label={`Seleccionar ${activity.folio}`}
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      className="activity-folio"
                      onClick={() =>
                        navigate(
                          `/actividades/${activity.folio}`
                        )
                      }
                    >
                      {activity.folio}
                    </button>
                  </td>

                  <td>
                    <strong className="activity-name">
                      {activity.activity}
                    </strong>
                  </td>

                  <td>
                    <div className="activity-client">
                      <strong>{activity.client}</strong>

                      <span>
                        {activity.project || "Sin proyecto"}
                      </span>
                    </div>
                  </td>

                  <td>{activity.type}</td>

                  <td>
                    <span
                      className={`activity-priority ${getPriorityClass(
                        activity.priority
                      )}`}
                    >
                      {activity.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`activity-status ${getStatusClass(
                        activity.status
                      )}`}
                    >
                      {activity.status}
                    </span>
                  </td>

                  <td>{activity.responsible}</td>
                  <td>{activity.startDate}</td>

                  <td
                    className={
                      activity.endDate === "09 Sep"
                        ? "activity-date-delayed"
                        : ""
                    }
                  >
                    {activity.endDate}
                  </td>
                </tr>
              ))}

              {filteredActivities.length === 0 && (
                <tr>
                  <td
                    colSpan="10"
                    className="activities-empty"
                  >
                    No se encontraron actividades con los
                    filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="activities-footer">
          <span>
            Mostrando {filteredActivities.length} de{" "}
            {allActivities.length} actividades
          </span>

          <div className="activities-pagination">
            <button
              type="button"
              aria-label="Página anterior"
              disabled
            >
              <ChevronLeft size={13} />
              Anterior
            </button>

            <button
              type="button"
              className="is-active"
            >
              1
            </button>

            <button type="button">2</button>
            <button type="button">3</button>

            <span>…</span>

            <button type="button">6</button>

            <button
              type="button"
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight size={13} />
            </button>
          </div>
        </footer>
      </section>
    </section>
  );
}

export default ActivitiesPage;