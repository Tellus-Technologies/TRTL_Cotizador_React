import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/LoginPage";
import ModulesPage from "./pages/ModulesPage";
import ClientsPage from "./pages/ClientsPage";
import TariffsPage from "./pages/TariffsPage";
import PriceCalculatorPage from "./pages/PriceCalculatorPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

import TicketsDashboardPage from "./modules/tickets/pages/TicketsDashboardPage";
import TicketsPage from "./modules/tickets/pages/TicketsPage";
import TicketDetailPage from "./modules/tickets/pages/TicketDetailPage";
import EditTicketPage from "./modules/tickets/pages/EditTicketPage";

import ActivitiesPage from "./modules/activities/pages/ActivitiesPage";
import NewActivityPage from "./modules/activities/pages/NewActivityPage";
import ActivityDetailPage from "./modules/activities/pages/ActivityDetailPage";
import EditActivityPage from "./modules/activities/pages/EditActivityPage";
import TeamPage from "./modules/team/pages/TeamPage";
import UserProfilePage from "./modules/team/pages/UserProfilePage";
import TeamCalendarPage from "./modules/team/pages/TeamCalendarPage";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route element={<AppLayout />}>
        <Route
          path="/modulos"
          element={<ModulesPage />}
        />

        <Route
          path="/clientes"
          element={<ClientsPage />}
        />

        <Route
          path="/tarifas"
          element={<TariffsPage />}
        />

        <Route
          path="/calcular-precio"
          element={<PriceCalculatorPage />}
        />

        <Route
          path="/proyectos"
          element={<ProjectsPage />}
        />

        <Route
          path="/proyectos/:projectId"
          element={<ProjectDetailPage />}
        />

        <Route
          path="/resumen"
          element={<TicketsDashboardPage />}
        />

        <Route
          path="/tickets"
          element={<TicketsPage />}
        />

        <Route
          path="/tickets/:ticketId"
          element={<TicketDetailPage />}
        />

        <Route
          path="/tickets/:ticketId/editar"
          element={<EditTicketPage />}
        />

        <Route
          path="/actividades"
          element={<ActivitiesPage />}
        />

        <Route
          path="/actividades/nueva"
          element={<NewActivityPage />}
        />

        <Route
          path="/actividades/:activityId/editar"
          element={<EditActivityPage />}
        />

        <Route
          path="/actividades/:activityId"
          element={<ActivityDetailPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
      <Route
      path="/equipo"
      element={<TeamPage />}
      />
      <Route
      path="/equipo/:memberId/calendario"
     element={<TeamCalendarPage />}
      />
      <Route
      path="/equipo/:memberId"
      element={<UserProfilePage />}
      />
    </Routes>
    
  );
}

export default App;