// pages/HashPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHashValidation } from '../hooks/useHashValidation';
import HashExpiredMessage from '../components/HashExpiredMessage';
import HashInvalidMessage from '../components/HashInvalidMessage';
import HashApprovedMessage from '../components/HashApprovedMessage';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import OTPInput from '../components/OTPInput';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  Tooltip,
  Backdrop,
  alpha,
  useTheme,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';

const HashPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const theme = useTheme();

  const {
    hashStatus,
    isValidatingHash,
    isLoading,
    error,
    termsModalOpen,
    setTermsModalOpen,
    initializeHashValidation,
    onSubmit,
    formControl,
  } = useHashValidation();

  const otpInputRef = useRef<HTMLDivElement>(null);

  // Inicializar la validación del hash una sola vez
  useEffect(() => {
    if (hash) {
      initializeHashValidation(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]); // solo depende de hash, no de initializeHashValidation (que es estable)

  // Enfocar el primer input del OTP cuando el formulario esté listo
  useEffect(() => {
    if (!isValidatingHash && hashStatus === 'valid' && otpInputRef.current) {
      const firstInput = otpInputRef.current.querySelector('input');
      firstInput?.focus();
    }
  }, [isValidatingHash, hashStatus]);

  // Pantalla de carga con Backdrop
  if (isValidatingHash) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          /* zIndex: (theme) => theme.zIndex.drawer + 1, */
          /* position: 'fixed', */
        }}
        open={true}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              animationDuration: '1.4s',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500, textAlign: 'center' }}>
            Validando acceso...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
            Estamos verificando el estado de tu enlace. Por favor, espera un momento.
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  // Estados terminales: inválido, expirado, aprobado
  if (hashStatus === 'invalid' || !hash) return <HashInvalidMessage />;
  if (hashStatus === 'expired') return <HashExpiredMessage />;
  if (hashStatus === 'approved') return <HashApprovedMessage />;

  // Estado 'valid': mostrar formulario
  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(
            theme.palette.background.default,
            0.95
          )} 100%)`,
          backdropFilter: 'blur(4px)',
          boxShadow: `0 20px 35px -12px ${alpha(theme.palette.common.black, 0.15)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
            }}
          >
            Acceso Seguro
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => formControl.setError('code', { type: 'manual', message: '' })}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(hash!); }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, textAlign: 'center', fontWeight: 500, color: theme.palette.text.primary }}
          >
            Ingresa tu código de 4 dígitos
          </Typography>

          <Box ref={otpInputRef}>
            <OTPInput
              control={formControl.control}
              name="code"
              errors={formControl.formState.errors}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!formControl.formState.isValid || isLoading}
              startIcon={isLoading ? <CircularProgress size={22} color="inherit" /> : null}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: `0 8px 16px -6px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'transform 0.1s ease',
                '&:active': { transform: 'scale(0.98)' },
              }}
            >
              {isLoading ? 'Verificando...' : 'Validar Código'}
            </Button>

            <Tooltip title="Términos y condiciones" arrow>
              <IconButton
                onClick={() => setTermsModalOpen(true)}
                color="primary"
                aria-label="Abrir términos y condiciones"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15), transform: 'scale(1.05)' },
                  transition: 'all 0.2s',
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </form>
      </Paper>

      <TermsAndConditionsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      {/* Backdrop para validación y carga */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'fixed',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={isValidatingHash || isLoading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              animationDuration: '1.4s',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500, textAlign: 'center' }}>
            {isValidatingHash ? 'Validando acceso...' : 'Procesando aprobación...'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
            {isValidatingHash 
              ? 'Estamos verificando el estado de tu enlace. Por favor, espera un momento.'
              : 'Estamos procesando tu código de aprobación.'
            }
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default HashPage;