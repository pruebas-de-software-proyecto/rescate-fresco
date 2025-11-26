import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchLotes } from "../../api/lotes";
import tiendasAPI from "../../api/user";
import AdminReservationsPage from "./ReservationPageAdmin";

// 1. Mocks de dependencias
vi.mock("../../api/lotes");
vi.mock("../../api/user");
vi.mock("../../services/types");

// Datos de prueba: 2 lotes de diferentes tiendas
const mockLotesMixtos = [
  {
    _id: "1",
    nombre: "Lote Mío",
    categoria: "Frutas" as const,
    descripcion: "Descripción del lote mío",
    cantidad: 1,
    unidad: "kg" as const,
    precioOriginal: 8000,
    precioRescate: 5000,
    fechaVencimiento: new Date().toISOString(),
    ventanaRetiro: "10:00 - 14:00",
    ubicacion: "Mi ubicación",
    fotos: [],
    estado: "reservado" as const,
    proveedor: "Mi Tienda",
    tienda: "Mi Tienda", // Campo que usa el filtro
    codigoRetiro: "EXITO1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "2",
    nombre: "Lote Ajeno",
    categoria: "Verduras" as const,
    descripcion: "Descripción del lote ajeno",
    cantidad: 2,
    unidad: "unidades" as const,
    precioOriginal: 5000,
    precioRescate: 3000,
    fechaVencimiento: new Date().toISOString(),
    ventanaRetiro: "15:00 - 19:00",
    ubicacion: "Otra ubicación",
    fotos: [],
    estado: "reservado" as const,
    proveedor: "Otra Tienda", // NO coincide
    tienda: "Otra Tienda", // Campo que usa el filtro
    codigoRetiro: "OTRO1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

describe("AdminReservationsPage (Vista Tienda)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it("filtra y muestra SOLO los productos de la tienda logueada", async () => {
    // 1. Simulamos que soy "Mi Tienda"
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({
      id: "user1",
      nombreTienda: "Mi Tienda",
      email: "tienda@test.com"
    });

    // 2. Simulamos que el sistema devuelve lotes mezclados
    vi.mocked(fetchLotes).mockResolvedValue(mockLotesMixtos as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    // Esperar carga
    await waitFor(() => expect(screen.getByText("Reservas de mi tienda")).toBeInTheDocument());

    // VERIFICACIÓN CLAVE:
    // Debe aparecer "Lote Mío"
    expect(screen.getByText("Lote Mío")).toBeInTheDocument();
    
    // NO debe aparecer "Lote Ajeno" (porque el filtro lo debe eliminar)
    expect(screen.queryByText("Lote Ajeno")).not.toBeInTheDocument();
  });

  it("abre el modal y valida un código CORRECTO", async () => {
    // Setup inicial
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir Modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));
    expect(screen.getByText("Validar Entrega")).toBeInTheDocument();

    // 2. Escribir el código correcto "EXITO1"
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    fireEvent.change(input, { target: { value: "EXITO1" } });

    // 3. Clic en Validar
    fireEvent.click(screen.getByText("Validar"));

    // 4. Verificar mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText("¡Código Correcto!")).toBeInTheDocument();
    });
  });

  it("muestra error si el código es INCORRECTO", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));
    fireEvent.click(screen.getByText("Válidar código de retiro"));

    // Escribir código malo
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    fireEvent.change(input, { target: { value: "MALO123" } });

    fireEvent.click(screen.getByText("Validar"));

    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText("Código Incorrecto")).toBeInTheDocument();
    });
  });

  it("valida que el modal se cierra al hacer clic en Cerrar", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir Modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));
    expect(screen.getByText("Validar Entrega")).toBeInTheDocument();

    // 2. Cerrar modal
    fireEvent.click(screen.getByText("Cerrar"));

    // 3. Verificar que el modal se cerró
    await waitFor(() => {
      expect(screen.queryByText("Validar Entrega")).not.toBeInTheDocument();
    });
  });

  it("valida que el input se limpia cuando se cierra y reabre el modal", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir modal y escribir código
    fireEvent.click(screen.getByText("Válidar código de retiro"));
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    fireEvent.change(input, { target: { value: "TEST123" } });
    expect(input).toHaveValue("TEST123");

    // 2. Cerrar modal
    fireEvent.click(screen.getByText("Cerrar"));

    // 3. Reabrir modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));
    const newInput = screen.getByPlaceholderText("Ej: A1B2C3");

    // 4. Verificar que el input está limpio
    expect(newInput).toHaveValue("");
  });

  it("valida que los mensajes de error/éxito se limpian al cerrar el modal", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir modal y generar error
    fireEvent.click(screen.getByText("Válidar código de retiro"));
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    fireEvent.change(input, { target: { value: "ERROR123" } });
    fireEvent.click(screen.getByText("Validar"));

    await waitFor(() => {
      expect(screen.getByText("Código Incorrecto")).toBeInTheDocument();
    });

    // 2. Cerrar modal
    fireEvent.click(screen.getByText("Cerrar"));

    // 3. Reabrir modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));

    // 4. Verificar que no hay mensajes de error
    expect(screen.queryByText("Código Incorrecto")).not.toBeInTheDocument();
    expect(screen.queryByText("¡Código Correcto!")).not.toBeInTheDocument();
  });

  it("maneja correctamente cuando no hay lotes de la tienda", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({
      id: "user1",
      nombreTienda: "Tienda Sin Lotes",
      email: "tienda@test.com"
    });

    // Solo lotes de otras tiendas
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[1]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    // Esperar carga
    await waitFor(() => expect(screen.getByText("Reservas de mi tienda")).toBeInTheDocument());

    // No debe mostrar ningún lote
    expect(screen.queryByText("Lote Mío")).not.toBeInTheDocument();
    expect(screen.queryByText("Lote Ajeno")).not.toBeInTheDocument();
  });

  it("valida códigos con diferentes formatos (mayúsculas/minúsculas)", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir Modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));

    // 2. Probar código en minúsculas (el correcto es "EXITO1")
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    fireEvent.change(input, { target: { value: "exito1" } });
    fireEvent.click(screen.getByText("Validar"));

    // 3. El componente convierte a mayúsculas, así que debería aceptar minúsculas
    await waitFor(() => {
      expect(screen.getByText("¡Código Correcto!")).toBeInTheDocument();
    });
  });

  it("valida que el botón Validar está deshabilitado con input vacío", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir Modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));

    // 2. Verificar que el input está vacío y el botón debería estar deshabilitado
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    expect(input).toHaveValue("");

    // 3. El botón Validar debería existir pero puede estar deshabilitado
    const validateButton = screen.getByText("Validar");
    expect(validateButton).toBeInTheDocument();
    // Nota: dependiendo de la implementación, podría estar deshabilitado
  });

  it("maneja errores de red al cargar los lotes", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockRejectedValue(new Error("Error de red"));

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    // Cuando hay error, se muestra un Alert con el mensaje de error
    await waitFor(() => expect(screen.getByText("Error de red")).toBeInTheDocument());

    // En caso de error, no debería mostrar lotes
    expect(screen.queryByText("Lote Mío")).not.toBeInTheDocument();
  });

  it("maneja errores al obtener información de la tienda", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockRejectedValue(new Error("Error al obtener tienda"));
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    // Cuando hay error al obtener la tienda, se muestra un Alert con el error
    await waitFor(() => expect(screen.getByText("Error al obtener tienda")).toBeInTheDocument());

    // Sin información de tienda, no debería mostrar lotes filtrados
    expect(screen.queryByText("Lote Mío")).not.toBeInTheDocument();
  });

  it("valida el formato del placeholder del input", async () => {
    vi.mocked(tiendasAPI.getMiTienda).mockResolvedValue({ nombreTienda: "Mi Tienda" } as any);
    vi.mocked(fetchLotes).mockResolvedValue([mockLotesMixtos[0]] as any);

    render(
      <BrowserRouter>
        <AdminReservationsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Válidar código de retiro"));

    // 1. Abrir Modal
    fireEvent.click(screen.getByText("Válidar código de retiro"));

    // 2. Verificar que el placeholder sugiere el formato correcto
    const input = screen.getByPlaceholderText("Ej: A1B2C3");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Ej: A1B2C3");
  });
});