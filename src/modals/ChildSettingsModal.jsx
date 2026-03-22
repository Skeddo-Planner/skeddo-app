import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import Label from "../components/Label";

export default function ChildSettingsModal({ kid, coParents, userId, onRemoveAccess, onInvite, onClose }) {
  const handleRemove = (targetUserId, displayName) => {
    if (window.confirm(
      `Are you sure? ${displayName} will immediately lose access to ${kid.name}'s schedule. This can't be undone.`
    )) {
      onRemoveAccess(kid.id, targetUserId);
    }
  };

  // Current user's role for this child
  const myAccess = (coParents || []).find((p) => p.userId === userId);
  const isCreator = myAccess?.role === "creator" || kid.userId === userId;
  const allAdults = coParents || [];

  return (
    <Modal onClose={onClose} centered>
      <h3 style={s.modalTitle}>
        People managing {kid.name}'s schedule
      </h3>
      <p style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
        marginBottom: 16, lineHeight: 1.5,
      }}>
        Everyone here can view, add, edit, and remove activities on {kid.name}'s schedule.
      </p>

      {/* People list */}
      <div style={{ marginBottom: 16 }}>
        {allAdults.map((person) => {
          const isMe = person.userId === userId;
          const canRemove = !isMe && (isCreator || person.invitedBy === userId);
          return (
            <div
              key={person.userId}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: person.role === "creator" ? C.seaGreen : C.blue,
                  color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                }}>
                  {person.displayName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {person.displayName}{isMe ? " (you)" : ""}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                    {person.role === "creator" ? "Added this child" : `Joined ${new Date(person.joinedAt).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {person.role === "creator" && (
                  <span style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                    color: C.seaGreen, background: "#E8F5EE", padding: "2px 8px",
                    borderRadius: 6, textTransform: "uppercase",
                  }}>
                    Creator
                  </span>
                )}
                {canRemove && (
                  <button
                    onClick={() => handleRemove(person.userId, person.displayName)}
                    style={{
                      background: "none", border: "none", color: "#C0392B",
                      fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite button */}
      {allAdults.length < 2 && (
        <button style={{ ...s.primaryBtn, width: "100%" }} onClick={() => onInvite(kid)}>
          Invite someone to {kid.name}'s schedule
        </button>
      )}
      {allAdults.length >= 2 && (
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, textAlign: "center" }}>
          Maximum 2 adults reached
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <button style={s.secondaryBtn} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
