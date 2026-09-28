import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Ticket,
} from "lucide-react";

import TeamMemberModal from "../components/TeamMemberModal";
import { teamMembers } from "../data/teamData";
import "../styles/team.css";

const assignedTickets = [
  {
    folio: "TCK-415",
    subject: "Problemas con facturación",
    project: "Contabilidad Pro / Farmacéutico",
    priority: "Alta",
    status: "En progreso",
    dueDate: "14 Ago",
    days: "-3",
  },
  {
    folio: "TCK-407",
    subject: "Integración / Migración",
    project: "Contabilidad Pro / Farmacéutico",
    priority: "Media",
    status: "Completada",
    dueDate: "15 Ago",
    days: "-1",
  },
  {
    folio: "TCK-402",
    subject: "Reportar accesos erróneos",
    project: "Pedidos / Accesos",
    priority: "Alta",
    status: "Atrasado",
    dueDate: "10 Ago",
    days: "-8",
  },
  {
    folio: "TCK-401",
    subject: "Acceso de nuevo usuario",
    project: "Mitsubishi Electric / Accesos",
    priority: "Media",
    status: "Próxima",
    dueDate: "18 Ago",
    days: "+4",
  },
  {
    folio: "TCK-405",
    subject: "Revisión de impuestos fiscal",
    project: "Rehau / Pagos",
    priority: "Alta",
    status: "En progreso",
    dueDate: "16 Ago",
    days: "-2",
  },
  {
    folio: "TCK-406",
    subject: "Creación de módulo reportes",
    project: "GlobalFarma / Reportes",
    priority: "Baja",
    status: "Completada",
    dueDate: "20 Ago",
    days: "+6",
  },
  {
    folio: "TCK-408",
    subject: "Actualización de módulo reportes",
    project: "GlobalFarma / Reportes",
    priority: "Media",
    status: "Atrasado",
    dueDate: "12 Ago",
    days: "-6",
  },
  {
    folio: "TCK-409",
    subject: "Exportación de API en JSON",
    project: "VitaPark / Accesos",
    priority: "Baja",
    status: "En progreso",
    dueDate: "22 Ago",
    days: "+8",
  },
];

const recentActivities = [
  {
    title: "Migración de base de datos SQL",
    client: "Mitsubishi Norte",
    date: "Hoy · 14:30",
    status: "En progreso",
    priority: "Alta",
  },
  {
    title: "Actualización de seguridad web",
    client: "Infraestructura Central",
    date: "Hoy · 11:00",
    status: "Completada",
    priority: "Media",
  },
  {
    title: "Configuración de webhook de pagos",
    client: "Tienda Express",
    date: "Ayer",
    status: "Atrasado",
    priority: "Alta",
  },
  {
    title: "Diseño de interfaz de usuario móvil",
    client: "Clínica Sana",
    date: "12 Oct",
    status: "Próxima",
    priority: "Baja",
  },
];

const upcomingEvents = [
  {
    day: "15",
    month: "OCT",
    title: "Reunión de planificación Q3",
    time: "16:00 - 17:00",
  },
  {
    day: "18",
    month: "OCT",
    title: "Lanzamiento de producción V1.4",
    time: "09:00 - 10:30",
  },
  {
    day: "20",
    month: "OCT",
    title: "Revisión técnica de APIs",
    time: "11:30 - 12:30",
  },
  {
    day: "25",
    month: "OCT",
    title: "Entrega de proyecto Clínica Sana",
    time: "14:00 - 15:30",
  },
];

function loadMember(memberId) {
  let createdMembers = [];
  let memberOverrides = {};

  try {
    createdMembers = JSON.parse(
      sessionStorage.getItem("created-team-members") ||
        "[]"
    );

    memberOverrides = JSON.parse(
      sessionStorage.getItem("team-member-overrides") ||
        "{}"
    );
  } catch {
    createdMembers = [];
    memberOverrides = {};
  }

  const allMembers = [
    ...createdMembers,
    ...teamMembers,
  ];

  const foundMember = allMembers.find(
    (item) =>
      item.slug === memberId ||
      String(item.id) === String(memberId)
  );

  if (!foundMember) {
    return null;
  }

  return {
    ...foundMember,
    ...(memberOverrides[foundMember.slug] || {}),
  };
}

function UserProfilePage() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const initialMember = useMemo(
    () => loadMember(memberId),
    [memberId]
  );

  const [member, setMember] =
    useState(initialMember);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  function handleUpdateMember(updatedMember) {
    let memberOverrides = {};

    try {
      memberOverrides = JSON.parse(
        sessionStorage.getItem(
          "team-member-overrides"
        ) || "{}"
      );
    } catch {
      memberOverrides = {};
    }

    memberOverrides[updatedMember.slug] =
      updatedMember;

    sessionStorage.setItem(
      "team-member-overrides",
      JSON.stringify(memberOverrides)
    );

    setMember(updatedMember);
    setEditModalOpen(false);
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
      "En progreso": "is-progress",
      Completada: "is-completed",
      Atrasado: "is-delayed",
      Próxima: "is-next",
    };

    return classes[status] || "";
  }

  if (!member) {
    return (
      <section className="team-profile-page">
        <div className="team-profile-not-found">
          <h1>Integrante no encontrado</h1>

          <p>
            El perfil solicitado no está disponible.
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

  const capacity = Math.min(
    Math.round((member.activeTickets / 15) * 100),
    100
  );

  return (
    <section className="team-profile-page">
      <div className="team-profile-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/equipo")}
        >
          Equipo
        </button>

        <span>/</span>
        <strong>Perfil de usuario</strong>
      </div>

      <header className="team-profile-header">
        <h1>Perfil de usuario</h1>

        <button
          type="button"
          className="team-profile-edit"
          onClick={() => setEditModalOpen(true)}
        >
          <Edit3 size={14} strokeWidth={1.8} />
          Editar perfil
        </button>
      </header>

      <article className="team-profile-summary">
        <div
          className={`team-profile-avatar avatar-${member.color}`}
        >
          {member.initials}

          <span
            className={`team-member-presence is-${member.statusType}`}
          />
        </div>

        <div className="team-profile-information">
          <strong>{member.name}</strong>
          <span>{member.role}</span>

          <div className="team-profile-labels">
            <span>{member.area}</span>
            <span>{member.status}</span>
          </div>

          <div className="team-profile-contact">
            <span>{member.email}</span>
            <span>Lun–Vie 9:00–18:00</span>
          </div>
        </div>

        <div className="team-profile-capacity">
          <strong>Carga actual</strong>

          <span>
            {member.activeTickets} tickets activos
          </span>

          <div>
            <i
              style={{
                width: `${capacity}%`,
              }}
            />
          </div>

          <small>{capacity}% de capacidad</small>

          <p>
            <span>En progreso</span>
            <span>Completados</span>
            <span>Atrasados</span>
          </p>
        </div>
      </article>

      <div className="team-profile-kpis">
        <article>
          <div>
            <span>Tickets totales</span>
            <strong>148</strong>
            <small>Asignados a {member.name}</small>
          </div>

          <i className="is-blue">
            <Ticket size={17} strokeWidth={1.8} />
          </i>
        </article>

        <article>
          <div>
            <span>Completados</span>
            <strong>92</strong>
            <small>+12 resueltos esta semana</small>
          </div>

          <i className="is-green">
            <CheckCircle2
              size={17}
              strokeWidth={1.8}
            />
          </i>
        </article>

        <article>
          <div>
            <span>En progreso</span>
            <strong>44</strong>
            <small>24 con prioridad alta</small>
          </div>

          <i className="is-yellow">
            <Clock3 size={17} strokeWidth={1.8} />
          </i>
        </article>

        <article>
          <div>
            <span>Atrasados</span>
            <strong>12</strong>
            <small>Requieren atención inmediata</small>
          </div>

          <i className="is-red">
            <CalendarDays
              size={17}
              strokeWidth={1.8}
            />
          </i>
        </article>
      </div>

      <div className="team-profile-layout">
        <main className="team-profile-main">
          <article className="team-profile-card">
            <div className="team-profile-card-heading">
              <h2>Tickets asignados</h2>

              <div className="team-profile-ticket-filters">
                <select>
                  <option>Estado: Todos</option>
                </select>

                <select>
                  <option>Prioridad: Todas</option>
                </select>

                <select>
                  <option>Proyecto: Todos</option>
                </select>

                <button type="button">
                  Limpiar
                </button>
              </div>
            </div>

            <div className="team-profile-table-container">
              <table className="team-profile-table">
                <thead>
                  <tr>
                    <th>Asunto</th>
                    <th>Proyecto/Cliente</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Vence</th>
                    <th>Días</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedTickets.map((ticketItem) => (
                    <tr key={ticketItem.folio}>
                      <td>
                        <strong>
                          {ticketItem.subject}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/tickets/${ticketItem.folio}`
                            )
                          }
                        >
                          {ticketItem.folio}
                        </button>
                      </td>

                      <td>{ticketItem.project}</td>

                      <td>
                        <span
                          className={`team-table-priority ${getPriorityClass(
                            ticketItem.priority
                          )}`}
                        >
                          {ticketItem.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`team-table-status ${getStatusClass(
                            ticketItem.status
                          )}`}
                        >
                          {ticketItem.status}
                        </span>
                      </td>

                      <td>{ticketItem.dueDate}</td>

                      <td
                        className={
                          ticketItem.days.startsWith("-")
                            ? "team-days-delayed"
                            : "team-days-positive"
                        }
                      >
                        {ticketItem.days}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </main>

        <aside className="team-profile-sidebar">
          <article className="team-profile-card">
            <div className="team-profile-card-heading">
              <h2>Actividades recientes</h2>

              <button
                type="button"
                onClick={() => navigate("/actividades")}
              >
                Ver todo el historial
              </button>
            </div>

            <div className="team-recent-activities">
              {recentActivities.map((activity) => (
                <div key={activity.title}>
                  <div>
                    <strong>{activity.title}</strong>
                    <span>{activity.client}</span>
                  </div>

                  <span>{activity.date}</span>

                  <div>
                    <span
                      className={`team-table-status ${getStatusClass(
                        activity.status
                      )}`}
                    >
                      {activity.status}
                    </span>

                    <span
                      className={`team-table-priority ${getPriorityClass(
                        activity.priority
                      )}`}
                    >
                      {activity.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="team-profile-card">
            <div className="team-profile-card-heading">
              <h2>Próximos eventos</h2>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/equipo/${member.slug}/calendario`
                  )
                }
              >
                Ver calendario
              </button>
            </div>

            <div className="team-upcoming-events">
              {upcomingEvents.map((event) => (
                <div key={`${event.day}-${event.title}`}>
                  <div className="team-event-date">
                    <strong>{event.day}</strong>
                    <span>{event.month}</span>
                  </div>

                  <div>
                    <strong>{event.title}</strong>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>

      <TeamMemberModal
        open={editModalOpen}
        mode="edit"
        member={member}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateMember}
      />
    </section>
  );
}

export default UserProfilePage;