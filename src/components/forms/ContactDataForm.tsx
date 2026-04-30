import React, { useState } from 'react';
import {
    Box,
    TextField,
    Grid,
    Alert,
    Typography,
    Fade,
    InputAdornment
} from '@mui/material';
import {
    ContactPhone,
    Email,
    Phone,
    CheckCircle,
    Error
} from '@mui/icons-material';

interface ContactDataFormProps {
    correo: string;
    tel1: string;
    tel2: string;
    errorTel1: boolean;
    onCorreoChange: (value: string) => void;
    onTel1Change: (value: string) => void;
    onTel2Change: (value: string) => void;
}

export default function ContactDataForm({
    correo,
    tel1,
    tel2,
    errorTel1,
    onCorreoChange,
    onTel1Change,
    onTel2Change
}: ContactDataFormProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && correo;
    const isTel1Valid = tel1.length === 9 && !errorTel1 && tel1;
    const isTel2Valid = !tel2 || tel2.length === 9;
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ContactPhone 
                    sx={{ 
                        fontSize: 28, 
                        color: '#2e7d32',
                        filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.2))'
                    }} 
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    Datos de Contacto
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                    <Fade in={!!(isEmailValid && isTel1Valid)}>
                        <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                    </Fade>
                </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Correo electrónico"
                    type="email"
                    value={correo}
                    onChange={e => onCorreoChange(e.target.value)}
                    fullWidth
                    placeholder="usuario@ejemplo.com"
                    helperText={isEmailValid ? "Correo válido" : "Correo electrónico válido para recibir notificaciones"}
                    required
                    size="small"
                    onFocus={() => setFocusedField('correo')}
                    onBlur={() => setFocusedField(null)}
                    error={correo && !isEmailValid}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ color: focusedField === 'correo' ? '#2e7d32' : 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        },
                        inputLabel: {
                            sx: { '&.Mui-focused': { color: '#2e7d32' } }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: correo && !isEmailValid ? 'rgba(211, 47, 47, 0.5)' : 'rgba(46, 125, 50, 0.5)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: correo && !isEmailValid ? '#d32f2f' : '#2e7d32',
                                borderWidth: 2
                            }
                        }
                    }}
                />
                {correo && !isEmailValid && (
                    <Fade in={true} timeout={300}>
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mt: 1, 
                                py: 0.5,
                                background: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
                                border: '1px solid rgba(211, 47, 47, 0.2)'
                            }} 
                            icon={<Error sx={{ fontSize: 16 }} />}
                        >
                            Formato de correo inválido
                        </Alert>
                    </Fade>
                )}
                {isEmailValid && (
                    <Fade in={true} timeout={300}>
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mt: 1, 
                                py: 0.5,
                                background: 'linear-gradient(145deg, #f0f9f0 0%, #e8f5e8 100%)',
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }} 
                            icon={<CheckCircle sx={{ fontSize: 16 }} />}
                        >
                            Correo electrónico válido ✓
                        </Alert>
                    </Fade>
                )}
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Teléfono principal"
                        value={tel1}
                        onChange={e => onTel1Change(e.target.value)}
                        fullWidth
                        error={errorTel1 || (tel1 && tel1.length > 0 && tel1.length < 9)}
                        helperText={
                            errorTel1 
                                ? 'Este campo es obligatorio' 
                                : tel1 && tel1.length > 0 && tel1.length < 9
                                ? 'Debe tener 9 dígitos'
                                : '9 dígitos sin guiones'
                        }
                        placeholder="987654321"
                        required
                        size="small"
                        onFocus={() => setFocusedField('tel1')}
                        onBlur={() => setFocusedField(null)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: focusedField === 'tel1' ? '#2e7d32' : 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                autoComplete: 'off'
                            },
                            inputLabel: {
                                sx: { '&.Mui-focused': { color: '#2e7d32' } }
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: errorTel1 || (tel1 && tel1.length > 0 && tel1.length < 9) ? 'rgba(211, 47, 47, 0.5)' : 'rgba(46, 125, 50, 0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: errorTel1 || (tel1 && tel1.length > 0 && tel1.length < 9) ? '#d32f2f' : '#2e7d32',
                                    borderWidth: 2
                                }
                            }
                        }}
                    />
                    {isTel1Valid && (
                        <Fade in={true} timeout={300}>
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mt: 1, 
                                    py: 0.5,
                                    background: 'linear-gradient(145deg, #f0f9f0 0%, #e8f5e8 100%)',
                                    border: '1px solid rgba(76, 175, 80, 0.2)'
                                }} 
                                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                            >
                                Teléfono válido ✓
                            </Alert>
                        </Fade>
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Teléfono secundario"
                        value={tel2}
                        onChange={e => onTel2Change(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        fullWidth
                        placeholder="987654322"
                        helperText={tel2 && tel2.length > 0 && tel2.length < 9 ? 'Debe tener 9 dígitos' : 'Opcional'}
                        error={tel2 && tel2.length > 0 && tel2.length < 9}
                        size="small"
                        onFocus={() => setFocusedField('tel2')}
                        onBlur={() => setFocusedField(null)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: focusedField === 'tel2' ? '#2e7d32' : 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                autoComplete: 'off'
                            },
                            inputLabel: {
                                sx: { '&.Mui-focused': { color: '#2e7d32' } }
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: tel2 && tel2.length > 0 && tel2.length < 9 ? 'rgba(211, 47, 47, 0.5)' : 'rgba(46, 125, 50, 0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: tel2 && tel2.length > 0 && tel2.length < 9 ? '#d32f2f' : '#2e7d32',
                                    borderWidth: 2
                                }
                            }
                        }}
                    />
                    {isTel2Valid && tel2 && (
                        <Fade in={true} timeout={300}>
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mt: 1, 
                                    py: 0.5,
                                    background: 'linear-gradient(145deg, #f0f9f0 0%, #e8f5e8 100%)',
                                    border: '1px solid rgba(76, 175, 80, 0.2)'
                                }} 
                                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                            >
                                Teléfono secundario válido ✓
                            </Alert>
                        </Fade>
                    )}
                </Grid>
            </Grid>

            {errorTel1 && (
                <Fade in={true} timeout={300}>
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 2,
                            background: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                        icon={<Error />}
                    >
                        El número de teléfono principal es obligatorio
                    </Alert>
                </Fade>
            )}
        </Box>
    );
}
