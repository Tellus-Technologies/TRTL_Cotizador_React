import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EXCHANGE_RATE = 17.064;

const initialRates = [
  {
    id: 1,
    module: "FI",
    hourlyRateUsd: 100,
  },
];

const emptyForm = {
  module: "",
  hourlyRateUsd: "",
};

function TariffsPage() {
  const navigate = useNavigate();

  const [rates, setRates] = useState(initialRates);
  const [formData, setFormData] = useState(emptyForm);
  const [editingRateId, setEditingRateId] = useState(null);

  const convertedRateMxn = useMemo(() => {
    const numericRateUsd =
      Number(formData.hourlyRateUsd) || 0;

    return numericRateUsd * EXCHANGE_RATE;
  }, [formData.hourlyRateUsd]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericRateUsd = Number(
      formData.hourlyRateUsd
    );

    if (!formData.module) {
      window.alert("Selecciona un módulo.");
      return;
    }

    if (
      !Number.isFinite(numericRateUsd) ||
      numericRateUsd <= 0
    ) {
      window.alert(
        "Ingresa una tarifa válida en dólares."
      );
      return;
    }

    const rateData = {
      module: formData.module,
      hourlyRateUsd: numericRateUsd,
    };

    if (editingRateId !== null) {
      setRates((currentRates) =>
        currentRates.map((rate) =>
          rate.id === editingRateId
            ? {
                ...rate,
                ...rateData,
              }
            : rate
        )
      );
    } else {
      const nextId =
        rates.length > 0
          ? Math.max(
              ...rates.map((rate) => rate.id)
            ) + 1
          : 1;

      setRates((currentRates) => [
        ...currentRates,
        {
          id: nextId,
          ...rateData,
        },
      ]);
    }

    resetForm();
  }

  function handleEditRate(rate) {
    setEditingRateId(rate.id);

    setFormData({
      module: rate.module,
      hourlyRateUsd: String(rate.hourlyRateUsd),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteRate(rateId) {
    const shouldDelete = window.confirm(
      "¿Deseas eliminar esta tarifa?"
    );

    if (!shouldDelete) {
      return;
    }

    setRates((currentRates) =>
      currentRates.filter(
        (rate) => rate.id !== rateId
      )
    );

    if (editingRateId === rateId) {
      resetForm();
    }
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingRateId(null);
  }

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <section className="tariffs-page">
      <header className="tariffs-client-header">
        <div>
          <span className="tariffs-category">
            TARIFAS DEL CLIENTE
          </span>

          <h1>Vitafoods</h1>
          <p>Cliente Vitafoods</p>
        </div>

        <button
          type="button"
          className="back-to-clients-button"
          onClick={() => navigate("/clientes")}
        >
          <ArrowLeft size={16} />
          <span>Volver a clientes</span>
        </button>
      </header>

      <section className="tariffs-section">
        <div className="tariffs-section-title">
          <h2>
            {editingRateId !== null
              ? "Editar tarifa"
              : "Asignar nueva tarifa"}
          </h2>
        </div>

        <form
          className="tariffs-form"
          onSubmit={handleSubmit}
        >
          <div className="tariffs-form-field">
            <label htmlFor="rate-module">
              Módulo
            </label>

            <select
              id="rate-module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              required
            >
              <option value="">
                Seleccione módulo...
              </option>
              <option value="FI">FI</option>
              <option value="CO">CO</option>
              <option value="MM">MM</option>
              <option value="SD">SD</option>
              <option value="PM">PM</option>
              <option value="WM">WM</option>
              <option value="ABAP">ABAP</option>
              <option value="BTP">BTP</option>
            </select>
          </div>

          <div className="tariffs-form-field">
            <label htmlFor="hourly-rate-usd">
              Tarifa (USD/hora)
            </label>

            <input
              id="hourly-rate-usd"
              name="hourlyRateUsd"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.hourlyRateUsd}
              onChange={handleChange}
              placeholder="Ej. 100.00"
              required
            />
          </div>

          <div className="tariffs-form-field">
            <label htmlFor="hourly-rate-mxn">
              Equivalente (MXN/hora)
            </label>

            <input
              id="hourly-rate-mxn"
              type="text"
              value={formatCurrency(
                convertedRateMxn,
                "MXN"
              )}
              readOnly
              className="converted-rate-input"
            />
          </div>

          <div className="tariff-exchange-information">
            Tipo de cambio utilizado:{" "}
            <strong>
              {formatCurrency(
                EXCHANGE_RATE,
                "MXN"
              )}{" "}
              por USD
            </strong>
          </div>

          <div className="tariffs-form-actions">
            {editingRateId !== null && (
              <button
                type="button"
                className="cancel-rate-button"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}

            <button
              type="submit"
              className="save-rate-button"
            >
              {editingRateId !== null
                ? "Guardar cambios"
                : "Guardar tarifa"}
            </button>
          </div>
        </form>
      </section>

      <section className="tariffs-section">
        <div className="tariffs-section-title">
          <h2>Tarifas registradas</h2>
        </div>

        <div className="rates-table-container">
          <table className="rates-table">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Tarifa (USD/hora)</th>
                <th>Tarifa (MXN/hora)</th>

                <th className="actions-column">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {rates.map((rate) => {
                const hourlyRateMxn =
                  rate.hourlyRateUsd *
                  EXCHANGE_RATE;

                return (
                  <tr key={rate.id}>
                    <td className="rate-module">
                      {rate.module}
                    </td>

                    <td className="rate-amount rate-amount-usd">
                      {formatCurrency(
                        rate.hourlyRateUsd,
                        "USD"
                      )}
                    </td>

                    <td className="rate-amount rate-amount-mxn">
                      {formatCurrency(
                        hourlyRateMxn,
                        "MXN"
                      )}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-action-button edit-action"
                          onClick={() =>
                            handleEditRate(rate)
                          }
                          aria-label={`Editar tarifa de ${rate.module}`}
                          title="Editar tarifa"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="table-action-button delete-action"
                          onClick={() =>
                            handleDeleteRate(rate.id)
                          }
                          aria-label={`Eliminar tarifa de ${rate.module}`}
                          title="Eliminar tarifa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rates.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="empty-table-message"
                  >
                    No hay tarifas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default TariffsPage;