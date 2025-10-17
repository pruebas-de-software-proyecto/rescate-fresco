
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/lotes-gestion" element={<LotesGestionPage />} />
      </Routes>
    </BrowserRouter>
  )
}