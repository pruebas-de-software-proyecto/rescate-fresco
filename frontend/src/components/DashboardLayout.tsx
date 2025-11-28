import React from 'react';
import { CssBaseline, Container, Box } from '@mui/material';


interface Props {

  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
        
        <Container sx={{ mt: 4, mb: 4, flexGrow: 1, maxWidth: 'lg' }}>
            {children}
        </Container>
      </Box>
    </>
  );
};

export default DashboardLayout;