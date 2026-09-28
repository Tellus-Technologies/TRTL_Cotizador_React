import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";

import TeamMemberModal from "../components/TeamMemberModal";
import { teamMembers } from "../data/teamData";
import "../styles/team.css";

function loadTeamMembers() {
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

  return [...createdMembers, ...teamMembers].map(
    (member) => ({
      ...member,
      ...(memberOverrides[member.slug] || {}),
    })
  );
}

function TeamPage() {
  const navigate = useNavigate();

  const [members, setMembers] =
    useState(loadTeamMembers);

  const [memberModalOpen, setMemberModalOpen] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const cleanSearch = search
      .trim()
      .toLowerCase();

    return members.filter((member) => {
      const matchesStatus =
        activeFilter === "all" ||
        member.statusType === activeFilter;

      const matchesSearch =
        !cleanSearch ||
        member.name
          .toLowerCase()
          .includes(cleanSearch) ||
        member.role
          .toLowerCase()
          .includes(cleanSearch) ||
        member.email
          .toLowerCase()
          .includes(cleanSearch) ||
        member.area
          .toLowerCase()
          .includes(cleanSearch);

      return matchesStatus && matchesSearch;
    });
  }, [members, activeFilter, search]);

  const availableTotal = members.filter(
    (member) => member.statusType === "available"
  ).length;

  const busyTotal = members.filter(
    (member) => member.statusType === "busy"
  ).length;

  const absentTotal = members.filter(
    (member) => member.statusType === "absent"
  ).length;

  function handleCreateMember(newMember) {
    let createdMembers = [];

    try {
      createdMembers = JSON.parse(
        sessionStorage.getItem(
          "created-team-members"
        ) || "[]"
      );
    } catch {
      createdMembers = [];
    }

    const updatedCreatedMembers = [
      newMember,
      ...createdMembers,
    ];

    sessionStorage.setItem(
      "created-team-members",
      JSON.stringify(updatedCreatedMembers)
    );

    setMembers((currentMembers) => [
      newMember,
      ...currentMembers,
    ]);

    setMemberModalOpen(false);
  }

  return (
    <section className="team-page">
      <header className="team-header">
        <div>
          <h1>Equipo</h1>

          <p>
            Directorio de miembros del equipo
          </p>
        </div>

        <button
          type="button"
          className="team-new-button"
          onClick={() => setMemberModalOpen(true)}
        >
          <Plus size={15} strokeWidth={2} />
          Nuevo
          <ChevronDown size={14} strokeWidth={2} />
        </button>
      </header>

      <section className="team-toolbar">
        <div className="team-status-filters">
          <button
            type="button"
            className={
              activeFilter === "all"
                ? "is-active"
                : ""
            }
            onClick={() => setActiveFilter("all")}
          >
            Todos
            <span>{members.length}</span>
          </button>

          <button
            type="button"
            className={`team-filter-available ${
              activeFilter === "available"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter("available")
            }
          >
            <i />
            Disponible
            <span>{availableTotal}</span>
          </button>

          <button
            type="button"
            className={`team-filter-busy ${
              activeFilter === "busy"
                ? "is-active"
                : ""
            }`}
            onClick={() => setActiveFilter("busy")}
          >
            <i />
            Ocupado
            <span>{busyTotal}</span>
          </button>

          <button
            type="button"
            className={`team-filter-absent ${
              activeFilter === "absent"
                ? "is-active"
                : ""
            }`}
            onClick={() => setActiveFilter("absent")}
          >
            <i />
            Ausente
            <span>{absentTotal}</span>
          </button>
        </div>

        <label className="team-search">
          <Search size={14} strokeWidth={1.8} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar miembro..."
          />
        </label>
      </section>

      <div className="team-members-grid">
        {filteredMembers.map((member) => (
          <button
            type="button"
            className="team-member-card"
            key={member.id}
            onClick={() =>
              navigate(`/equipo/${member.slug}`)
            }
          >
            <div
              className={`team-member-avatar avatar-${member.color}`}
            >
              {member.initials}

              <span
                className={`team-member-presence is-${member.statusType}`}
              />
            </div>

            <strong>{member.name}</strong>

            <span className="team-member-role">
              {member.role}
            </span>

            <small>{member.email}</small>

            <span
              className={`team-member-status is-${member.statusType}`}
            >
              <i />
              {member.status}
            </span>
          </button>
        ))}

        {filteredMembers.length === 0 && (
          <div className="team-empty">
            <h2>No se encontraron integrantes</h2>

            <p>
              Intenta utilizar otro nombre o filtro.
            </p>
          </div>
        )}
      </div>

      <TeamMemberModal
        open={memberModalOpen}
        mode="create"
        onClose={() => setMemberModalOpen(false)}
        onSave={handleCreateMember}
      />
    </section>
  );
}

export default TeamPage;