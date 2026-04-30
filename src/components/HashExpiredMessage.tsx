import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const HashExpiredMessage = () => {

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <AccessTime
            sx={{
              fontSize: 64,
              color: 'warning.main',
              mb: 2
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom color="warning.main">
            Enlace Expirado
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            El enlace de aprobación que intentas utilizar ya no está activo o ha expirado.
          </Typography>
        </Alert>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Los enlaces de aprobación tienen un tiempo limitado de vigencia por razones de seguridad.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Si necesitas un nuevo enlace de aprobación, por favor contacta al administrador
            del sistema o solicita un nuevo enlace.
          </Typography>
        </Box>



        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Si crees que esto es un error, por favor contacta al soporte técnico.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HashExpiredMessage;
