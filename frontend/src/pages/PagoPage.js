import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
export default function PagoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lote, setLote] = useState(null);
    // Cargar datos del lote
    useEffect(() => {
        axios.get(`http://localhost:5001/api/lotes/${id}`)
            .then(res => setLote(res.data))
            .catch(err => console.error(err));
    }, [id]);
    const handlePago = async () => {
        try {
            const res = await axios.post("http://localhost:5001/api/payments/create-simulation", { lotId: id });
            alert(`Pago simulado creado. Status: ${res.data.status}`);
            navigate("/"); // vuelve a la lista
        }
        catch (err) {
            console.error(err);
            alert("Error creando pago simulado");
        }
    };
    const handleCancelar = () => navigate("/");
    if (!lote)
        return _jsx("p", { children: "Cargando informaci\u00F3n del lote..." });
    return (_jsxs("div", { style: { padding: "2rem" }, children: [_jsx("h2", { children: "Simular Pago" }), _jsxs("p", { children: ["Lote: ", _jsx("strong", { children: lote.nombre })] }), _jsxs("p", { children: ["Precio: ", _jsxs("strong", { children: ["$", lote.precioRescate] })] }), _jsxs("p", { children: ["Fecha de vencimiento: ", new Date(lote.fechaVencimiento).toLocaleDateString("es-CL")] }), _jsx("button", { onClick: handlePago, style: { marginRight: "1rem", padding: "0.5rem 1rem" }, children: "S\u00ED, pagar (sandbox)" }), _jsx("button", { onClick: handleCancelar, style: { padding: "0.5rem 1rem" }, children: "Cancelar" })] }));
}
