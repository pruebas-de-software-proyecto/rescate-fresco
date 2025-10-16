import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LotesPage from "./pages/LotesPage";
import LotesGestionPage from "./pages/LotesGestionPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LotesPage />} />
        
        <Route path="/lotes-gestion" element={<LotesGestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
