import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import Reservation from '../pages/Reservation';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/lotes-gestion" element={<LotesGestionPage />} />
        <Route path="/reservas" element={<Reservation />} />
      </Routes>
    </BrowserRouter>
  )
}

