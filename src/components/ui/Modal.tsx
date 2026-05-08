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
  /** Extra classes applied to the white card (e.g. "max-h-[90vh] overflow-y-auto") */
  className?: string;
  /** Whether clicking the dark backdrop closes the modal. Default false. */
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
  const handleClose = onClose ?? modalControls.close;

  useEffect(() => {
    if (!modalControls.isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalControls.isOpen, handleClose]);

  if (!modalControls.isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
      onClick={closeOnBackdrop ? handleClose : undefined}
    >
      <div
        className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-xl w-full max-w-md ${className}`}
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
