"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function ConfirmationDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirmar" }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; confirmLabel?: string }) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} icon={AlertTriangle} className="max-w-md">
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="button" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
