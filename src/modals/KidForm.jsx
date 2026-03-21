import { useState, useRef, useEffect } from "react";
import { C, KID_COLORS, ACTIVITY_INTERESTS } from "../constants/brand";
import { s } from "../styles/shared";
import Label from "../components/Label";
import Modal from "../components/Modal";

export default function KidForm({ form, setForm, isEdit, onSave, onDelete, onClose, coParents, onManageAccess, onInvite }) {
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const interests = form.interests || [];

  const addInterest = (interest) => {
    if (!interests.includes(interest)) {
      update("interests", [...interests, interest]);
    }
    setSearch("");
    setDropdownOpen(false);
  };

  const removeInterest = (interest) => {
    update("interests", interests.filter((i) => i !== interest));
  };

  // Filter available options
  const filteredOptions = ACTIVITY_INTERESTS.filter(
    (a) => !interests.includes(a) && a.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <Modal onClose={onClose} centered>
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
                <span style={{ color: C.cream, fontSize: 16, fontWeight: 700 }}>{"\u2713"}</span>
              )}
            </button>
          );
        })}
      </div>

      <Label>Activity Interests</Label>
      <p style={{ fontSize: 11, color: C.muted, margin: "-4px 0 8px", fontFamily: "'Barlow', sans-serif" }}>
        What activities does this kid enjoy?
      </p>

      {/* Selected interests as chips */}
      {interests.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {interests.map((interest) => (
            <span
              key={interest}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                background: "#EDF7F1",
                color: C.seaGreen,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                style={{
                  background: "none",
                  border: "none",
                  color: C.seaGreen,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "0 2px",
                  lineHeight: 1,
                }}
                aria-label={`Remove ${interest}`}
              >
                {"\u00D7"}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown selector */}
      <div ref={dropdownRef} style={{ position: "relative", marginBottom: 12 }}>
        <input
          style={s.input}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          placeholder="Search activities..."
        />
        {dropdownOpen && filteredOptions.length > 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            marginTop: 4,
            maxHeight: 180,
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => addInterest(option)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13,
                  color: C.ink,
                  cursor: "pointer",
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shared access section — only show in edit mode */}
      {isEdit && (
        <>
          <Label>People Managing {form.name || "This Child"}'s Schedule</Label>
          {coParents && coParents.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {coParents.map((person) => (
                <span
                  key={person.userId}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: person.role === "creator" ? "#E8F5EE" : "#EAF0F6",
                    color: person.role === "creator" ? C.seaGreen : "#2A5F8A",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {person.displayName}
                  {person.role === "creator" && (
                    <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 2 }}>(creator)</span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: C.muted, fontFamily: "'Barlow', sans-serif", marginBottom: 10 }}>
              Only you can see this child's schedule.
            </p>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {onInvite && (
              <button
                type="button"
                onClick={() => onInvite(form)}
                style={{
                  ...s.secondaryBtn,
                  fontSize: 12,
                  padding: "6px 12px",
                  flex: "none",
                }}
              >
                + Invite someone
              </button>
            )}
            {onManageAccess && coParents && coParents.length > 0 && (
              <button
                type="button"
                onClick={() => onManageAccess(form)}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.seaGreen,
                  cursor: "pointer",
                  padding: "6px 0",
                }}
              >
                Manage access
              </button>
            )}
          </div>
        </>
      )}

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
