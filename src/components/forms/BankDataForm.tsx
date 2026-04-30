import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Alert,
    Fade,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    AccountBalance,
    CreditCard,
    CheckCircle,
    Error,
    Info
} from '@mui/icons-material';
import { bancos, Banco } from '../../utils/bankUtils';
import TextMaskCustom from './TextMaskCustom';

interface BankDataFormProps {
    banco: string;
    cuenta: string;
    cci: string;
    errorCci: boolean;
    onBancoChange: (value: string) => void;
    onCuentaChange: (value: string) => void;
    onCciChange: (value: string) => void;
}

export default function BankDataForm({
    banco,
    cuenta,
    cci,
    errorCci,
    onBancoChange,
    onCuentaChange,
    onCciChange
}: BankDataFormProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const bancoSeleccionado = bancos.find(b => b.value === banco);
    const mascaraActual = banco ? bancos.find(b => b.value === banco)?.formato.replace(/X/g, '0') : '000-00000000-0-00';
    
    const isCciValid = cci.length === 20 && !errorCci && cci;
    const isCuentaValid = cuenta && bancoSeleccionado && cuenta.length >= bancoSeleccionado.formato.replace(/[-]/g, '').length;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalance 
                    sx={{ 
                        fontSize: 28, 
                        color: '#2e7d32',
                        filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.2))'
                    }} 
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    Información Bancaria
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                    <Fade in={!!(isCuentaValid && isCciValid)}>
                        <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                    </Fade>
                </Box>
            </Box>

            <TextField
                select
                label="Banco"
                value={banco}
                onChange={e => onBancoChange(e.target.value)}
                fullWidth
                margin="normal"
                helperText={!banco ? "Seleccione el banco de su cuenta" : ""}
                required
                size="small"
                onFocus={() => setFocusedField('banco')}
                onBlur={() => setFocusedField(null)}
                slotProps={{
                    select: {
                        displayEmpty: true,
                        renderValue: (value) => {
                            const selected = bancos.find(b => b.value === value);
                            return selected ? `${selected.icon} ${selected.label}` : 'Seleccione un banco';
                        },
                        sx: { 
                            '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: focusedField === 'banco' ? '#2e7d32' : 'rgba(0, 0, 0, 0.23)',
                                borderWidth: focusedField === 'banco' ? 2 : 1
                            }
                        }
                    },
                    inputLabel: {
                        required: false,
                        sx: { 
                            '&.Mui-focused': { color: '#2e7d32' }
                        }
                    },
                    formHelperText: {
                        sx: { ml: 0, mt: 0.5, mb: 2 }
                    }
                }}
                InputProps={{
                    startAdornment: banco && (
                        <InputAdornment position="start">
                            <AccountBalance sx={{ color: '#2e7d32' }} />
                        </InputAdornment>
                    )
                }}
            >
                {bancos.map(b => (
                    <MenuItem key={b.value} value={b.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{b.icon}</span>
                            <span>{b.label}</span>
                        </Box>
                    </MenuItem>
                ))}
            </TextField>

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                    Número de Cuenta *
                </Typography>
                {banco ? (
                    <TextField
                        value={cuenta}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/[-\s]/g, '');
                            onCuentaChange(rawValue);
                        }}
                        fullWidth
                        placeholder={bancoSeleccionado?.ejemplo}
                        helperText={`Formato ${bancoSeleccionado?.formato} - Ej: ${bancoSeleccionado?.ejemplo}`}
                        required
                        size="small"
                        onFocus={() => setFocusedField('cuenta')}
                        onBlur={() => setFocusedField(null)}
                        slotProps={{
                            input: {
                                autoComplete: 'off',
                                inputComponent: TextMaskCustom as any,
                                inputProps: {
                                    mask: mascaraActual,
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard sx={{ color: focusedField === 'cuenta' ? '#2e7d32' : 'text.secondary', fontSize: 20 }} />
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
                                    borderColor: 'rgba(46, 125, 50, 0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2e7d32',
                                    borderWidth: 2
                                }
                            }
                        }}
                    />
                ) : (
                    <TextField
                        fullWidth
                        disabled
                        placeholder="Primero seleccione un banco"
                        helperText="Seleccione un banco para ingresar el número de cuenta"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard sx={{ color: 'text.secondary', fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                )}
                {isCuentaValid && (
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
                            Número de cuenta válido ✓
                        </Alert>
                    </Fade>
                )}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                    CCI (Código de Cuenta Interbancario) *
                </Typography>
                <TextField
                    value={cci}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\s/g, '');
                        onCciChange(rawValue);
                    }}
                    fullWidth
                    error={errorCci}
                    helperText={
                        errorCci
                            ? 'El CCI debe tener exactamente 20 dígitos'
                            : 'Ingrese los 20 dígitos del CCI (se formatea automáticamente)'
                    }
                    placeholder="0021 2345 6789 0123 4567"
                    required
                    size="small"
                    onFocus={() => setFocusedField('cci')}
                    onBlur={() => setFocusedField(null)}
                    slotProps={{
                        input: {
                            autoComplete: 'off',
                            inputComponent: TextMaskCustom as any,
                            inputProps: {
                                mask: '0000 0000 0000 0000 0000',
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCard sx={{ color: focusedField === 'cci' ? '#2e7d32' : 'text.secondary', fontSize: 20 }} />
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
                                borderColor: errorCci ? 'rgba(211, 47, 47, 0.5)' : 'rgba(46, 125, 50, 0.5)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: errorCci ? '#d32f2f' : '#2e7d32',
                                borderWidth: 2
                            }
                        }
                    }}
                />
                {isCciValid && (
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
                            CCI válido ✓
                        </Alert>
                    </Fade>
                )}
                {errorCci && (
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
                            Formato de CCI inválido
                        </Alert>
                    </Fade>
                )}
            </Box>
        </Box>
    );
}
