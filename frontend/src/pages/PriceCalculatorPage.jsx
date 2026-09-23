import { useMemo, useState } from "react";
import {
  ChevronDown,
  Info,
  RefreshCw,
} from "lucide-react";

const exchangeRateDefault = 17.064;
const hoursPerDay = 8;

const sapModules = [
  { id: "FI", hourlyRateUsd: 100 },
  { id: "CO", hourlyRateUsd: 95 },
  { id: "MM", hourlyRateUsd: 90 },
  { id: "SD", hourlyRateUsd: 100 },
  { id: "PM", hourlyRateUsd: 90 },
  { id: "WM", hourlyRateUsd: 85 },
  { id: "ABAP", hourlyRateUsd: 110 },
  { id: "BTP", hourlyRateUsd: 120 },
];

const planningDays = [
  { id: 1, abbreviation: "M", number: 1 },
  { id: 2, abbreviation: "J", number: 2 },
  { id: 3, abbreviation: "V", number: 3 },
  { id: 4, abbreviation: "L", number: 4 },
  { id: 5, abbreviation: "M", number: 5 },
  { id: 6, abbreviation: "M", number: 6 },
  { id: 7, abbreviation: "J", number: 7 },
];

const methodologyConfigurations = {
  asap: {
    name: "Metodología ASAP",
    phases: [
      "Fase 1: Preparación del proyecto",
      "Fase 2: Planes de negocio",
      "Fase 3: Realización",
      "Fase 4: Preparación final",
      "Fase 5: Go Live",
    ],
  },
  activate: {
    name: "Metodología SAP Activate",
    phases: ["Discover", "Prepare", "Explore", "Realize", "Deploy", "Run"],
  },
  agile: {
    name: "Metodología Agile",
    phases: ["Planeación", "Diseño", "Desarrollo", "Pruebas", "Entrega"],
  },
  scrum: {
    name: "Metodología Scrum",
    phases: ["Product Backlog", "Sprint Planning", "Sprint", "Sprint Review", "Retrospectiva"],
  },
  itil: {
    name: "Metodología ITIL",
    phases: ["Estrategia", "Diseño", "Transición", "Operación", "Mejora continua"],
  },
};

const asapInitialDays = [
  [1, 2, 3, 4, 5],
  [6, 7, 8],
  [9, 10],
  [11, 12],
  [13],
];

function createPhasePlans(methodologyId, totalDays) {
  const phases = methodologyConfigurations[methodologyId].phases;

  return phases.map((name, index) => ({
    id: `${methodologyId}-${index + 1}`,
    name,
    percentage: Number((100 / phases.length).toFixed(2)),
    days:
      methodologyId === "asap"
        ? (asapInitialDays[index] ?? []).filter((day) => day <= totalDays)
        : [],
  }));
}

const initialModuleSelections = sapModules.reduce(
  (selections, module) => ({
    ...selections,
    [module.id]: {
      selected: module.id === "FI",
      quantity: 1,
    },
  }),
  {}
);

const initialResourcePlans = {
  "FI-1": [1, 2, 3, 4],
};

function calculateBusinessDays(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(
    `${startDate}T00:00:00`
  );

  const end = new Date(
    `${endDate}T00:00:00`
  );

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return 0;
  }

  let total = 0;
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const day = currentDate.getDay();

    if (day !== 0 && day !== 6) {
      total += 1;
    }

    currentDate.setDate(
      currentDate.getDate() + 1
    );
  }

  return total;
}

function PriceCalculatorPage() {
  const [projectData, setProjectData] =
    useState({
      name: "Proyecto de prueba",
      client: "vitafoods",
      startDate: "2026-09-18",
      endDate: "2026-10-06",
    });

  const [exchangeRate, setExchangeRate] =
    useState(exchangeRateDefault);

  const [
    exchangeRateDate,
    setExchangeRateDate,
  ] = useState("18/09/2026");

  const [
    moduleSelections,
    setModuleSelections,
  ] = useState(initialModuleSelections);

  const [resourcePlans, setResourcePlans] =
    useState(initialResourcePlans);

  const [showModuleList, setShowModuleList] =
    useState(false);

  const [discountType, setDiscountType] =
    useState("percentage");

  const [discountValue, setDiscountValue] =
    useState("");

  const [methodology, setMethodology] =
    useState("asap");

  const [phasePlans, setPhasePlans] =
    useState(() => createPhasePlans("asap", 13));

  const [projectComment, setProjectComment] =
    useState("");

  const businessDays = useMemo(
    () =>
      calculateBusinessDays(
        projectData.startDate,
        projectData.endDate
      ),
    [
      projectData.startDate,
      projectData.endDate,
    ]
  );

  const selectedModules = useMemo(
    () =>
      sapModules.filter(
        (module) =>
          moduleSelections[module.id]
            ?.selected
      ),
    [moduleSelections]
  );

  const availableModules = useMemo(
    () =>
      sapModules.filter(
        (module) =>
          !moduleSelections[module.id]
            ?.selected
      ),
    [moduleSelections]
  );

  const plannedResources = useMemo(() => {
    return selectedModules.flatMap(
      (module) => {
        const quantity =
          moduleSelections[module.id]
            ?.quantity ?? 1;

        return Array.from(
          { length: quantity },
          (_, index) => ({
            key: `${module.id}-${index + 1}`,
            moduleId: module.id,
            resourceNumber: index + 1,
            hourlyRateUsd:
              module.hourlyRateUsd,
          })
        );
      }
    );
  }, [
    selectedModules,
    moduleSelections,
  ]);

  const resourceCalculations =
    useMemo(() => {
      return plannedResources.map(
        (resource) => {
          const selectedDays =
            resourcePlans[resource.key] ??
            [];

          const days =
            selectedDays.length;

          const hours =
            days * hoursPerDay;

          const hourlyRateMxn =
            resource.hourlyRateUsd *
            exchangeRate;

          const totalUsd =
            resource.hourlyRateUsd *
            hours;

          const totalMxn =
            totalUsd * exchangeRate;

          return {
            ...resource,
            selectedDays,
            days,
            hours,
            hourlyRateMxn,
            totalUsd,
            totalMxn,
          };
        }
      );
    }, [
      plannedResources,
      resourcePlans,
      exchangeRate,
    ]);

  const calculations = useMemo(() => {
    const totalDays =
      resourceCalculations.reduce(
        (total, resource) =>
          total + resource.days,
        0
      );

    const totalHours =
      resourceCalculations.reduce(
        (total, resource) =>
          total + resource.hours,
        0
      );

    const estimatedUsd =
      resourceCalculations.reduce(
        (total, resource) =>
          total + resource.totalUsd,
        0
      );

    const estimatedMxn =
      resourceCalculations.reduce(
        (total, resource) =>
          total + resource.totalMxn,
        0
      );

    const numericDiscount = Math.max(
      0,
      Number(discountValue) || 0
    );

    let discountMxn = 0;

    if (
      discountType === "percentage"
    ) {
      const percentage = Math.min(
        numericDiscount,
        100
      );

      discountMxn =
        estimatedMxn *
        (percentage / 100);
    } else {
      discountMxn = Math.min(
        numericDiscount,
        estimatedMxn
      );
    }

    const discountUsd =
      exchangeRate > 0
        ? discountMxn / exchangeRate
        : 0;

    return {
      totalDays,
      totalHours,
      estimatedUsd,
      estimatedMxn,
      discountUsd,
      discountMxn,
      finalUsd:
        estimatedUsd - discountUsd,
      finalMxn:
        estimatedMxn - discountMxn,
    };
  }, [
    resourceCalculations,
    discountType,
    discountValue,
    exchangeRate,
  ]);

  const selectedMethodology =
    methodologyConfigurations[
      methodology
    ] ??
    methodologyConfigurations.asap;

  const methodologyPlanningDays = useMemo(
    () =>
      Array.from(
        { length: businessDays },
        (_, index) => index + 1
      ),
    [businessDays]
  );

  const phaseFinancialSummary = useMemo(
    () =>
      phasePlans.map((phase) => {
        const factor = (Number(phase.percentage) || 0) / 100;

        return {
          ...phase,
          estimatedMxn: calculations.estimatedMxn * factor,
          estimatedUsd: calculations.estimatedUsd * factor,
          finalMxn: calculations.finalMxn * factor,
          finalUsd: calculations.finalUsd * factor,
        };
      }),
    [phasePlans, calculations]
  );

  const phasePercentageTotal = useMemo(
    () =>
      phasePlans.reduce(
        (total, phase) => total + (Number(phase.percentage) || 0),
        0
      ),
    [phasePlans]
  );

  const assignedPhaseDays = useMemo(
    () =>
      new Set(phasePlans.flatMap((phase) => phase.days)).size,
    [phasePlans]
  );

  function formatCurrency(
    value,
    currency
  ) {
    return new Intl.NumberFormat(
      "es-MX",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value);
  }

  function handleProjectChange(event) {
    const { name, value } =
      event.target;

    setProjectData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleModuleSelection(
    moduleId
  ) {
    const nextSelected =
      !moduleSelections[moduleId]
        .selected;

    setModuleSelections(
      (currentSelections) => ({
        ...currentSelections,
        [moduleId]: {
          ...currentSelections[
            moduleId
          ],
          selected: nextSelected,
        },
      })
    );

    if (nextSelected) {
      const firstResourceKey =
        `${moduleId}-1`;

      setResourcePlans(
        (currentPlans) => ({
          ...currentPlans,
          [firstResourceKey]:
            currentPlans[
              firstResourceKey
            ] ?? [],
        })
      );
    }
  }

  function handleModuleQuantity(
    moduleId,
    event
  ) {
    const quantity = Math.max(
      1,
      Math.floor(
        Number(event.target.value) ||
          1
      )
    );

    setModuleSelections(
      (currentSelections) => ({
        ...currentSelections,
        [moduleId]: {
          ...currentSelections[
            moduleId
          ],
          quantity,
        },
      })
    );

    setResourcePlans(
      (currentPlans) => {
        const nextPlans = {
          ...currentPlans,
        };

        for (
          let number = 1;
          number <= quantity;
          number += 1
        ) {
          const resourceKey =
            `${moduleId}-${number}`;

          if (!nextPlans[resourceKey]) {
            nextPlans[resourceKey] =
              [];
          }
        }

        Object.keys(
          nextPlans
        ).forEach((resourceKey) => {
          if (
            resourceKey.startsWith(
              `${moduleId}-`
            )
          ) {
            const resourceNumber =
              Number(
                resourceKey.split(
                  "-"
                )[1]
              );

            if (
              resourceNumber >
              quantity
            ) {
              delete nextPlans[
                resourceKey
              ];
            }
          }
        });

        return nextPlans;
      }
    );
  }

  function toggleResourceDay(
    resourceKey,
    dayId
  ) {
    setResourcePlans(
      (currentPlans) => {
        const selectedDays =
          currentPlans[
            resourceKey
          ] ?? [];

        const isSelected =
          selectedDays.includes(
            dayId
          );

        return {
          ...currentPlans,
          [resourceKey]:
            isSelected
              ? selectedDays.filter(
                  (selectedDay) =>
                    selectedDay !==
                    dayId
                )
              : [
                  ...selectedDays,
                  dayId,
                ].sort(
                  (
                    firstDay,
                    secondDay
                  ) =>
                    firstDay -
                    secondDay
                ),
        };
      }
    );
  }

  function clearResourceDays(
    resourceKey
  ) {
    setResourcePlans(
      (currentPlans) => ({
        ...currentPlans,
        [resourceKey]: [],
      })
    );
  }

  function handleUpdateExchangeRate() {
    setExchangeRate(
      exchangeRateDefault
    );

    setExchangeRateDate(
      new Intl.DateTimeFormat(
        "es-MX"
      ).format(new Date())
    );
  }

  function handleMethodologyChange(event) {
    const nextMethodology = event.target.value;

    setMethodology(nextMethodology);
    setPhasePlans(
      createPhasePlans(nextMethodology, businessDays)
    );
  }

 function togglePhaseDay(phaseId, dayNumber) {
  setPhasePlans((currentPlans) =>
    currentPlans.map((phase) => {
      if (phase.id !== phaseId) {
        return phase;
      }

      const isSelected =
        phase.days.includes(dayNumber);

      return {
        ...phase,
        days: isSelected
          ? phase.days.filter(
              (day) => day !== dayNumber
            )
          : [...phase.days, dayNumber].sort(
              (firstDay, secondDay) =>
                firstDay - secondDay
            ),
      };
    })
  );
}

  function clearPhaseDays(phaseId) {
    setPhasePlans((currentPlans) =>
      currentPlans.map((phase) =>
        phase.id === phaseId ? { ...phase, days: [] } : phase
      )
    );
  }

  function handlePhasePercentage(phaseId, value) {
    const percentage = Math.min(100, Math.max(0, Number(value) || 0));

    setPhasePlans((currentPlans) =>
      currentPlans.map((phase) =>
        phase.id === phaseId ? { ...phase, percentage } : phase
      )
    );
  }

  function handleSaveProject() {
    if (!projectData.name.trim()) {
      window.alert("Ingresa el nombre del proyecto.");
      return;
    }

    if (plannedResources.length === 0) {
      window.alert("Selecciona al menos un recurso.");
      return;
    }

    if (Math.abs(phasePercentageTotal - 100) > 0.01) {
      window.alert("El porcentaje total de las fases debe sumar 100%.");
      return;
    }

    if (assignedPhaseDays !== businessDays) {
      window.alert(
        `Debes asignar los ${businessDays} días de planeación entre las fases.`
      );
      return;
    }

    window.alert("Proyecto guardado correctamente.");
  }

  function renderModuleCard(module) {
    const selection =
      moduleSelections[module.id];

    return (
      <div
        key={module.id}
        className={`project-resource-card ${
          selection.selected
            ? "is-selected"
            : ""
        }`}
      >
        <div className="project-resource-information">
          <input
            id={`resource-${module.id}`}
            type="checkbox"
            checked={selection.selected}
            onChange={() =>
              handleModuleSelection(
                module.id
              )
            }
            className="project-resource-checkbox"
          />

          <label
            htmlFor={`resource-${module.id}`}
            className="project-resource-label"
          >
            {module.id} /{" "}
            {formatCurrency(
              module.hourlyRateUsd,
              "USD"
            )}
            /h
          </label>

          <span
            className={`project-selected-badge ${
              !selection.selected
                ? "is-not-selected"
                : ""
            }`}
          >
            {selection.selected
              ? "Seleccionado"
              : "No seleccionado"}
          </span>
        </div>

        <div className="project-resource-quantity">
          <label
            htmlFor={`quantity-${module.id}`}
          >
            Cantidad:
          </label>

          <input
            id={`quantity-${module.id}`}
            type="number"
            min="1"
            value={selection.quantity}
            onChange={(event) =>
              handleModuleQuantity(
                module.id,
                event
              )
            }
            disabled={
              !selection.selected
            }
          />
        </div>
      </div>
    );
  }

  return (
    <section className="price-calculator-page">
      <section className="price-project-setup">
        <h1>
          Cálculo del precio del proyecto
        </h1>

        <div className="price-project-fields">
          <div className="price-form-field">
            <label htmlFor="project-name">
              Nombre del proyecto
            </label>

            <input
              id="project-name"
              name="name"
              type="text"
              value={projectData.name}
              onChange={
                handleProjectChange
              }
            />
          </div>

          <div className="price-form-field">
            <label htmlFor="project-client">
              Cliente
            </label>

            <select
              id="project-client"
              name="client"
              value={projectData.client}
              onChange={
                handleProjectChange
              }
            >
              <option value="vitafoods">
                Vitafoods
              </option>

              <option value="mitsubishi">
                Mitsubishi
              </option>

              <option value="rehau">
                Rehau
              </option>

              <option value="cotemar">
                Cotemar
              </option>
            </select>
          </div>


          <div className="price-form-field">
            <label htmlFor="start-date">
              Fecha de inicio
            </label>

            <input
              id="start-date"
              name="startDate"
              type="date"
              value={
                projectData.startDate
              }
              onChange={
                handleProjectChange
              }
            />
          </div>

          <div className="price-form-field">
            <label htmlFor="end-date">
              Fecha de fin
            </label>

            <input
              id="end-date"
              name="endDate"
              type="date"
              min={
                projectData.startDate
              }
              value={
                projectData.endDate
              }
              onChange={
                handleProjectChange
              }
            />
          </div>
        </div>

        <div className="price-project-indicators">
          <span>
            Días hábiles:{" "}
            <strong>
              {businessDays}
            </strong>
          </span>

          <span>
            Días para planeación:{" "}
            <strong>
              {businessDays}
            </strong>
          </span>
        </div>

        <div className="price-exchange-row">
          <div className="price-form-field">
            <label htmlFor="exchange-rate">
              Tipo de cambio actual
              (MXN/USD)
            </label>

            <input
              id="exchange-rate"
              type="number"
              min="0.01"
              step="0.0001"
              value={exchangeRate}
              onChange={(event) =>
                setExchangeRate(
                  Math.max(
                    0,
                    Number(
                      event.target
                        .value
                    ) || 0
                  )
                )
              }
            />
          </div>

          <button
            type="button"
            className="price-exchange-button"
            onClick={
              handleUpdateExchangeRate
            }
          >
            <RefreshCw size={14} />
            Actualizar tipo de cambio
          </button>

          <span className="price-exchange-date">
            Fecha de referencia:{" "}
            {exchangeRateDate}
          </span>
        </div>
      </section>

      <section className="price-resource-section">
        <h2>
          Planeación de recursos
        </h2>

        <p className="projects-instruction">
          Selecciona los recursos y captura
          la cantidad requerida:
        </p>

        <div className="price-modules-selector">
          <div className="price-selected-modules">
            {selectedModules.length >
            0 ? (
              selectedModules.map(
                (module) =>
                  renderModuleCard(
                    module
                  )
              )
            ) : (
              <div className="price-no-modules">
                No hay módulos
                seleccionados.
              </div>
            )}
          </div>

          <button
            type="button"
            className={`show-modules-button ${
              showModuleList
                ? "is-open"
                : ""
            }`}
            onClick={() =>
              setShowModuleList(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={
              showModuleList
            }
          >
            <span>
              {showModuleList
                ? "Ocultar módulos disponibles"
                : "Agregar módulos"}
            </span>

            <ChevronDown size={16} />
          </button>

          {showModuleList && (
            <div className="available-modules-dropdown">
              {availableModules.map(
                (module) =>
                  renderModuleCard(
                    module
                  )
              )}

              {availableModules.length ===
                0 && (
                <p className="all-modules-selected">
                  Todos los módulos están
                  seleccionados.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="projects-metrics">
          <div className="project-metric">
            Módulos:{" "}
            <strong>
              {
                selectedModules.length
              }
            </strong>
          </div>

          <div className="project-metric">
            Recursos:{" "}
            <strong>
              {
                plannedResources.length
              }
            </strong>
          </div>

          <div className="project-metric">
            Días:{" "}
            <strong>
              {
                calculations.totalDays
              }
            </strong>
          </div>

          <div className="project-metric">
            Horas:{" "}
            <strong>
              {
                calculations.totalHours
              }
            </strong>
          </div>

          <div className="project-metric is-highlighted">
            Estimado USD:{" "}
            <strong>
              {formatCurrency(
                calculations.estimatedUsd,
                "USD"
              )}
            </strong>
          </div>

          <div className="project-metric is-highlighted">
            Estimado MXN:{" "}
            <strong>
              {formatCurrency(
                calculations.estimatedMxn,
                "MXN"
              )}
            </strong>
          </div>
        </div>

        <p className="projects-instruction">
          Planeación: asigna los días de
          cada recurso. La parte izquierda
          permanece fija.
        </p>

        <div className="project-planning-container">
          <table className="project-planning-table">
            <thead>
              <tr className="project-weeks-row">
                <th
                  rowSpan="2"
                  className="project-resource-column"
                >
                  Recurso
                </th>

                <th
                  rowSpan="2"
                  className="project-actions-column"
                >
                  Acciones
                </th>

                <th colSpan="5">
                  Semana 1
                </th>

                <th colSpan="2">
                  Semana 2
                </th>
              </tr>

              <tr className="project-days-row">
                {planningDays.map(
                  (day) => (
                    <th key={day.id}>
                      <span>
                        {
                          day.abbreviation
                        }
                      </span>

                      <strong>
                        {day.number}
                      </strong>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {plannedResources.map(
                (resource) => {
                  const selectedDays =
                    resourcePlans[
                      resource.key
                    ] ?? [];

                  return (
                    <tr
                      key={
                        resource.key
                      }
                    >
                      <td className="project-resource-name">
                        {
                          resource.moduleId
                        }{" "}
                        #
                        {
                          resource.resourceNumber
                        }
                      </td>

                      <td className="project-actions-cell">
                        <button
                          type="button"
                          className="project-clear-button"
                          onClick={() =>
                            clearResourceDays(
                              resource.key
                            )
                          }
                          disabled={
                            selectedDays.length ===
                            0
                          }
                        >
                          Limpiar
                        </button>
                      </td>

                      {planningDays.map(
                        (day) => {
                          const isActive =
                            selectedDays.includes(
                              day.id
                            );

                          return (
                            <td
                              key={
                                day.id
                              }
                              className="project-day-cell"
                            >
                              <button
                                type="button"
                                className={`project-day-button ${
                                  isActive
                                    ? "is-active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleResourceDay(
                                    resource.key,
                                    day.id
                                  )
                                }
                                aria-pressed={
                                  isActive
                                }
                              />
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                }
              )}

              {plannedResources.length ===
                0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="price-empty-message"
                  >
                    Selecciona al menos
                    un módulo para
                    comenzar la
                    planeación.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="price-information">
        <Info size={17} />

        <span>
          Resumen de costos: se actualiza
          automáticamente con los días y
          descuentos seleccionados.
        </span>
      </div>

      <div className="price-table-container">
        <table className="price-summary-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Recurso</th>

              <th className="align-right">
                Tarifa USD/h
              </th>

              <th className="align-right">
                Tarifa MXN/h
              </th>

              <th className="align-center">
                Días
              </th>

              <th className="align-center">
                Horas
              </th>

              <th className="align-right">
                Total USD
              </th>

              <th className="align-right">
                Total MXN
              </th>
            </tr>
          </thead>

          <tbody>
            {resourceCalculations.map(
              (resource, index) => (
                <tr key={resource.key}>
                  <td>{index + 1}</td>

                  <td className="price-resource">
                    {
                      resource.moduleId
                    }{" "}
                    #
                    {
                      resource.resourceNumber
                    }
                  </td>

                  <td className="align-right">
                    {formatCurrency(
                      resource.hourlyRateUsd,
                      "USD"
                    )}
                  </td>

                  <td className="align-right">
                    {formatCurrency(
                      resource.hourlyRateMxn,
                      "MXN"
                    )}
                  </td>

                  <td className="align-center">
                    {resource.days}
                  </td>

                  <td className="align-center">
                    {resource.hours}
                  </td>

                  <td className="align-right">
                    {formatCurrency(
                      resource.totalUsd,
                      "USD"
                    )}
                  </td>

                  <td className="align-right">
                    {formatCurrency(
                      resource.totalMxn,
                      "MXN"
                    )}
                  </td>
                </tr>
              )
            )}

            <tr className="price-total-row">
              <td></td>
              <td>Total estimado</td>
              <td></td>
              <td></td>

              <td className="align-center">
                {
                  calculations.totalDays
                }
              </td>

              <td className="align-center">
                {
                  calculations.totalHours
                }
              </td>

              <td className="align-right">
                {formatCurrency(
                  calculations.estimatedUsd,
                  "USD"
                )}
              </td>

              <td className="align-right">
                {formatCurrency(
                  calculations.estimatedMxn,
                  "MXN"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="discount-card">
        <h2>Descuento</h2>

        <div className="discount-fields">
          <div className="price-form-field">
            <label htmlFor="discount-type">
              Tipo de descuento
            </label>

            <select
              id="discount-type"
              value={discountType}
              onChange={(event) => {
                setDiscountType(
                  event.target.value
                );

                setDiscountValue("");
              }}
            >
              <option value="percentage">
                Porcentaje
              </option>

              <option value="fixed">
                Monto fijo en MXN
              </option>
            </select>
          </div>

          <div className="price-form-field">
            <label htmlFor="discount-value">
              {discountType ===
              "percentage"
                ? "Descuento (%)"
                : "Descuento (MXN)"}
            </label>

            <input
              id="discount-value"
              type="number"
              min="0"
              max={
                discountType ===
                "percentage"
                  ? 100
                  : calculations.estimatedMxn
              }
              step={
                discountType ===
                "percentage"
                  ? "1"
                  : "0.01"
              }
              value={discountValue}
              onChange={(event) =>
                setDiscountValue(
                  event.target.value
                )
              }
              placeholder={
                discountType ===
                "percentage"
                  ? "Descuento (%)"
                  : "Monto en MXN"
              }
            />
          </div>
        </div>
      </section>

      <section className="final-price-section">
        <p>
          Resumen final del precio:
        </p>

        <div className="price-table-container">
          <table className="final-price-table">
            <thead>
              <tr>
                <th>Concepto</th>

                <th className="align-right">
                  MXN
                </th>

                <th className="align-right">
                  USD
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Total estimado</td>

                <td className="align-right">
                  {formatCurrency(
                    calculations.estimatedMxn,
                    "MXN"
                  )}
                </td>

                <td className="align-right">
                  {formatCurrency(
                    calculations.estimatedUsd,
                    "USD"
                  )}
                </td>
              </tr>

              <tr>
                <td>Descuento</td>

                <td className="align-right">
                  {discountValue
                    ? formatCurrency(
                        calculations.discountMxn,
                        "MXN"
                      )
                    : "N/A"}
                </td>

                <td className="align-right">
                  {discountValue
                    ? formatCurrency(
                        calculations.discountUsd,
                        "USD"
                      )
                    : "N/A"}
                </td>
              </tr>

              <tr className="final-total-row">
                <td>Total final</td>

                <td className="align-right">
                  {formatCurrency(
                    calculations.finalMxn,
                    "MXN"
                  )}
                </td>

                <td className="align-right">
                  {formatCurrency(
                    calculations.finalUsd,
                    "USD"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="project-configuration">
        <h2>
          Configuración del proyecto
        </h2>

        <div className="price-form-field methodology-field">
          <label htmlFor="methodology">
            Metodología
          </label>

          <select
            id="methodology"
            value={methodology}
            onChange={handleMethodologyChange}
          >
            <option value="asap">
              Metodología ASAP
            </option>

            <option value="activate">
              Metodología SAP Activate
            </option>

            <option value="agile">
              Metodología Agile
            </option>

            <option value="scrum">
              Metodología Scrum
            </option>

            <option value="itil">
              Metodología ITIL
            </option>
          </select>
        </div>

        <h3>
          {selectedMethodology.name}
        </h3>

        <p>
          Planeación de fases: asigna los
          días de cada fase. La parte
          izquierda permanece fija.
        </p>

        <div className="price-table-container gantt-container">
          <table className="project-gantt-table complete-gantt-table">
            <thead>
              <tr className="gantt-weeks-row">
                <th colSpan="4"></th>
                {Array.from(
                  { length: Math.ceil(businessDays / 5) },
                  (_, weekIndex) => {
                    const remainingDays = businessDays - weekIndex * 5;
                    return (
                      <th
                        key={weekIndex}
                        colSpan={Math.min(5, remainingDays)}
                      >
                        Semana {weekIndex + 1}
                      </th>
                    );
                  }
                )}
              </tr>

              <tr>
                <th>Etapa</th>
                <th>Inicio</th>
                <th>Días</th>
                <th>Acción</th>
                {methodologyPlanningDays.map((day) => (
                  <th key={day} className="gantt-day">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {phasePlans.map((phase) => {
                const firstDay = phase.days.length > 0
                  ? Math.min(...phase.days)
                  : null;

                return (
                  <tr key={phase.id}>
                    <td className="gantt-phase-name">{phase.name}</td>
                    <td>{firstDay ? `Día ${firstDay}` : "Sin asignar"}</td>
                    <td>{phase.days.length}</td>
                    <td>
                      <button
                        type="button"
                        className="project-clear-button"
                        onClick={() => clearPhaseDays(phase.id)}
                        disabled={phase.days.length === 0}
                      >
                        Limpiar
                      </button>
                    </td>

                    {methodologyPlanningDays.map((day) => {
                      const isActive = phase.days.includes(day);

                      return (
                        <td key={day} className="gantt-timeline-cell">
                          <button
                            type="button"
                            className={`phase-day-button ${isActive ? "is-active" : ""}`}
                            onClick={() => togglePhaseDay(phase.id, day)}
                            aria-label={`${isActive ? "Quitar" : "Asignar"} día ${day} de ${phase.name}`}
                            aria-pressed={isActive}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="phase-financial-instruction">
          Resumen financiero por fase: asigna el porcentaje y revisa los importes estimados y finales.
        </p>

        <div className="price-table-container">
          <table className="phase-financial-table">
            <thead>
              <tr>
                <th>Fase</th>
                <th className="align-center">%</th>
                <th className="align-center">Días</th>
                <th className="align-right">Estimado MXN</th>
                <th className="align-right">Estimado USD</th>
                <th className="align-right">Final desc. MXN</th>
                <th className="align-right">Final desc. USD</th>
              </tr>
            </thead>

            <tbody>
              {phaseFinancialSummary.map((phase) => (
                <tr key={phase.id}>
                  <td className="phase-summary-name">{phase.name}</td>
                  <td className="align-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={phase.percentage}
                      onChange={(event) =>
                        handlePhasePercentage(phase.id, event.target.value)
                      }
                      className="phase-percentage-input"
                    />
                  </td>
                  <td className="align-center">{phase.days.length}</td>
                  <td className="align-right">{formatCurrency(phase.estimatedMxn, "MXN")}</td>
                  <td className="align-right">{formatCurrency(phase.estimatedUsd, "USD")}</td>
                  <td className="align-right">{formatCurrency(phase.finalMxn, "MXN")}</td>
                  <td className="align-right">{formatCurrency(phase.finalUsd, "USD")}</td>
                </tr>
              ))}

              <tr className="phase-summary-total">
                <td>Total</td>
                <td className="align-center">{phasePercentageTotal.toFixed(2)}%</td>
                <td className="align-center">{assignedPhaseDays}</td>
                <td className="align-right">{formatCurrency(calculations.estimatedMxn, "MXN")}</td>
                <td className="align-right">{formatCurrency(calculations.estimatedUsd, "USD")}</td>
                <td className="align-right">{formatCurrency(calculations.finalMxn, "MXN")}</td>
                <td className="align-right">{formatCurrency(calculations.finalUsd, "USD")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="phase-summary-pills">
          <span>Días asignados: <strong>{assignedPhaseDays}</strong></span>
          <span>Porcentaje total: <strong>{phasePercentageTotal.toFixed(2)}%</strong></span>
          <span>Días hábiles: <strong>{businessDays}</strong></span>
          <span>Total estimado: <strong>{formatCurrency(calculations.estimatedMxn, "MXN")}</strong></span>
          <span className="is-final">Total final: <strong>{formatCurrency(calculations.finalMxn, "MXN")}</strong></span>
        </div>

        <div className="project-comment-field">
          <label htmlFor="project-comment">Comentario del proyecto</label>
          <textarea
            id="project-comment"
            value={projectComment}
            onChange={(event) => setProjectComment(event.target.value)}
            placeholder="Agrega observaciones o información adicional del proyecto..."
            rows="4"
          />
        </div>

        <div className="save-project-actions">
          <button
            type="button"
            className="save-project-button"
            onClick={handleSaveProject}
          >
            Guardar proyecto
          </button>
        </div>
      </section>
    </section>
  );
}

export default PriceCalculatorPage;
