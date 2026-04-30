import React from 'react';
import {
    Box,
    Button,
    Typography,
    Divider,
    Fade,
    Zoom
} from '@mui/material';
import {
    Save,
    ArrowBack,
    ArrowForward
} from '@mui/icons-material';

interface NavigationButtonsProps {
    activeStep: number;
    totalSteps: number;
    isStepValid: boolean;
    onBack: () => void;
    onNext: () => void;
}

export default function NavigationButtons({
    activeStep,
    totalSteps,
    isStepValid,
    onBack,
    onNext
}: NavigationButtonsProps) {
    const isLastStep = activeStep === totalSteps - 1;

    return (
        <>
            <Divider 
                sx={{ 
                    my: 3,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(46, 125, 50, 0.2) 50%, transparent 100%)',
                    height: 2
                }} 
            />

            <Box sx={{ 
                display: 'flex', 
                gap: { xs: 2, sm: 3 }, 
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' }
            }}>
                <Button
                    onClick={onBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    size="medium"
                    startIcon={<ArrowBack />}
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        borderColor: '#2e7d32',
                        color: activeStep === 0 ? 'text.secondary' : '#2e7d32',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover:not(:disabled)': {
                            borderColor: '#1b5e20',
                            bgcolor: 'rgba(46, 125, 50, 0.04)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)'
                        },
                        '&:disabled': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                        },
                        '&:active:not(:disabled)': {
                            transform: 'translateY(0)'
                        }
                    }}
                >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Anterior</Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Volver</Box>
                </Button>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    order: { xs: -1, sm: 0 }
                }}>
                    <Fade in={true} timeout={800}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                        >
                            {activeStep + 1} / {totalSteps}
                        </Typography>
                    </Fade>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 0.5,
                        alignItems: 'center'
                    }}>
                        {[...Array(totalSteps)].map((_, index) => (
                            <Zoom in={true} timeout={600 + index * 100} key={index}>
                                <Box
                                    sx={{
                                        width: { xs: 6, sm: 8 },
                                        height: { xs: 6, sm: 8 },
                                        borderRadius: '50%',
                                        bgcolor: index <= activeStep ? '#2e7d32' : 'rgba(0, 0, 0, 0.12)',
                                        transition: 'all 0.3s ease-in-out',
                                        transform: index === activeStep ? 'scale(1.2)' : 'scale(1)',
                                        boxShadow: index === activeStep ? '0 2px 8px rgba(46, 125, 50, 0.3)' : 'none'
                                    }}
                                />
                            </Zoom>
                        ))}
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={!isStepValid}
                    size="medium"
                    endIcon={isLastStep ? <Save /> : <ArrowForward />}
                    sx={{
                        px: { xs: 2, sm: 4 },
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        background: isStepValid 
                            ? 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)' 
                            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover:not(:disabled)': {
                            background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)'
                        },
                        '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                        },
                        '&:active:not(:disabled)': {
                            transform: 'translateY(0)'
                        }
                    }}
                >
                    {isLastStep ? 'Guardar Cambios' : 'Continuar'}
                </Button>
            </Box>
        </>
    );
}
