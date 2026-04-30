import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Error } from '@mui/icons-material';

const HashInvalidMessage = () => {

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Error
            sx={{
              fontSize: 64,
              color: 'error.main',
              mb: 2
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom color="error.main">
            Enlace No Válido
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            El enlace de aprobación que intentas utilizar no es válido o no existe en nuestro sistema.
          </Typography>
        </Alert>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Esto puede ocurrir por varias razones:
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" component="div">
              • El enlace ha sido escrito incorrectamente<br />
              • El enlace ha sido modificado o corrompido<br />
              • El enlace nunca existió en nuestro sistema<br />
              • El enlace ha sido eliminado o desactivado
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Por favor verifica que el enlace sea correcto o solicita un nuevo enlace
            de aprobación al administrador del sistema.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Si crees que esto es un error o necesitas ayuda, por favor contacta al
            soporte técnico.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HashInvalidMessage;
