import { useEffect } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Modal({ onClose, children }) {
  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-bg"
      style={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content" style={s.modal}>
        {children}
      </div>
    </div>
  );
}
