import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import Label from "../components/Label";

const CATEGORIES = ["Gear", "Lessons", "Transport", "Extended Care", "Other"];

export default function ManualCostForm({ form, setForm, kids, isEdit, onSave, onDelete, onClose }) {
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Modal onClose={onClose} centered>
      <h3 style={s.modalTitle}>{isEdit ? "Edit Expense" : "Add Expense"}</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 16 }}>
        Track costs not in the program directory — gear, lessons, transport, discounts.
      </p>

      <Label>Description</Label>
      <input
        style={s.input}
        value={form.description || ""}
        onChange={(e) => update("description", e.target.value)}
        placeholder="e.g. Soccer cleats, swim goggles"
        autoFocus
      />

      <Label>Amount ($)</Label>
      <input
        style={s.input}
        type="number"
        step="0.01"
        value={form.amount ?? ""}
        onChange={(e) => update("amount", e.target.value)}
        placeholder="49.99 (negative for discounts)"
      />
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2, marginBottom: 12 }}>
        Use a negative number for discounts or bursaries
      </p>

      <Label>Category</Label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => update("category", cat)}
            style={{
              ...s.filterChip,
              fontSize: 13,
              padding: "6px 12px",
              minHeight: 36,
              background: form.category === cat ? C.seaGreen : "transparent",
              color: form.category === cat ? "#fff" : C.muted,
              borderColor: form.category === cat ? C.seaGreen : C.border,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <Label>Assigned Kid</Label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {(kids || []).map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => update("kidId", k.id)}
            style={{
              ...s.filterChip,
              fontSize: 13,
              padding: "6px 12px",
              minHeight: 36,
              background: form.kidId === k.id ? (k.color || C.seaGreen) : "transparent",
              color: form.kidId === k.id ? "#fff" : C.muted,
              borderColor: form.kidId === k.id ? (k.color || C.seaGreen) : C.border,
            }}
          >
            {k.name}
          </button>
        ))}
      </div>

      <Label>Date (optional)</Label>
      <input
        style={s.input}
        type="date"
        value={form.date || ""}
        onChange={(e) => update("date", e.target.value)}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button style={s.secondaryBtn} onClick={onClose}>Cancel</button>
        <button
          style={{ ...s.primaryBtn, opacity: !form.description?.trim() || !form.amount ? 0.5 : 1 }}
          onClick={onSave}
          disabled={!form.description?.trim() || !form.amount}
        >
          {isEdit ? "Save" : "Add Expense"}
        </button>
        {isEdit && onDelete && (
          <button style={s.dangerBtn} onClick={() => {
            if (window.confirm("Delete this expense?")) onDelete();
          }}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  );
}
