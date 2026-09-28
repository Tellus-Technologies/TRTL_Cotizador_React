import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { teamMembers } from "../data/teamData";
import "../styles/team.css";

const calendarDays = [
  { day: 27, outside: true },
  { day: 28, outside: true },
  { day: 29, outside: true },
  { day: 30, outside: true },
  { day: 31, outside: true },
  { day: 1 },
  { day: 2 },

  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },

  { day: 10 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16 },

  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },

  { day: 24 },
  { day: 25 },
  { day: 26, today: true },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },

  { day: 31 },
  { day: 1, outside: true },
  { day: 2, outside: true },
  { day: 3, outside: true },
  { day: 4, outside: true },
  { day: 5, outside: true },
  { day: 6, outside: true },
];

const calendarEvents = [
  {
    id: 1,
    day: 3,
    title: "Seguimiento Vitafoods",
    type: "activity",
  },
  {
    id: 2,
    day: 5,
    title: "Vence TCK-415",
    type: "deadline",
  },
  {
    id: 3,
    day: 7,
    title: "Reunión TechNova",
    type: "meeting",
  },
  {
    id: 4,
    day: 10,
    title: "Capacitación completada",
    type: "completed",
  },
  {
    id: 5,
    day: 12,
    title: "Revisión de facturación",
    type: "pending",
  },
  {
    id: 6,
    day: 14,
    title: "Vence TCK-438",
    type: "deadline",
  },
  {
    id: 7,
    day: 18,
    title: "Revisión de avances",
    type: "pending",
  },
  {
    id: 8,
    day: 20,
    title: "Integración API Stripe",
    type: "activity",
  },
  {
    id: 9,
    day: 22,
    title: "Capacitación reportes",
    type: "activity",
  },
  {
    id: 10,
    day: 23,
    title: "Seguimiento facturación",
    type: "pending",
  },
  {
    id: 11,
    day: 25,
    title: "Vence TCK-420",
    type: "deadline",
  },
  {
    id: 12,
    day: 26,
    title: "CR-90 Seguimiento de tareas",
    type: "activity",
  },
  {
    id: 13,
    day: 26,
    title: "Revisión de accesos y permisos",
    type: "meeting",
  },
  {
    id: 14,
    day: 26,
    title: "Vence TCK-410",
    type: "deadline",
  },
  {
    id: 15,
    day: 28,
    title: "ISO revisión con Vitafoods",
    type: "activity",
  },
  {
    id: 16,
    day: 31,
    title: "Cierre mensual",
    type: "completed",
  },
];

const selectedDayEvents = [
  {
    id: 1,
    time: "09:00",
    type: "Actividad",
    status: "Planificada",
    title: "Seguimiento de tickets",
    description: "Revisión de pendientes del equipo",
    color: "blue",
  },
  {
    id: 2,
    time: "15:00",
    type: "Reunión",
    status: "Confirmada",
    title: "Revisión de accesos y permisos",
    description: "Mitsubishi Electric · Accesos",
    color: "purple",
  },
  {
    id: 3,
    time: "Todo el día",
    type: "Vencimiento",
    status: "Crítico",
    title: "TCK-410 · Acceso de nuevo usuario",
    description: "Vencimiento",
    color: "orange",
  },
];

function readStoredValue(key, fallbackValue) {
  try {
    const storedValue = sessionStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(
      `No fue posible leer ${key}:`,
      error
    );

    return fallbackValue;
  }
}

function loadTeamMembers() {
  const createdMembers = readStoredValue(
    "created-team-members",
    []
  );

  const memberOverrides = readStoredValue(
    "team-member-overrides",
    {}
  );

  const validCreatedMembers = Array.isArray(createdMembers)
    ? createdMembers
    : [];

  const validOverrides =
    memberOverrides &&
    typeof memberOverrides === "object" &&
    !Array.isArray(memberOverrides)
      ? memberOverrides
      : {};

  const allMembers = [
    ...teamMembers,
    ...validCreatedMembers,
  ];

  return allMembers.map((member) => {
    const override =
      validOverrides[member.slug] ||
      validOverrides[String(member.id)];

    if (!override) {
      return member;
    }

    return {
      ...member,
      ...override,
      id: member.id,
      slug: override.slug || member.slug,
    };
  });
}

function TeamCalendarPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState(26);
  const [view, setView] = useState("month");

  const members = useMemo(() => {
    return loadTeamMembers();
  }, [memberId]);

  const member = useMemo(() => {
    return members.find(
      (item) =>
        item.slug === memberId ||
        String(item.id) === String(memberId)
    );
  }, [memberId, members]);

  function handleMemberChange(event) {
    const selectedMember = members.find(
      (item) =>
        item.slug === event.target.value ||
        String(item.id) === event.target.value
    );

    if (!selectedMember) {
      return;
    }

    navigate(
      `/equipo/${selectedMember.slug}/calendario`
    );
  }

  if (!member) {
    return (
      <section className="team-calendar-page">
        <div className="team-profile-not-found">
          <h1>Integrante no encontrado</h1>

          <p>
            No fue posible cargar este calendario.
          </p>

          <button
            type="button"
            onClick={() => navigate("/equipo")}
          >
            Volver al equipo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="team-calendar-page">
      <div className="team-calendar-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/equipo")}
        >
          Equipo
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() =>
            navigate(`/equipo/${member.slug}`)
          }
        >
          {member.name}
        </button>

        <span>/</span>

        <strong>Calendario</strong>
      </div>

      <header className="team-calendar-header">
        <div>
          <h1>
            Calendario de {member.name}
          </h1>

          <p>
            Actividades, reuniones y vencimientos
            asignados
          </p>
        </div>
      </header>

      <section className="team-calendar-toolbar">
        <select
          value={member.slug}
          onChange={handleMemberChange}
          aria-label="Seleccionar integrante"
        >
          {members.map((teamMember) => (
            <option
              key={teamMember.id}
              value={teamMember.slug}
            >
              {teamMember.name}
            </option>
          ))}
        </select>

        <div className="team-calendar-views">
          <button
            type="button"
            className={
              view === "month" ? "is-active" : ""
            }
            onClick={() => setView("month")}
          >
            Mes
          </button>

          <button
            type="button"
            className={
              view === "week" ? "is-active" : ""
            }
            onClick={() => setView("week")}
          >
            Semana
          </button>

          <button
            type="button"
            className={
              view === "list" ? "is-active" : ""
            }
            onClick={() => setView("list")}
          >
            Lista
          </button>
        </div>
      </section>

      <section className="team-calendar-controls">
        <div className="team-calendar-filters">
          <select defaultValue="all">
            <option value="all">
              Tipo: Todos
            </option>
          </select>

          <select defaultValue="all">
            <option value="all">
              Proyecto: Todos
            </option>
          </select>

          <select defaultValue="all">
            <option value="all">
              Estado: Todos
            </option>
          </select>
        </div>

        <div className="team-calendar-navigation">
          <button
            type="button"
            onClick={() => setSelectedDay(26)}
          >
            Hoy
          </button>

          <button
            type="button"
            aria-label="Mes anterior"
          >
            <ChevronLeft size={14} />
          </button>

          <strong>Agosto 2026</strong>

          <button
            type="button"
            aria-label="Mes siguiente"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="team-calendar-legend">
          <span className="is-activity">
            <i />
            Actividad
          </span>

          <span className="is-meeting">
            <i />
            Reunión
          </span>

          <span className="is-deadline">
            <i />
            Vencimiento
          </span>

          <span className="is-completed">
            <i />
            Completada
          </span>
        </div>
      </section>

      <div className="team-calendar-layout">
        <div className="team-calendar-grid">
          {[
            "LUN",
            "MAR",
            "MIÉ",
            "JUE",
            "VIE",
            "SÁB",
            "DOM",
          ].map((dayName) => (
            <div
              className="team-calendar-weekday"
              key={dayName}
            >
              {dayName}
            </div>
          ))}

          {calendarDays.map(
            (calendarDay, index) => {
              const dayEvents =
                calendarDay.outside
                  ? []
                  : calendarEvents.filter(
                      (event) =>
                        event.day ===
                        calendarDay.day
                    );

              const isSelected =
                selectedDay === calendarDay.day &&
                !calendarDay.outside;

              return (
                <button
                  type="button"
                  className={`team-calendar-day ${
                    calendarDay.outside
                      ? "is-outside"
                      : ""
                  } ${
                    isSelected
                      ? "is-selected"
                      : ""
                  }`}
                  key={`${calendarDay.day}-${index}`}
                  onClick={() => {
                    if (!calendarDay.outside) {
                      setSelectedDay(
                        calendarDay.day
                      );
                    }
                  }}
                >
                  <span
                    className={
                      calendarDay.today
                        ? "is-today"
                        : ""
                    }
                  >
                    {calendarDay.day}
                  </span>

                  <div className="team-calendar-day-events">
                    {dayEvents
                      .slice(0, 3)
                      .map((event) => (
                        <div
                          className={`calendar-event is-${event.type}`}
                          key={event.id}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                </button>
              );
            }
          )}
        </div>

        <aside className="team-calendar-sidebar">
          <header>
            <h2>
              Día {selectedDay} de agosto
            </h2>

            <span>
              {selectedDay === 26
                ? `${selectedDayEvents.length} eventos`
                : "Sin eventos registrados"}
            </span>
          </header>

          <div className="team-calendar-event-list">
            {selectedDay === 26 ? (
              selectedDayEvents.map((event) => (
                <article
                  className={`team-calendar-event-card is-${event.color}`}
                  key={event.id}
                >
                  <div className="team-calendar-event-meta">
                    <span>{event.time}</span>
                    <span>{event.type}</span>
                    <span>{event.status}</span>
                  </div>

                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </article>
              ))
            ) : (
              <div className="team-calendar-empty-day">
                <p>
                  No hay eventos registrados para
                  este día.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default TeamCalendarPage;