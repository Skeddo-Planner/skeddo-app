import { useEffect, useRef } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Modal({ onClose, children, centered }) {
  const modalRef = useRef(null);

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* Focus trap — keep Tab/Shift+Tab inside the modal */
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      const focusable = modal.querySelectorAll(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    // Auto-focus the first focusable element inside the modal
    const firstFocusable = modal.querySelector(focusableSelector);
    if (firstFocusable) firstFocusable.focus();

    // Prevent body scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="modal-bg"
      style={{ ...s.overlay, ...(centered ? { alignItems: "center", padding: "20px" } : {}) }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" ref={modalRef} style={{ ...s.modal, ...(centered ? { borderRadius: 20, maxHeight: "92vh" } : {}) }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 22,
            color: C.muted,
            cursor: "pointer",
            padding: 8,
            minWidth: 40,
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
