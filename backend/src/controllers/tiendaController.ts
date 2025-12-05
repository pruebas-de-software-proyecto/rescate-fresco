import { Request, Response } from 'express';
import Lot from '../models/lotModels';
import { User } from '../models/user.model';

export const getMiTienda = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }

    const usuario = await User.findById(userId).select('nombreTienda email role');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: usuario._id,
      nombreTienda: usuario.nombreTienda,
      email: usuario.email
    });

  } catch (error) {
    console.error('Error al obtener perfil de tienda:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getMetricas = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'No estás autenticado' });
    }

    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener todos los lotes del proveedor (buscar por nombreTienda)
    let lotes = await Lot.find({ proveedor: usuario.nombreTienda });
    
    console.log(`Búsqueda por proveedor: "${usuario.nombreTienda}", encontrados ${lotes.length} lotes`);
    
    // Si no encuentra lotes, intentar búsqueda alternativa (en caso que el campo esté vacío)
    if (lotes.length === 0) {
      console.log('No se encontraron lotes por proveedor, buscando todos los lotes...');
      lotes = await Lot.find({});
      console.log(`Total de lotes en BD: ${lotes.length}`);
    }

    // Calcular métricas
    const ingresos = lotes
      .filter(l => l.estado === 'pagado' || l.estado === 'retirado')
      .reduce((sum, l) => sum + (l.precioRescate * l.cantidad), 0);

    const kgRescatados = lotes
      .filter(l => l.estado === 'pagado' || l.estado === 'retirado')
      .reduce((sum, l) => {
        if (l.unidad === 'kg') return sum + l.cantidad;
        // Conversiones aproximadas
        if (l.unidad === 'litros') return sum + l.cantidad;
        return sum;
      }, 0);

    const totalDisponibles = lotes.filter(l => l.estado === 'Disponible').length;
    const totalRetirados = lotes.filter(l => l.estado === 'retirado').length;
    const tasaRetiro = totalDisponibles + totalRetirados > 0 
      ? Math.round((totalRetirados / (totalDisponibles + totalRetirados)) * 100)
      : 0;

    const mermaEvitada = lotes
      .filter(l => l.estado === 'pagado' || l.estado === 'retirado')
      .reduce((sum, l) => sum + (l.precioOriginal - l.precioRescate), 0);

    // Evolución semanal (últimos 7 días)
    const hoy = new Date();
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const evolucionSemanal = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hace7Dias.getTime() + i * 24 * 60 * 60 * 1000);
      const dia = fecha.toLocaleDateString('es-CL', { weekday: 'short' });
      
      const lotesDelDia = lotes.filter(l => {
        const fechaLote = new Date(l.createdAt || 0);
        return fechaLote.toDateString() === fecha.toDateString();
      });

      const ingresoDia = lotesDelDia
        .filter(l => l.estado === 'pagado' || l.estado === 'retirado')
        .reduce((sum, l) => sum + (l.precioRescate * l.cantidad), 0);

      const kgDia = lotesDelDia
        .filter(l => l.unidad === 'kg')
        .reduce((sum, l) => sum + l.cantidad, 0);

      evolucionSemanal.push({
        dia,
        ingresos: ingresoDia,
        kg: kgDia
      });
    }

    // Categorías top
    const categoriasMap = new Map<string, number>();
    lotes.forEach(l => {
      categoriasMap.set(l.categoria, (categoriasMap.get(l.categoria) || 0) + l.cantidad);
    });

    const categoriasTop = Array.from(categoriasMap.entries())
      .map(([cat, qty]) => ({ categoria: cat, cantidad: qty }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 4);

    // Estado de lotes
    const estadoLotes = {
      vendidos: lotes.filter(l => l.estado === 'retirado').length,
      vencidos: lotes.filter(l => l.estado === 'vencido').length,
      cancelados: lotes.filter(l => l.estado === 'Reservado').length
    };

    // Tiempo promedio de venta
    const lotesVendidos = lotes.filter(l => l.estado === 'retirado' || l.estado === 'pagado');
    const tiempoPromedio = lotesVendidos.length > 0
      ? Math.round(
          lotesVendidos.reduce((sum, l) => {
            const fechaCreacion = new Date(l.createdAt || 0);
            const hoy = new Date();
            return sum + (hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60);
          }, 0) / lotesVendidos.length
        )
      : 0;

    res.json({
      ingresos,
      kgRescatados: Math.round(kgRescatados),
      tasaRetiro,
      mermaEvitada: Math.round(mermaEvitada),
      evolucionSemanal,
      categoriasTop,
      estadoLotes,
      tiempoPromedio,
      totalLotes: lotes.length
    });

  } catch (error) {
    console.error('Error al obtener métricas:', error);
    res.status(500).json({ message: 'Error del servidor', error: (error as Error).message });
  }
};