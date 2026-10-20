import type { MouseEvent, ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  function stopPropagation(event: MouseEvent<HTMLElement>): void {
    event.stopPropagation();
  }

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <section
        className="modalContent"
        role="dialog"
        aria-modal="true"
        onMouseDown={stopPropagation}
      >
        {children}
      </section>
    </div>
  );
}
