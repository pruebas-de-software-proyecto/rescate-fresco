import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoteTable from '../components/loteTable';

const LotesGestionPage: React.FC = () => {
  return (
    <DashboardLayout>
      <LoteTable />
    </DashboardLayout>
  );
};

export default LotesGestionPage;