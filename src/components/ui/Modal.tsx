import { ReactNode, useEffect } from "react";
import { ModalControls } from "../../hooks/useModal";
import Heading from "./Heading";
import IconButton from "./IconButton";
import Text from "./Text";

interface ModalProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  /** Override the action for the title × button (defaults to modalControls.close). */
  onClose?: () => void;
  className?: string;
  closeOnBackdrop?: boolean;
  modalControls: ModalControls;
}

export default function Modal({
  children,
  title,
  subtitle,
  onClose,
  className = "",
  closeOnBackdrop = true,
  modalControls,
}: ModalProps) {
  function handleClose() {
    if (onClose) {
      onClose();
    }

    modalControls.close();
  }

  useEffect(() => {
    if (!modalControls.isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalControls.isOpen, handleClose]);

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 transition-all duration-300 ${modalControls.isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={closeOnBackdrop ? handleClose : undefined}
    >
      <div
        className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-xl w-full max-w-lg transition-all duration-300 transform ${modalControls.isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start px-6 pt-5">
          <div>
            <Heading as="h2" variant="title">
              {title}
            </Heading>
            {subtitle && (
              <Text variant="muted" className="mt-0.5">
                {subtitle}
              </Text>
            )}
          </div>
          <IconButton onClick={handleClose} className="text-xl shrink-0 -mr-1">
            &times;
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
