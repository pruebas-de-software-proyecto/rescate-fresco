import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { fetchLotes, Lote } from "../../api/lotes";
import LotList from "../LotList";

// Mock del módulo de navegación
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/lotes", () => ({
  fetchLotes: vi.fn(),
}));

// Obtener referencia del mock
const mockFetchLotes = fetchLotes as unknown as ReturnType<typeof vi.fn>;

// Datos de prueba
const mockLotes: Lote[] = [
  {
    _id: "1",
    nombre: "Leche Descremada",
    descripcion: "Leche descremada marca Colun",
    cantidad: 2,
    unidad: "litros",
    precioOriginal: 2000,
    precioRescate: 1200,
    fechaVencimiento: "2024-12-31",
    ventanaRetiro: "10:00 - 13:00",
    ubicacion: "Supermercado A",
    fotos: ["http://example.com/leche.jpg"],
    categoria: "Lacteos",
    tienda: "Tienda 1",
    estado: "Disponible",
  },
  {
    _id: "2",
    nombre: "Pan Integral",
    descripcion: "Pan integral recién horneado",
    cantidad: 1,
    unidad: "unidades",
    precioOriginal: 1500,
    precioRescate: 800,
    fechaVencimiento: "2024-12-30",
    ventanaRetiro: "14:00 - 16:00",
    ubicacion: "Panaderia B",
    fotos: [],
    categoria: "Panaderia",
    tienda: "Tienda 1",
    estado: "Disponible",
  },
];

describe("LotList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Estado de carga
  describe("Estados de carga", () => {
    it("muestra el indicador de carga mientras obtiene los datos", async () => {
      mockFetchLotes.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      expect(screen.getByText("Cargando lotes...")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("muestra mensaje cuando no hay lotes disponibles", async () => {
      mockFetchLotes.mockResolvedValue([]);

      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("No hay lotes disponibles. 😔")).toBeInTheDocument();
      });
    });
  });

  // Visualización de lotes
  describe("Visualización de lotes", () => {
    beforeEach(() => {
      mockFetchLotes.mockResolvedValue(mockLotes);
    });

    it("muestra correctamente los datos de cada lote", async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Leche Descremada")).toBeInTheDocument();
        expect(screen.getByText("Pan Integral")).toBeInTheDocument();
      });

      // Verifica precios
      expect(screen.getAllByText(/\$\d+/).length).toBeGreaterThan(0);

      // Fecha formateada correctamente
      const fecha = new Date("2024-12-31").toLocaleDateString();
      expect(
        screen.getByText(`Vence: ${fecha}`)
      ).toBeInTheDocument();
    });

    it("maneja correctamente los lotes sin imágenes", async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Verificar que se muestra "Sin imagen" para lotes sin fotos
        expect(screen.getByText("Sin imagen")).toBeInTheDocument();
      });
    });
  });

  // Navegación
  describe("Navegación", () => {
    beforeEach(() => {
      mockFetchLotes.mockResolvedValue(mockLotes);
    });

    it("navega a la página de detalles al hacer click en Ver Detalles", async () => {
      render(
        <BrowserRouter>
          <LotList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText("Ver Detalles")).toHaveLength(2);
      });

      const primerBoton = screen.getAllByText("Ver Detalles")[0];
      fireEvent.click(primerBoton);

      expect(mockNavigate).toHaveBeenCalledWith("/1");
    });
  });
});
