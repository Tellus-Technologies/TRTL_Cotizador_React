import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

const emptyClient = {
  name: "",
  comment: "",
  entryDate: "",
};

function ClientModal({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}) {
  const [formData, setFormData] = useState(emptyClient);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name ?? "",
        comment: clientToEdit.comment ?? "",
        entryDate: clientToEdit.entryDate ?? "",
      });
    } else {
      setFormData(emptyClient);
    }
  }, [clientToEdit, isOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
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
      name: formData.name.trim(),
      comment: formData.comment.trim(),
      entryDate: formData.entryDate,
    });
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <section
        className="client-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="client-modal-title">
            {clientToEdit ? "Editar cliente" : "Agregar cliente"}
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <CircleX size={19} />
          </button>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="client-name">
              Nombre del cliente
            </label>

            <input
              id="client-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ejemplo: Mitsubishi"
              autoFocus
              required
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="client-comment">Comentario</label>

            <textarea
              id="client-comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Escribe un comentario"
              rows="3"
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="client-entry-date">
              Fecha de ingreso
            </label>

            <input
              id="client-entry-date"
              name="entryDate"
              type="date"
              value={formData.entryDate}
              onChange={handleChange}
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
              {clientToEdit ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ClientModal;