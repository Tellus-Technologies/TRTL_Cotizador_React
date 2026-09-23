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
      </Route>

      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default App;