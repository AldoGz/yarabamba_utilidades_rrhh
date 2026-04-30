import React from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Fade,
    Zoom,
    Alert,
    Divider,
    Backdrop,
    Button,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { usePageUpdate } from '../hooks/usePageUpdate.ts';

// Component imports
import BankDataForm from '../components/forms/BankDataForm';
import ContactDataForm from '../components/forms/ContactDataForm';
import FormStepper from '../components/forms/FormStepper';
import NavigationButtons from '../components/forms/NavigationButtons';
import UserInfoCard from '../components/cards/UserInfoCard';
import Header from '../components/layout/Header';

export default function PageUpdate() {
    const navigate = useNavigate();

    // Usar el hook que contiene toda la lógica
    const {
        activeStep,
        error,
        showSuccessModal,
        guardado,
        formValues,
        errors,
        isValid,
        control,
        handleSubmit,
        setValue,
        watch,
        handleNext,
        handleBack,
        steps,
        isStepValid,
        updateUser,
        user
    } = usePageUpdate();

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Zoom in={true} timeout={500}>
                    <Paper
                        elevation={12}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            minWidth: { xs: '95%', sm: 480 },
                            maxWidth: 600,
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(46, 125, 50, 0.1)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(46, 125, 50, 0.06)',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #2e7d32 100%)',
                                zIndex: 1
                            }
                        }}
                    >
                        {/* Decorative background */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 200,
                                height: 200,
                                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                                borderRadius: '0 0 0 100%',
                                pointerEvents: 'none',
                                zIndex: 0
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -50,
                                left: -50,
                                width: 150,
                                height: 150,
                                background: 'linear-gradient(135deg, rgba(206, 107, 1, 0.08) 0%, rgba(255, 152, 0, 0.04) 100%)',
                                borderRadius: '50%',
                                pointerEvents: 'none',
                                zIndex: 0
                            }}
                        />

                        {/* Header */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 4, 
                            position: 'relative', 
                            zIndex: 2 
                        }}>
                            <Tooltip title="Volver">
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        bgcolor: 'rgba(46, 125, 50, 0.08)',
                                        color: '#2e7d32',
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': { 
                                            bgcolor: 'rgba(46, 125, 50, 0.12)',
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        }
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                            
                            {/* User Name Display */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                px: 2,                                
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                                    }}
                                >
                                    {user?.nombresCompletos ? user.nombresCompletos.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </Box>
                                <Box>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: '#2e7d32',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {user?.nombresCompletos || 'Usuario'}
                                    </Typography>
                                    {user?.numeroDocumento && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                display: 'block'
                                            }}
                                        >
                                            DNI: {user.numeroDocumento}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Stepper */}
                        <Box sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
                            <FormStepper activeStep={activeStep} steps={steps} />
                        </Box>

                        {/* Form sections */}
                        <Fade in={true} timeout={600}>
                            <Box sx={{ position: 'relative', zIndex: 2 }}>
                                {activeStep === 0 && (
                                    <Controller
                                        name="banco"
                                        control={control}
                                        render={({ field }) => (
                                            <BankDataForm
                                                banco={field.value}
                                                cuenta={formValues.cuenta}
                                                cci={formValues.cci}
                                                errorCci={!!errors.cci}
                                                onBancoChange={field.onChange}
                                                onCuentaChange={(value) => setValue('cuenta', value)}
                                                onCciChange={(value) => setValue('cci', value.replace(/\s/g, '').slice(0, 20))}
                                            />
                                        )}
                                    />
                                )}

                                {activeStep === 1 && (
                                    <Controller
                                        name="correo"
                                        control={control}
                                        render={({ field }) => (
                                            <ContactDataForm
                                                correo={field.value}
                                                tel1={formValues.tel1}
                                                tel2={formValues.tel2 || ''}
                                                errorTel1={!!errors.tel1}
                                                onCorreoChange={field.onChange}
                                                onTel1Change={(value) => setValue('tel1', value.replace(/\D/g, '').slice(0, 9))}
                                                onTel2Change={(value) => setValue('tel2', value.replace(/\D/g, '').slice(0, 9))}
                                            />
                                        )}
                                    />
                                )}
                            </Box>
                        </Fade>

                        {/* Error message */}
                        {error && (
                            <Fade in={true} timeout={500}>
                                <Box>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 2,
                                            mt: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
                                            border: '1px solid rgba(211, 47, 47, 0.2)',
                                            '& .MuiAlert-icon': {
                                                fontSize: 24,
                                                color: '#d32f2f'
                                            },
                                            '& .MuiAlert-message': {
                                                fontWeight: 500
                                            },
                                            animation: 'shake 0.5s ease-in-out'
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            Error al guardar
                                        </Typography>
                                        <Typography variant="body2">
                                            {error}
                                        </Typography>
                                    </Alert>
                                </Box>
                            </Fade>
                        )}

                        {/* Navigation buttons */}
                        <Box sx={{ mt: 4, position: 'relative', zIndex: 2 }}>
                            <NavigationButtons
                                activeStep={activeStep}
                                totalSteps={steps.length}
                                isStepValid={isStepValid(activeStep)}
                                onBack={handleBack}
                                onNext={handleNext}
                            />
                        </Box>
                    </Paper>
                </Zoom>
            </Box>

            {/* Backdrop de éxito con botón para cerrar sesión */}
            <Backdrop
                open={showSuccessModal}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                }}
            >
                <Fade in={showSuccessModal}>
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 3,
                            p: 5,
                            textAlign: 'center',
                            minWidth: 350,
                            maxWidth: 450,
                            color: 'text.primary',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(46, 125, 50, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #2e7d32 100%)'
                            }
                        }}
                    >
                        {updateUser.isPending ? (
                            <>
                                <CircularProgress 
                                    size={60} 
                                    sx={{ 
                                        mb: 3,
                                        color: '#2e7d32',
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round'
                                        }
                                    }} 
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Guardando cambios...
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Por favor espera mientras se actualizan tus datos.
                                </Typography>
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 70,
                                        color: '#2e7d32',
                                        mb: 3,
                                        filter: 'drop-shadow(0 4px 8px rgba(46, 125, 50, 0.3))'
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    ¡Se actualizó correctamente!
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                    Tus datos han sido actualizados exitosamente.
                                </Typography>

                                {/* Botón que navega a "/" */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/')}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)'
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    Volver al inicio
                                </Button>
                            </>
                        )}
                    </Box>
                </Fade>
            </Backdrop>
        </>
    );
}
