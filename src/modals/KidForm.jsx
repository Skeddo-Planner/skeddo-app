import { C, KID_COLORS } from "../constants/brand";
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

      <Label>Colour</Label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {KID_COLORS.map((c) => {
          const isSelected = form.color === c.hex;
          return (
            <button
              key={c.hex}
              type="button"
              onClick={() => update("color", c.hex)}
              aria-label={`Select ${c.name} colour`}
              aria-pressed={isSelected}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: c.hex,
                border: isSelected ? `3px solid ${C.ink}` : `2px solid ${C.border}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.12s",
                boxShadow: isSelected ? `0 0 0 2px ${C.cream}, 0 0 0 4px ${c.hex}` : "none",
              }}
            >
              {isSelected && (
                <span style={{ color: C.cream, fontSize: 16, fontWeight: 700 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

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
          <button className="del-btn" style={s.dangerBtn} onClick={() => {
            if (window.confirm(`Remove ${form.name || "this kid"}? This can't be undone.`)) onDelete();
          }}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  );
}
