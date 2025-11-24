import { jsx as _jsx } from "react/jsx-runtime";
import DashboardLayout from '../components/DashboardLayout';
import LoteTable from '../components/loteTable';
const LotesGestionPage = () => {
    return (_jsx(DashboardLayout, { title: "Gesti\u00F3n de Lotes ", children: _jsx(LoteTable, {}) }));
};
export default LotesGestionPage;
