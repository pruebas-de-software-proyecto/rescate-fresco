
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import { ReservationsPage } from '../pages/ReservationsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/reservation" element={<ReservationsPage />} />
        <Route path="/lotes-gestion" element={<LotesGestionPage />} />
      </Routes>
    </BrowserRouter>
  )
}