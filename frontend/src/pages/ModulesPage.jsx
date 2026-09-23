import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import ModuleModal from "../components/ModuleModal";

const initialModules = [
  {
    id: 10,
    code: "CO",
    description: "Costos",
    manager: "",
    isVisible: true,
  },
  {
    id: 15,
    code: "FI",
    description: "Finanzas",
    manager: "",
    isVisible: true,
  },
  {
    id: 17,
    code: "ABAP",
    description: "Programación ABAP",
    manager: "",
    isVisible: true,
  },
  {
    id: 19,
    code: "MM",
    description: "Material Management",
    manager: "",
    isVisible: true,
  },
  {
    id: 20,
    code: "SD",
    description: "Sales and Distribution",
    manager: "",
    isVisible: true,
  },
  {
    id: 21,
    code: "BTP",
    description: "Módulo BTP",
    manager: "",
    isVisible: true,
  },
];

function ModulesPage() {
  const [modules, setModules] = useState(initialModules);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSaveModule(newModule) {
    const nextId =
      modules.length > 0
        ? Math.max(...modules.map((module) => module.id)) + 1
        : 1;

    setModules((currentModules) => [
      ...currentModules,
      {
        id: nextId,
        ...newModule,
        isVisible: true,
      },
    ]);
  }

  function handleToggleVisibility(moduleId) {
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              isVisible: !module.isVisible,
            }
          : module
      )
    );
  }

  function handleDeleteModule(moduleId) {
    const shouldDelete = window.confirm(
      "¿Deseas eliminar este módulo?"
    );

    if (!shouldDelete) {
      return;
    }

    setModules((currentModules) =>
      currentModules.filter((module) => module.id !== moduleId)
    );
  }

  return (
    <>
      <section className="modules-card">
        <header className="modules-header">
          <h1>Módulos SAP</h1>
        </header>

        <div className="modules-actions">
          <button
            type="button"
            className="add-module-button"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Agregar módulo</span>
          </button>
        </div>

        <div className="modules-table-container">
          <table className="modules-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Módulo</th>
                <th>Descripción</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {modules.map((module) => (
                <tr
                  key={module.id}
                  className={
                    module.isVisible ? "" : "module-is-hidden"
                  }
                >
                  <td>{module.id}</td>
                  <td className="module-code">{module.code}</td>
                  <td>{module.description}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="table-action-button visibility-action"
                        title={
                          module.isVisible
                            ? "Ocultar módulo"
                            : "Mostrar módulo"
                        }
                        aria-label={
                          module.isVisible
                            ? `Ocultar módulo ${module.code}`
                            : `Mostrar módulo ${module.code}`
                        }
                        onClick={() =>
                          handleToggleVisibility(module.id)
                        }
                      >
                       {module.isVisible ? (
                       <Eye size={17} />
                       ) : (
                      <EyeOff size={17} />
                       )}
                      </button>

                      <button
                        type="button"
                        className="table-action-button delete-action"
                        title="Eliminar módulo"
                        aria-label={`Eliminar módulo ${module.code}`}
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {modules.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-table-message">
                    No hay módulos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ModuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModule}
      />
    </>
  );
}

export default ModulesPage;