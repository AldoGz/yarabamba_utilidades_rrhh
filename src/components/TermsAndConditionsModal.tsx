import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface TermsAndConditionsModalProps {
  open: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Términos y Condiciones</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Uso del Sistema:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Este sistema está diseñado para proporcionar acceso seguro mediante hashes y códigos de verificación.
          Al utilizar este servicio, usted acepta los siguientes términos y condiciones.
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Responsabilidades del Usuario:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Mantener la confidencialidad de su código de 4 dígitos<br />
          • No compartir su código con terceros<br />
          • Utilizar el sistema únicamente para fines legítimos<br />
          • Reportar cualquier actividad sospechosa inmediatamente
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Política de Privacidad:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          La información proporcionada será tratada con confidencialidad y utilizada únicamente
          para los fines establecidos. No compartimos datos personales con terceros sin su consentimiento.
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Limitación de Responsabilidad:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          No nos hacemos responsables por el uso indebido del sistema o por pérdidas que puedan
          surgir de errores técnicos, acceso no autorizado o mala utilización de las credenciales.
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Soporte y Ayuda:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Si tiene alguna pregunta o necesita asistencia, puede contactar a nuestro equipo de soporte
          a través de los canales oficiales de comunicación.
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
          Al continuar utilizando este sistema, usted confirma haber leído, entendido y aceptado
          estos términos y condiciones.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button onClick={onClose} variant="contained">
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
