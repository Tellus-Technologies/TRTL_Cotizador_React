import { NavLink, useNavigate } from "react-router-dom";
import {
  Boxes,
  Users,
  DollarSign,
  Calculator,
  Folder,
  Clock3,
  Ticket,
  Zap,
  UserRoundCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function SidebarItem({ icon: Icon, label, to, collapsed }) {
  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `sidebar-item ${isActive ? "is-active" : ""}`
        }
        title={collapsed ? label : undefined}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{label}</span>
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      className="sidebar-item"
      title={collapsed ? label : undefined}
    >
      <Icon size={19} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/", { replace: true });
  }

  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-profile">
          <div className="profile-avatar">AP</div>

          <div className="profile-information">
            <strong>Armando Piña</strong>
            <span>CEO</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <p className="sidebar-section-title">COTIZADOR</p>

          <SidebarItem
            icon={Boxes}
            label="Módulos SAP"
            to="/modulos"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={Users}
            label="Clientes"
            to="/clientes"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={DollarSign}
            label="Tarifas"
            to="/tarifas"
            collapsed={collapsed}
          />

       <SidebarItem
       icon={Calculator}
       label="Calcular precio"
       to="/calcular-precio"
       collapsed={collapsed}
        />

          <SidebarItem
          icon={Folder}
          label="Proyectos"
          to="/proyectos"
         collapsed={collapsed}
        />

          <p className="sidebar-section-title sidebar-second-section">
            GESTIÓN DE TRABAJO
          </p>

          <SidebarItem
            icon={Clock3}
            label="Resumen"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={Ticket}
            label="Tickets"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={Zap}
            label="Actividades"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={UserRoundCog}
            label="Equipo"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={Settings}
            label="Administración"
            collapsed={collapsed}
          />
        </nav>
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <LogOut size={18} strokeWidth={1.8} />
        <span>Cerrar sesión</span>
      </button>

      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        title={collapsed ? "Expandir menú" : "Contraer menú"}
      >
        {collapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;