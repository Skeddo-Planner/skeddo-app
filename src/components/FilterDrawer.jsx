import { useEffect, useRef } from "react";
import { C } from "../constants/brand";
import useIsDesktop from "../hooks/useIsDesktop";

const F = "'Barlow', sans-serif";

export default function FilterDrawer({ open, onClose, title, children, onClear, onApply }) {
  const drawerRef = useRef(null);
  const isDesktop = useIsDesktop();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  /* ─── Desktop: centered modal dialog ─── */
  if (isDesktop) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close filter"
          style={{
            position: "fixed", inset: 0,
            background: "rgba(27,36,50,0.4)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: "opacity 0.25s",
            zIndex: 998,
          }}
        />

        {/* Centered modal */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: open
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.95)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            width: "min(480px, 90vw)",
            maxHeight: "70vh",
            background: "#FFF",
            borderRadius: 16,
            boxShadow: "0 24px 48px rgba(27,36,50,0.2)",
            transition: "all 0.25s cubic-bezier(0.32,0.72,0,1)",
            zIndex: 999,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px 12px" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>{title}</span>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", fontSize: 22, color: C.muted, cursor: "pointer", padding: 4, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ overflowY: "auto", padding: "0 24px 24px", flex: 1, WebkitOverflowScrolling: "touch" }}>
            {children}
          </div>

          {/* Footer */}
          {(onClear || onApply) && (
            <div style={{ display: "flex", gap: 10, padding: "12px 24px 20px", borderTop: "1px solid rgba(27,36,50,0.08)" }}>
              {onClear && (
                <button
                  onClick={onClear}
                  style={{
                    flex: 1, padding: 12, borderRadius: 8,
                    border: "1.5px solid rgba(27,36,50,0.15)",
                    background: "#fff", fontFamily: F, fontSize: 15, fontWeight: 600,
                    color: C.ink, cursor: "pointer", minHeight: 44,
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={onApply || onClose}
                style={{
                  flex: 1, padding: 12, borderRadius: 8,
                  border: "none",
                  background: C.seaGreen, fontFamily: F, fontSize: 15, fontWeight: 600,
                  color: "#fff", cursor: "pointer", minHeight: 44,
                }}
              >
                Show results
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  /* ─── Mobile: bottom sheet drawer (unchanged) ─── */
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close filter"
        style={{
          position: "fixed", inset: 0,
          background: "rgba(27,36,50,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s",
          zIndex: 998,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          maxHeight: "70vh",
          background: "#FFF",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 24px rgba(27,36,50,0.12)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)",
          zIndex: 999,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(27,36,50,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 12px" }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", fontSize: 22, color: C.muted, cursor: "pointer", padding: 4, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", padding: "0 20px 24px", flex: 1, WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>

        {/* Footer */}
        {(onClear || onApply) && (
          <div style={{ display: "flex", gap: 10, padding: "12px 20px 20px", borderTop: "1px solid rgba(27,36,50,0.08)" }}>
            {onClear && (
              <button
                onClick={onClear}
                style={{
                  flex: 1, padding: 12, borderRadius: 8,
                  border: "1.5px solid rgba(27,36,50,0.15)",
                  background: "#fff", fontFamily: F, fontSize: 15, fontWeight: 600,
                  color: C.ink, cursor: "pointer", minHeight: 44,
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onApply || onClose}
              style={{
                flex: 1, padding: 12, borderRadius: 8,
                border: "none",
                background: C.seaGreen, fontFamily: F, fontSize: 15, fontWeight: 600,
                color: "#fff", cursor: "pointer", minHeight: 44,
              }}
            >
              Show results
            </button>
          </div>
        )}
      </div>
    </>
  );
}
