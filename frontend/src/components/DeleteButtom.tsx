import { useState } from 'react';

interface DeleteButtonProps {
  loteId: string;
  loteNombre: string;
  onDelete: (id: string) => void;
}

export default function DeleteButton({ loteId, loteNombre, onDelete }: DeleteButtonProps) {
  const [confirmando, setConfirmando] = useState(false);

  const handleClick = () => {
    if (!confirmando) {
      setConfirmando(true);
      return;
    }
    onDelete(loteId);
    setConfirmando(false);
  };

  const handleCancel = () => {
    setConfirmando(false);
  };

  if (confirmando) {
    return (
      <div className="delete-confirm">
        <p>¿Eliminar "{loteNombre}"?</p>
        <button onClick={handleClick} className="btn-confirm">
          ✓ Sí
        </button>
        <button onClick={handleCancel} className="btn-cancel">
          ✗ No
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleClick} className="btn-delete">
      🗑️ Eliminar
    </button>
  );
}
