import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import PagoPage from "./PagoPage";

// 👇 Mockeamos axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

// Mockeamos axios.create para que devuelva un objeto con interceptors y métodos
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn()
    }
  }
};

mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);

// 👇 Mockeamos useParams y useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: () => vi.fn(),
  };
});

// 👇 Mockeamos las funciones de la API
vi.mock("../api/lotes", () => ({
  generarPin: vi.fn().mockResolvedValue({ codigoRetiro: "ABC123" }),
  reservarLote: vi.fn().mockResolvedValue(undefined),
}));

describe("PagoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra los datos del lote después de cargarlos", async () => {
    // Mockeamos la llamada axios.get que se hace directamente en el componente
    mockedAxios.get.mockResolvedValueOnce({
      data: { nombre: "Lote de Prueba", precioRescate: 15000, fechaVencimiento: "2025-12-10T00:00:00Z" },
    });

    render(
      <BrowserRouter>
        <PagoPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Cargando información del lote...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Lote de Prueba/)).toBeInTheDocument();
    });
  });

  it("simula un pago correctamente", async () => {
    // Mock para cargar datos del lote
    mockedAxios.get.mockResolvedValueOnce({
      data: { nombre: "Lote 1", precioRescate: 20000, fechaVencimiento: "2025-12-10T00:00:00Z" },
    });
    
    // Mock para el pago
    mockedAxios.post.mockResolvedValueOnce({
      data: { status: "success" },
    });

    render(
      <BrowserRouter>
        <PagoPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Sí, pagar (sandbox)"));

    fireEvent.click(screen.getByText("Sí, pagar (sandbox)"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5001/api/payments/create-simulation",
        { lotId: "123" }
      );
    });
  });
});
