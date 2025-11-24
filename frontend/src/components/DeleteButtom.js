import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
export default function DeleteButton({ loteId, loteNombre, onDelete }) {
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
        return (_jsxs("div", { className: "delete-confirm", children: [_jsxs("p", { children: ["\u00BFEliminar \"", loteNombre, "\"?"] }), _jsx("button", { onClick: handleClick, className: "btn-confirm", children: "\u2713 S\u00ED" }), _jsx("button", { onClick: handleCancel, className: "btn-cancel", children: "\u2717 No" })] }));
    }
    return (_jsx("button", { onClick: handleClick, className: "btn-delete", children: "\uD83D\uDDD1\uFE0F Eliminar" }));
}
