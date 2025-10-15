import { useState } from 'react';

interface SearchBarProps {
  onSearch: (filters: {
    search: string;
    categoria: string;
    estado: string;
    ordenar: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [ordenar, setOrdenar] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search, categoria, estado, ordenar });
  };

  const handleReset = () => {
    setSearch('');
    setCategoria('');
    setEstado('');
    setOrdenar('');
    onSearch({ search: '', categoria: '', estado: '', ordenar: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por código, producto o proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          <option value="Frutas">Frutas</option>
          <option value="Verduras">Verduras</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Carnes">Carnes</option>
          <option value="Panadería">Panadería</option>
          <option value="Otros">Otros</option>
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservado">Reservado</option>
          <option value="Donado">Donado</option>
          <option value="Vencido">Vencido</option>
        </select>

        <select
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value)}
          className="filter-select"
        >
          <option value="">Ordenar por...</option>
          <option value="vencimiento-asc">Vencimiento (próximo)</option>
          <option value="vencimiento-desc">Vencimiento (lejano)</option>
          <option value="nombre-asc">Nombre (A-Z)</option>
          <option value="nombre-desc">Nombre (Z-A)</option>
        </select>

        <button type="submit" className="btn-search">
          🔍 Buscar
        </button>

        <button type="button" onClick={handleReset} className="btn-reset">
          ↻ Limpiar
        </button>
      </div>
    </form>
  );
}