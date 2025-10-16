// frontend/src/components/DashboardLayout.tsx
import React from 'react';
import { CssBaseline, Container, Box, Typography } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ backgroundColor: '#11904aff', color: 'white', p: 2 }}>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>{children}</Container>
      </Box>
    </>
  );
};

export default DashboardLayout;
