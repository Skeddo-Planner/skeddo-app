import { C } from "../constants/brand";

export default function Label({ children }) {
  return (
    <label
      style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        display: "block",
        marginBottom: 4,
        marginTop: 14,
      }}
    >
      {children}
    </label>
  );
}
