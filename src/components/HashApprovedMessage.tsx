import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';

const HashApprovedMessage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            component="div"
            sx={{
              fontSize: 64,
              color: 'success.main',
              mb: 2
            }}
          >
            ✓
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Aprobado por Colaborador
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            ¡Felicidades! Tu aprobación se ha completado exitosamente.
          </Typography>
        </Alert>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Tu código de aprobación ha sido validado y el proceso ha sido completado.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gracias por utilizar nuestro sistema de aprobación.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Si tienes alguna pregunta, por favor contacta al soporte técnico.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HashApprovedMessage;
