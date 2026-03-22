import { s } from "../styles/shared";

export default function EmptyState({ icon, message, action }) {
  return (
    <div style={s.emptyState}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div>{message}</div>
      {action && (
        <button
          style={{
            ...s.emptyState,
            marginTop: 12,
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: 13,
            color: "#2D9F6F",
            background: "none",
            border: "1.5px solid #2D9F6F",
            borderRadius: 10,
            cursor: "pointer",
            display: "inline-block",
            textAlign: "center",
          }}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
