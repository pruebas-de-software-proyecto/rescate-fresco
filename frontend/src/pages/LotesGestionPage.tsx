import React from 'react';
import LoteTable from '../components/loteTable';
import DashboardLayout from '../components/DashboardLayout';

const LotesGestionPage: React.FC = () => {
  return (
   <DashboardLayout title="Gestión de Lotes ">
      <LoteTable />
    </DashboardLayout>
  );
};

export default LotesGestionPage;