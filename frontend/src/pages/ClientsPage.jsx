import { useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import ClientModal from "../components/ClientModal";

const initialClients = [
  {
    id: 5,
    name: "Vitafoods",
    comment: "Cliente Vitafoods",
    status: "Activo",
    entryDate: "2026-01-15",
    project: "Proyecto Vitafoods",
  },
  {
    id: 10,
    name: "Mitsubishi",
    comment: "Mitsubishi",
    status: "Activo",
    entryDate: "2026-02-10",
    project: "Proyecto Mitsubishi",
  },
  {
    id: 11,
    name: "Rehau",
    comment: "REHAU",
    status: "Activo",
    entryDate: "2026-03-05",
    project: "Proyecto Rehau",
  },
  {
    id: 12,
    name: "Cotemar",
    comment: "Cliente Cotemar",
    status: "Inactivo",
    entryDate: "2026-04-20",
    project: "Proyecto Cotemar",
  },
];

const clientsPerPage = 10;

function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateOrder, setDateOrder] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [minimumId, setMinimumId] = useState("");
  const [maximumId, setMaximumId] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const filtered = clients.filter((client) => {
      const matchesSearch =
        normalizedSearch === "" ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.comment.toLowerCase().includes(normalizedSearch) ||
        String(client.id).includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "" || client.status === statusFilter;

      const matchesProject =
        projectFilter === "" || client.project === projectFilter;

      const matchesMinimumId =
        minimumId === "" || client.id >= Number(minimumId);

      const matchesMaximumId =
        maximumId === "" || client.id <= Number(maximumId);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProject &&
        matchesMinimumId &&
        matchesMaximumId
      );
    });

    if (dateOrder === "recent") {
      return [...filtered].sort(
        (firstClient, secondClient) =>
          new Date(secondClient.entryDate) -
          new Date(firstClient.entryDate)
      );
    }

    if (dateOrder === "oldest") {
      return [...filtered].sort(
        (firstClient, secondClient) =>
          new Date(firstClient.entryDate) -
          new Date(secondClient.entryDate)
      );
    }

    return filtered;
  }, [
    clients,
    searchText,
    statusFilter,
    dateOrder,
    projectFilter,
    minimumId,
    maximumId,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / clientsPerPage)
  );

  const visibleClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  function changeFilter(setFilter, value) {
    setFilter(value);
    setCurrentPage(1);
  }

  function openAddModal() {
    setClientToEdit(null);
    setIsModalOpen(true);
  }

  function openEditModal(client) {
    setClientToEdit(client);
    setIsModalOpen(true);
  }

  function closeModal() {
    setClientToEdit(null);
    setIsModalOpen(false);
  }

  function handleSaveClient(clientData) {
  if (clientToEdit) {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientToEdit.id
          ? {
              ...client,
              ...clientData,
            }
          : client
      )
    );
  } else {
    const nextId =
      clients.length > 0
        ? Math.max(...clients.map((client) => client.id)) + 1
        : 1;

    setClients((currentClients) => [
      ...currentClients,
      {
        id: nextId,
        ...clientData,
        status: "Activo",
        project: "Sin proyecto",
      },
    ]);
  }

  closeModal();
}

  function handleDeleteClient(clientId) {
    const shouldDelete = window.confirm(
      "¿Deseas eliminar este cliente?"
    );

    if (!shouldDelete) {
      return;
    }

    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId)
    );
  }

  function clearFilters() {
    setSearchText("");
    setStatusFilter("");
    setDateOrder("");
    setProjectFilter("");
    setMinimumId("");
    setMaximumId("");
    setCurrentPage(1);
  }

  return (
    <>
      <section className="clients-card">
        <header className="clients-header">
          <h1>Gestión de Clientes</h1>

          <button
            type="button"
            className="add-client-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            <span>Agregar cliente</span>
          </button>
        </header>

        <div className="clients-filters">
          <label className="client-search">
            <Search size={16} />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                changeFilter(setSearchText, event.target.value)
              }
              placeholder="Buscar por nombre, ID o comentario..."
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              changeFilter(setStatusFilter, event.target.value)
            }
            aria-label="Filtrar por estado"
          >
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <select
            value={dateOrder}
            onChange={(event) =>
              changeFilter(setDateOrder, event.target.value)
            }
            aria-label="Ordenar por fecha de ingreso"
          >
            <option value="">Fecha de ingreso</option>
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>

          <select
            value={projectFilter}
            onChange={(event) =>
              changeFilter(setProjectFilter, event.target.value)
            }
            aria-label="Filtrar por proyecto"
          >
            <option value="">Proyectos</option>
            <option value="Proyecto Vitafoods">
              Proyecto Vitafoods
            </option>
            <option value="Proyecto Mitsubishi">
              Proyecto Mitsubishi
            </option>
            <option value="Proyecto Rehau">Proyecto Rehau</option>
            <option value="Proyecto Cotemar">Proyecto Cotemar</option>
            <option value="Sin proyecto">Sin proyecto</option>
          </select>

          <button
            type="button"
            className={`more-filters-button ${
              showMoreFilters ? "is-active" : ""
            }`}
            onClick={() =>
              setShowMoreFilters((currentValue) => !currentValue)
            }
          >
            <SlidersHorizontal size={15} />
            <span>Más filtros</span>
          </button>
        </div>

        {showMoreFilters && (
          <div className="advanced-client-filters">
            <input
              type="number"
              min="0"
              value={minimumId}
              onChange={(event) =>
                changeFilter(setMinimumId, event.target.value)
              }
              placeholder="ID mínimo"
            />

            <input
              type="number"
              min="0"
              value={maximumId}
              onChange={(event) =>
                changeFilter(setMaximumId, event.target.value)
              }
              placeholder="ID máximo"
            />

            <button type="button" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="clients-table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Comentario</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visibleClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td className="client-name">{client.name}</td>
                  <td>{client.comment}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="table-action-button edit-action"
                        onClick={() => openEditModal(client)}
                        aria-label={`Editar cliente ${client.name}`}
                        title="Editar cliente"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="table-action-button delete-action"
                        onClick={() => handleDeleteClient(client.id)}
                        aria-label={`Eliminar cliente ${client.name}`}
                        title="Eliminar cliente"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleClients.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-table-message">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="clients-footer">
          <span>
            Mostrando {visibleClients.length} de{" "}
            {filteredClients.length} clientes
          </span>

          <div className="clients-pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              Anterior
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              Siguiente
            </button>
          </div>
        </footer>
      </section>

      <ClientModal
        isOpen={isModalOpen}
        clientToEdit={clientToEdit}
        onClose={closeModal}
        onSave={handleSaveClient}
      />
    </>
  );
}

export default ClientsPage;