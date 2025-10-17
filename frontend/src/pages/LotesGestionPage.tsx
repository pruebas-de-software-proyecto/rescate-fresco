import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoteTable from '../components/loteTable';

const LotesGestionPage: React.FC = () => {
  return (
   <DashboardLayout title="Gestión de Lotes ">
      <LoteTable />
    </DashboardLayout>
  );
};

export default LotesGestionPage;