import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Modal({ onClose, children }) {
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
