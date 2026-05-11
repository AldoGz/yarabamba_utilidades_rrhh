import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import {
    Email as EmailIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    GroupWork as GroupWorkIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { sendBatchEmail } from '../../api/personal';

interface LotesListProps {
    lotes: string[];
    color: string;
    onSendEmail?: (batchIds: string[]) => Promise<void>;
}

export default function LotesList({ lotes, color, onSendEmail }: LotesListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLotes, setSelectedLotes] = useState<Set<string>>(new Set());
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isSendingEmails, setIsSendingEmails] = useState(false);
    const [emailProgress, setEmailProgress] = useState({ current: 0, total: 0, processing: false });
    const [operationStatus, setOperationStatus] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);

    // Filter lotes by search term
    const filteredLotes = useMemo(() => {
        if (!searchTerm) return lotes;
        
        return lotes.filter(lote => 
            lote.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [lotes, searchTerm]);

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleSelectLote = (lote: string) => {
        const newSelected = new Set(selectedLotes);
        if (newSelected.has(lote)) {
            newSelected.delete(lote);
        } else {
            newSelected.add(lote);
        }
        setSelectedLotes(newSelected);
    };

    const handleSelectAllLotes = () => {
        if (selectedLotes.size === filteredLotes.length) {
            setSelectedLotes(new Set());
        } else {
            setSelectedLotes(new Set(filteredLotes));
        }
    };

    const handleSendEmails = async () => {
        if (!onSendEmail || selectedLotes.size === 0) return;

        setIsSendingEmails(true);
        setConfirmDialogOpen(false);
        setEmailProgress({ current: 0, total: 1, processing: true });

        try {
            const loteIds = Array.from(selectedLotes);
            
            // Send all selected batches at once using the handler from the hook
            await onSendEmail(loteIds);
            setEmailProgress(prev => ({ ...prev, current: 1 }));

            setSelectedLotes(new Set());
            setOperationStatus({
                message: `Se enviaron correos para ${loteIds.length} lote(s) correctamente`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error sending batch emails:', error);
            setOperationStatus({
                message: `Error al enviar correos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                severity: 'error'
            });
        } finally {
            setIsSendingEmails(false);
            setEmailProgress(prev => ({ ...prev, processing: false }));
            setTimeout(() => setOperationStatus(null), 5000);
        }
    };

    const openConfirmDialog = () => {
        if (selectedLotes.size > 0) {
            setConfirmDialogOpen(true);
        }
    };

   

    return (
        <>
            <Card sx={{
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${color} 0%, ${color}cc 50%, ${color} 100%)`
                }
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color, fontWeight: 600 }}>
                        Lotes Disponibles
                    </Typography>

                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar por número de lote..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <ClearIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />


                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        {filteredLotes.length} lote{filteredLotes.length !== 1 ? 's' : ''} encontrado{filteredLotes.length !== 1 ? 's' : ''}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={handleSelectAllLotes}
                                sx={{ 
                                    borderColor: color, 
                                    color: color,
                                    '&:hover': { borderColor: color, bgcolor: `${color}10` }
                                }}
                            >
                                {selectedLotes.size === filteredLotes.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                            </Button>
                            <Typography variant="caption" color="text.secondary">
                                {selectedLotes.size} lote{selectedLotes.size !== 1 ? 's' : ''} seleccionado{selectedLotes.size !== 1 ? 's' : ''}
                            </Typography>
                        </Box>

                        {selectedLotes.size > 0 && (
                            <Button
                                size="small"
                                variant="contained"
                                onClick={openConfirmDialog}
                                disabled={isSendingEmails}
                                startIcon={<EmailIcon />}
                                sx={{
                                    bgcolor: color,
                                    '&:hover': { bgcolor: `${color}dd` }
                                }}
                            >
                                {isSendingEmails ? 'Enviando...' : `Enviar Lotes (${selectedLotes.size})`}
                            </Button>
                        )}
                    </Box>


                    <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                        {filteredLotes.length > 0 ? (
                            filteredLotes.map((lote) => {
                                const isSelected = selectedLotes.has(lote);

                                return (
                                    <Paper
                                        key={lote}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            border: isSelected ? `2px solid ${color}` : `1px solid ${color}30`,
                                            borderRadius: 2,
                                            bgcolor: isSelected ? `${color}10` : 'background.paper',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: isSelected ? `${color}15` : `${color}05`,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }
                                        }}
                                        onClick={() => handleSelectLote(lote)}
                                    >

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <GroupWorkIcon sx={{ color, fontSize: 20 }} />
                                                <Typography variant="h6" sx={{ color, fontWeight: 600 }}>
                                                    Lote {lote}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={isSelected ? 'Seleccionado' : 'No seleccionado'}
                                                size="small"
                                                sx={{ 
                                                    bgcolor: isSelected ? color : `${color}20`, 
                                                    color: isSelected ? 'white' : color,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </Box>

                                        <Divider sx={{ my: 1, borderColor: `${color}20` }} />


                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Número de lote:</strong> {lote}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                );
                            })
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? 'No se encontraron lotes con ese criterio' : 'No hay lotes disponibles'}
                                </Typography>
                            </Box>
                        )}
                    </Box>


                    {operationStatus && (
                        <Alert
                            severity={operationStatus.severity}
                            sx={{ mt: 2 }}
                        >
                            {operationStatus.message}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color }}>
                    Confirmar Envío de Correos
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        ¿Estás seguro de que deseas enviar correos para {selectedLotes.size} lote{selectedLotes.size !== 1 ? 's' : ''}?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Se enviarán correos electrónicos a todos los colaboradores de los lotes seleccionados con sus respectivos documentos de haberes.
                    </Typography>
                    {isSendingEmails && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Enviando correos...
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        disabled={isSendingEmails}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSendEmails}
                        variant="contained"
                        disabled={isSendingEmails}
                        startIcon={<EmailIcon />}
                        sx={{ bgcolor: color, '&:hover': { bgcolor: `${color}dd` } }}
                    >
                        {isSendingEmails ? 'Enviando...' : 'Enviar Correos'}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={emailProgress.processing}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        p: 0
                    }
                }}
            >
                <DialogTitle sx={{ color, textAlign: 'center' }}>
                    Envío de Correos
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <CircularProgress
                            size={60}
                            sx={{
                                color: color,
                                mb: 2
                            }}
                        />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Enviando {selectedLotes.size} lote(s) seleccionados
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(emailProgress.current / emailProgress.total) * 100}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 2,
                            bgcolor: `${color}20`
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Enviando correos electrónicos a los colaboradores...
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
}
