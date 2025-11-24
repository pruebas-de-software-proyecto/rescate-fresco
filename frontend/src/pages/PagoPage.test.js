import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PagoPage from "./PagoPage";
import { vi } from "vitest";
// 👇 Mockeamos axios
vi.mock("axios");
const mockedAxios = axios;
// 👇 Mockeamos useParams y useNavigate
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ id: "123" }),
        useNavigate: () => vi.fn(),
    };
});
describe("PagoPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("muestra los datos del lote después de cargarlos", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { nombre: "Lote de Prueba", precioRescate: 15000, fechaVencimiento: "2025-12-10T00:00:00Z" },
        });
        render(_jsx(BrowserRouter, { children: _jsx(PagoPage, {}) }));
        expect(screen.getByText("Cargando información del lote...")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Lote de Prueba/)).toBeInTheDocument();
        });
    });
    it("simula un pago correctamente", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { nombre: "Lote 1", precioRescate: 20000, fechaVencimiento: "2025-12-10T00:00:00Z" },
        });
        mockedAxios.post.mockResolvedValueOnce({
            data: { status: "success" },
        });
        render(_jsx(BrowserRouter, { children: _jsx(PagoPage, {}) }));
        await waitFor(() => screen.getByText("Sí, pagar (sandbox)"));
        fireEvent.click(screen.getByText("Sí, pagar (sandbox)"));
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:5001/api/payments/create-simulation", { lotId: "123" });
        });
    });
});
