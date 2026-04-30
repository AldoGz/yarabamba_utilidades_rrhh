import React from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    StepIcon,
    Box,
    Fade,
    Zoom
} from '@mui/material';
import {
    CheckCircle,
    RadioButtonUnchecked,
    Check
} from '@mui/icons-material';

interface StepIconProps {
    active: boolean;
    completed: boolean;
    icon: number;
}

interface FormStepperProps {
    activeStep: number;
    steps: string[];
}

const CustomStepIcon = ({ active, completed, icon }: { active: boolean; completed: boolean; icon: number }) => {
    return (
        <Zoom in={true} timeout={300}>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {completed ? (
                    <CheckCircle
                        sx={{
                            fontSize: 32,
                            color: '#4caf50',
                            filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
                            zIndex: 2
                        }}
                    />
                ) : active ? (
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                            zIndex: 2,
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        {icon}
                    </Box>
                ) : (
                    <RadioButtonUnchecked
                        sx={{
                            fontSize: 32,
                            color: 'rgba(0, 0, 0, 0.26)',
                            zIndex: 2
                        }}
                    />
                )}
                {active && (
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'rgba(46, 125, 50, 0.1)',
                            animation: 'ripple 2s infinite',
                            zIndex: 1
                        }}
                    />
                )}
            </Box>
        </Zoom>
    );
};

export default function FormStepper({ activeStep, steps }: FormStepperProps) {
    return (
        <Box sx={{ mb: 4, mt: 2 }}>
            <Stepper 
                activeStep={activeStep} 
                sx={{
                    '& .MuiStepConnector-line': {
                        borderColor: activeStep > 0 ? '#4caf50' : 'rgba(0, 0, 0, 0.12)',
                        borderTopWidth: 2,
                        transition: 'all 0.3s ease-in-out'
                    },
                    '& .MuiStepConnector-active .MuiStepConnector-line': {
                        borderColor: '#2e7d32'
                    },
                    '& .MuiStepConnector-completed .MuiStepConnector-line': {
                        borderColor: '#4caf50'
                    }
                }}
            >
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            icon={
                                <CustomStepIcon
                                    active={index === activeStep}
                                    completed={index < activeStep}
                                    icon={index + 1}
                                />
                            }
                        >
                            <Fade in={true} timeout={400 + index * 100}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontWeight: activeStep === index ? 700 : 400,
                                        color: activeStep === index ? '#2e7d32' : 'text.secondary',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    {label}
                                </Typography>
                            </Fade>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    
                    @keyframes ripple {
                        0% {
                            transform: scale(0.8);
                            opacity: 0.6;
                        }
                        100% {
                            transform: scale(1.2);
                            opacity: 0;
                        }
                    }
                `
            }} />
        </Box>
    );
}
