import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  code: "",
  description: "",
  manager: "",
};

function ModuleModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
    }
  }, [isOpen]);

  useEffect(() => {
    function closeWithEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", closeWithEscape);
    }

    return () => {
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      manager: formData.manager.trim(),
    });

    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <section
        className="module-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="module-modal-title">Agregar módulo</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={20} />
          </button>
        </div>

        <form className="module-form" onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="module-code">Nombre del módulo</label>
            <input
              type="text"
              id="module-code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ejemplo: FICO"
              required
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="module-description">Descripción</label>
            <input
              type="text"
              id="module-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ejemplo: Módulo de finanzas"
              required
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="module-manager">Encargado del módulo</label>
            <input
              type="text"
              id="module-manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Nombre del responsable"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="btn-save">
              Guardar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ModuleModal;