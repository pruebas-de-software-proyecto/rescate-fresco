
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage/DetailPage';
import LotesGestionPage from '../pages/LotesGestionPage';
import LotesPage from '../pages/LotesPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route path="/gestion-lotes" element={<LotesGestionPage />} />
        <Route path= "/register" element={<RegisterPage/>}/>
        <Route path= "/login" element={<LoginPage/>}/>  
      </Routes>
    </BrowserRouter>
  )
}