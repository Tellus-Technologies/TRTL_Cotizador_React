import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Mail,
  UserRound,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  role: "",
  email: "",
  area: "",
  status: "Disponible",
  activeTickets: "0",
};

function TeamMemberModal({
  open,
  mode = "create",
  member = null,
  onClose,
  onSave,
}) {
  const [formData, setFormData] =
    useState(emptyForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        email: member.email || "",
        area: member.area || "",
        status: member.status || "Disponible",
        activeTickets: String(
          member.activeTickets || 0
        ),
      });

      return;
    }

    setFormData(emptyForm);
  }, [open, mode, member]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function createSlug(name) {
    return name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function createInitials(name) {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  function getStatusType(status) {
    const statusTypes = {
      Disponible: "available",
      Ocupado: "busy",
      Ausente: "absent",
    };

    return statusTypes[status] || "available";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName = formData.name.trim();
    const cleanRole = formData.role.trim();
    const cleanEmail = formData.email.trim();
    const cleanArea = formData.area.trim();

    if (
      !cleanName ||
      !cleanRole ||
      !cleanEmail ||
      !cleanArea
    ) {
      return;
    }

    onSave({
      ...(member || {}),
      id: member?.id || Date.now(),
      slug: member?.slug || createSlug(cleanName),
      name: cleanName,
      initials: createInitials(cleanName),
      role: cleanRole,
      email: cleanEmail,
      area: cleanArea,
      status: formData.status,
      statusType: getStatusType(formData.status),
      activeTickets: Number(
        formData.activeTickets || 0
      ),
      color: member?.color || "blue",
    });
  }

  if (!open) {
    return null;
  }

  const formIsValid =
    formData.name.trim() &&
    formData.role.trim() &&
    formData.email.trim() &&
    formData.area.trim();

  return (
    <div
      className="team-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="team-member-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-member-modal-title"
      >
        <header className="team-member-modal-header">
          <div>
            <h2 id="team-member-modal-title">
              {mode === "edit"
                ? "Editar perfil"
                : "Nuevo integrante"}
            </h2>

            <p>
              {mode === "edit"
                ? "Actualiza la información del integrante."
                : "Registra un nuevo miembro del equipo."}
            </p>
          </div>

          <button
            type="button"
            className="team-member-modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </header>

        <form
          className="team-member-form"
          onSubmit={handleSubmit}
        >
          <div className="team-member-preview">
            <div className="team-member-preview-avatar">
              {formData.name.trim()
                ? createInitials(formData.name)
                : "NI"}
            </div>

            <div>
              <strong>
                {formData.name || "Nuevo integrante"}
              </strong>

              <span>
                {formData.role || "Puesto por definir"}
              </span>
            </div>
          </div>

          <section className="team-member-form-section">
            <h3>Información personal</h3>

            <label className="team-member-field">
              <span>
                Nombre completo <b>*</b>
              </span>

              <div className="team-member-input-icon">
                <UserRound size={14} strokeWidth={1.7} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del integrante"
                  required
                />
              </div>
            </label>

            <div className="team-member-form-grid">
              <label className="team-member-field">
                <span>
                  Puesto <b>*</b>
                </span>

                <div className="team-member-input-icon">
                  <BriefcaseBusiness
                    size={14}
                    strokeWidth={1.7}
                  />

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Ej. Consultor SAP"
                    required
                  />
                </div>
              </label>

              <label className="team-member-field">
                <span>
                  Área <b>*</b>
                </span>

                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecciona un área...
                  </option>
                  <option value="Operaciones">
                    Operaciones
                  </option>
                  <option value="Soporte">Soporte</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Compras">Compras</option>
                  <option value="Infraestructura">
                    Infraestructura
                  </option>
                  <option value="Desarrollo">
                    Desarrollo
                  </option>
                  <option value="Calidad">Calidad</option>
                  <option value="Datos">Datos</option>
                  <option value="Marketing">
                    Marketing
                  </option>
                </select>
              </label>
            </div>

            <label className="team-member-field">
              <span>
                Correo electrónico <b>*</b>
              </span>

              <div className="team-member-input-icon">
                <Mail size={14} strokeWidth={1.7} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@triarii.com"
                  required
                />
              </div>
            </label>
          </section>

          <section className="team-member-form-section">
            <h3>Disponibilidad y carga</h3>

            <div className="team-member-form-grid">
              <label className="team-member-field">
                <span>
                  Disponibilidad <b>*</b>
                </span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Disponible">
                    Disponible
                  </option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Ausente">Ausente</option>
                </select>
              </label>

              <label className="team-member-field">
                <span>Tickets activos</span>

                <input
                  type="number"
                  name="activeTickets"
                  min="0"
                  value={formData.activeTickets}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <footer className="team-member-modal-footer">
            <button
              type="button"
              className="team-member-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="team-member-save"
              disabled={!formIsValid}
            >
              {mode === "edit"
                ? "Guardar cambios"
                : "Agregar integrante"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default TeamMemberModal;