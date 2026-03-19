import { useState } from "react";
import { C, CATEGORIES, SEASON_TYPES } from "../constants/brand";
import { s } from "../styles/shared";
import Label from "../components/Label";
import Modal from "../components/Modal";

export default function ProgramForm({ form, setForm, kids, isEdit, onSave, onClose }) {
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const [errors, setErrors] = useState({});

  /* ─── Validation ─── */
  function validate() {
    const e = {};

    // Name is required
    if (!form.name?.trim()) e.name = "Program name is required";

    // Cost must be a positive number (if provided)
    if (form.cost !== "" && form.cost != null) {
      const costNum = Number(form.cost);
      if (isNaN(costNum) || costNum < 0) e.cost = "Enter a valid amount";
    }

    // Age min <= age max
    if (form.ageMin && form.ageMax) {
      if (Number(form.ageMin) > Number(form.ageMax)) e.ageMax = "Max must be ≥ min";
    }

    // End date >= start date
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "End must be after start";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (validate()) onSave();
  }

  const errorStyle = {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 11,
    color: C.danger,
    marginTop: 2,
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={s.modalTitle}>{isEdit ? "Edit Program" : "Add Program"}</h3>

      <Label>Name</Label>
      <input
        style={{ ...s.input, ...(errors.name ? { borderColor: C.danger } : {}) }}
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
        placeholder="e.g. Soccer Skills Camp"
        autoFocus
      />
      {errors.name && <div style={errorStyle}>{errors.name}</div>}

      <Label>Provider</Label>
      <input
        style={s.input}
        value={form.provider || ""}
        onChange={(e) => update("provider", e.target.value)}
        placeholder="e.g. Riverside FC"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Category</Label>
          <select
            style={s.input}
            value={form.category || "Sports"}
            onChange={(e) => update("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            style={s.input}
            value={form.status || "Exploring"}
            onChange={(e) => update("status", e.target.value)}
          >
            <option>Enrolled</option>
            <option>Waitlist</option>
            <option>Exploring</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Cost ($)</Label>
          <input
            style={{ ...s.input, ...(errors.cost ? { borderColor: C.danger } : {}) }}
            type="number"
            min="0"
            value={form.cost || ""}
            onChange={(e) => update("cost", e.target.value)}
            placeholder="285"
          />
          {errors.cost && <div style={errorStyle}>{errors.cost}</div>}
        </div>
        <div>
          <Label>Days</Label>
          <input
            style={s.input}
            value={form.days || ""}
            onChange={(e) => update("days", e.target.value)}
            placeholder="Mon-Fri"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Times</Label>
          <input
            style={s.input}
            value={form.times || ""}
            onChange={(e) => update("times", e.target.value)}
            placeholder="9:00-12:00"
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <input
            style={s.input}
            type="date"
            value={form.startDate || ""}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>End Date</Label>
          <input
            style={{ ...s.input, ...(errors.endDate ? { borderColor: C.danger } : {}) }}
            type="date"
            value={form.endDate || ""}
            onChange={(e) => update("endDate", e.target.value)}
          />
          {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}
        </div>
        <div>
          <Label>Season Type</Label>
          <select
            style={s.input}
            value={form.seasonType || ""}
            onChange={(e) => update("seasonType", e.target.value)}
          >
            <option value="">Select...</option>
            {SEASON_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Age Min</Label>
          <input
            style={s.input}
            type="number"
            min="0"
            value={form.ageMin || ""}
            onChange={(e) => update("ageMin", e.target.value)}
            placeholder="5"
          />
        </div>
        <div>
          <Label>Age Max</Label>
          <input
            style={{ ...s.input, ...(errors.ageMax ? { borderColor: C.danger } : {}) }}
            type="number"
            min="0"
            value={form.ageMax || ""}
            onChange={(e) => update("ageMax", e.target.value)}
            placeholder="12"
          />
          {errors.ageMax && <div style={errorStyle}>{errors.ageMax}</div>}
        </div>
      </div>

      <Label>Location</Label>
      <input
        style={s.input}
        value={form.location || ""}
        onChange={(e) => update("location", e.target.value)}
        placeholder="e.g. 123 Main St"
      />

      <Label>Neighbourhood</Label>
      <input
        style={s.input}
        value={form.neighbourhood || ""}
        onChange={(e) => update("neighbourhood", e.target.value)}
        placeholder="e.g. Kitsilano"
      />

      <Label>Registration URL</Label>
      <input
        style={s.input}
        type="url"
        value={form.registrationUrl || ""}
        onChange={(e) => update("registrationUrl", e.target.value)}
        placeholder="https://..."
      />

      {/* Assign kids */}
      {(kids || []).length > 0 && (
        <>
          <Label>Assign Kids</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {kids.map((k) => {
              const sel = (form.kidIds || []).includes(k.id);
              return (
                <button
                  key={k.id}
                  className="chip-btn"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      kidIds: sel
                        ? (f.kidIds || []).filter((i) => i !== k.id)
                        : [...(f.kidIds || []), k.id],
                    }))
                  }
                  style={{
                    ...s.filterChip,
                    background: sel ? C.seaGreen : "transparent",
                    color: sel ? "#fff" : C.ink,
                    borderColor: sel ? C.seaGreen : C.border,
                  }}
                >
                  {k.name}
                </button>
              );
            })}
          </div>
        </>
      )}

      <Label>Notes</Label>
      <textarea
        style={{ ...s.input, minHeight: 50, resize: "vertical" }}
        value={form.notes || ""}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Any extra info..."
      />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button style={s.secondaryBtn} onClick={onClose}>
          Cancel
        </button>
        <button style={s.primaryBtn} onClick={handleSave}>
          {isEdit ? "Save Changes" : "Add Program"}
        </button>
      </div>
    </Modal>
  );
}
