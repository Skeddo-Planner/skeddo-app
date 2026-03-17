import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Label from "../components/Label";
import Modal from "../components/Modal";

export default function KidForm({ form, setForm, isEdit, onSave, onDelete, onClose }) {
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Modal onClose={onClose}>
      <h3 style={s.modalTitle}>{isEdit ? "Edit Kid" : "Add Kid"}</h3>

      <Label>Name</Label>
      <input
        style={s.input}
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
        placeholder="e.g. Maya"
        autoFocus
      />

      <Label>Age</Label>
      <input
        style={s.input}
        type="number"
        value={form.age || ""}
        onChange={(e) => update("age", e.target.value)}
        placeholder="7"
      />

      <Label>Notes</Label>
      <textarea
        style={{ ...s.input, minHeight: 50, resize: "vertical" }}
        value={form.notes || ""}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Allergies, preferences, etc."
      />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button style={s.secondaryBtn} onClick={onClose}>
          Cancel
        </button>
        <button style={s.primaryBtn} onClick={onSave}>
          {isEdit ? "Save" : "Add Kid"}
        </button>
        {isEdit && onDelete && (
          <button className="del-btn" style={s.dangerBtn} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  );
}
