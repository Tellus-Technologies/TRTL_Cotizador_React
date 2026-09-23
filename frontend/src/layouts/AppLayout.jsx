import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function toggleSidebar() {
    setSidebarCollapsed((currentValue) => !currentValue);
  }

  return (
    <div
      className={`app-layout ${
        sidebarCollapsed ? "sidebar-is-collapsed" : ""
      }`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;