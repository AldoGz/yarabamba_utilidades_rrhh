import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    TextField,
    InputAdornment,
    Avatar,
    Backdrop,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Email as EmailIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    GroupWork as GroupWorkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Email processing states
const emailFilterOptions = [
    {
        value: 'AC',
        label: 'Pendientes por Notificar',
        description: 'Personal que ya ha actualizado su información para notificar por correo electrónico.'
    },
    {
        value: 'XX',
        label: 'Estado Notificación',
        description: 'Estado de la notificación por correo electrónico.'
    }
];


interface StatusTableProps {
    title: string;
    count: number;
    color: string;
    description: string;
    items: Array<{
        id: number;
        numberDocument: string;
        period: string;
        amount: number;
        bankId: number;
        bankAccountNumber: string;
        cci: string;
        email: string;
        phone1: string;
        phone2: string | null;
        isWorking: boolean;
        status: string;
        batch: string | null;
    }>;
    showBulkActions?: boolean;
    onBulkUpdate?: (selectedIds: number[]) => Promise<void>;
    statusId?: string;
    showEmailFilter?: boolean;
}

const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Row = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    '& > td': {
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
}));

const ExpandableRow = ({ item, color, shouldShowBulkActions, selectedItems, onSelectItem, expanded, onToggleExpand }: any) => {
    return (
        <>
            <Row sx={{ bgcolor: selectedItems.has(item.id) ? `${color}15` : (item.isWorking ? '#e8f5e8' : '#ffebee') }}>
                {shouldShowBulkActions && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            size="small"
                            checked={selectedItems.has(item.id)}
                            onChange={() => onSelectItem(item.id)}
                            sx={{ color: color }}
                        />
                    </TableCell>
                )}
                <TableCell>{item.numberDocument}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.period}</TableCell>
                <TableCell sx={{ color: color, fontWeight: 600 }}>
                    S/. {item.amount.toFixed(2)}
                </TableCell>
                <TableCell>{item.phone1}</TableCell>
                <TableCell>
                    <Box sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: item.isWorking ? '#e8f5e8' : '#ffebee',
                        color: item.colorStatus,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        { item.labelStatus}
                    </Box>
                </TableCell>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={onToggleExpand}
                        sx={{ color: color }}
                    >
                        <KeyboardArrowDownIcon
                            sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }}
                        />
                    </IconButton>
                </TableCell>
            </Row>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={shouldShowBulkActions ? 9 : 8}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Información Detallada
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Banco ID:</strong> {item.bankId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Número de Cuenta:</strong> {item.bankAccountNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>CCI:</strong> {item.cci}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Teléfono 2:</strong> {item.phone2 || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Lote:</strong> {item.batch || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default function StatusTable({
    title,
    count,
    color,
    description,
    items,
    showBulkActions = false,
    onBulkUpdate,
    statusId,
    showEmailFilter = false
}: StatusTableProps) {
    const [expanded, setExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25); // Increased default for better UX
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [emailFilter, setEmailFilter] = useState('AC');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Batch processing state
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, processing: false });
    const [operationStatus, setOperationStatus] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);
    const [showBatchDialog, setShowBatchDialog] = useState(false);

    // Determine if bulk actions should be shown
    const shouldShowBulkActions = useMemo(() => {
        if (!showBulkActions) return false;
        if (!showEmailFilter) return true;
        // Show bulk actions only for 'Procesando' filter
        return emailFilter === 'AC';
    }, [showBulkActions, showEmailFilter, emailFilter]);

    // Determine if this is for batch creation (Programación Pago)
    const isBatchCreation = statusId === 'firmados';

    // Filter items based on search term and email filter
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Apply email filter if enabled
        if (showEmailFilter) {
            if (emailFilter === 'XX') {
                // Combine EC, ER, and AP statuses for "Estado Notificación"
                filtered = filtered.filter(item => ['EC', 'ER', 'AP'].includes(item.status));
            } else {
                // Single status filter for other options
                filtered = filtered.filter(item => item.status === emailFilter);
            }
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.numberDocument.includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone1.includes(searchTerm) ||
                item.period.includes(searchTerm)
            );
        }

        return filtered;
    }, [items, searchTerm, emailFilter, showEmailFilter]);

    // Get paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredItems.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredItems, page, rowsPerPage]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded) {
            setPage(0); // Reset to first page when expanding
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(0);
    };

    const handleEmailFilterChange = (event: any) => {
        setEmailFilter(event.target.value);
        setPage(0); // Reset to first page when filtering
    };


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectItem = (itemId: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map(item => item.id)));
        }
    };

    const handleToggleRowExpand = (itemId: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedRows(newExpanded);
    };

    const openConfirmDialog = () => {
        if (selectedItems.size > 0) {
            setConfirmDialogOpen(true);
        }
    };



    const handleBulkUpdate = async () => {
        if (!onBulkUpdate || selectedItems.size === 0) return;

        const selectedIds = Array.from(selectedItems);
        const batchSize = 100; // Process in batches of 100
        const batches = [];

        for (let i = 0; i < selectedIds.length; i += batchSize) {
            batches.push(selectedIds.slice(i, i + batchSize));
        }

        setIsUpdating(true);
        setShowBatchDialog(true);
        setBatchProgress({ current: 0, total: batches.length, processing: true });

        try {
            for (let i = 0; i < batches.length; i++) {
                await onBulkUpdate(batches[i]);
                setBatchProgress(prev => ({ ...prev, current: i + 1 }));

                // Small delay to prevent overwhelming the server
                if (i < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            setSelectedItems(new Set());
            setConfirmDialogOpen(false);
            setOperationStatus({
                message: `Se actualizaron ${selectedIds.length} registros correctamente en ${batches.length} lotes`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error in bulk update:', error);
            setOperationStatus({
                message: `Error al actualizar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                severity: 'error'
            });
        } finally {
            setIsUpdating(false);
            setBatchProgress(prev => ({ ...prev, processing: false }));
            setTimeout(() => setShowBatchDialog(false), 2000);
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
                    <Box sx={{ mt: 2 }}>
                        {/* Email Filter Tabs */}
                        {showEmailFilter && (
                            <Box sx={{ mb: 2 }}>
                                <Tabs
                                    value={emailFilterOptions.findIndex(opt => opt.value === emailFilter)}
                                    onChange={(_, newValue) => {
                                        setEmailFilter(emailFilterOptions[newValue].value);
                                        setPage(0);
                                    }}
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: `${color}30`,
                                        mb: 2,
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: color,
                                            height: 3
                                        }
                                    }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {emailFilterOptions.map((option, index) => {
                                        const isActive = emailFilterOptions.findIndex(opt => opt.value === emailFilter) === index;
                                        return (
                                            <Tab
                                                key={option.value}
                                                label={option.label}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem',
                                                    minWidth: 'auto',
                                                    px: 1,
                                                    color: isActive ? color : 'text.secondary',
                                                    fontWeight: isActive ? 600 : 400,
                                                    bgcolor: isActive ? `${color}10` : 'transparent',
                                                    borderRadius: 1,
                                                    mx: 0.5,
                                                    '&:hover': {
                                                        bgcolor: isActive ? `${color}15` : `${color}05`
                                                    },
                                                    '&.Mui-selected': {
                                                        color: color
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </Tabs>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Filtro activo:
                                    </Typography>
                                    <Chip
                                        label={emailFilterOptions.find(opt => opt.value === emailFilter)?.label}
                                        color="primary"
                                        size="small"
                                        sx={{ bgcolor: `${color}20`, color: color }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 1, p: 1, bgcolor: `${color}10`, borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        <strong>Descripción:</strong>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {emailFilterOptions.find(opt => opt.value === emailFilter)?.description}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Search Field */}
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar por DNI, email, teléfono o periodo..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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

                        {/* Results Info */}
                        {searchTerm && (
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
                            </Typography>
                        )}

                        {/* Bulk Actions Header */}
                        {shouldShowBulkActions && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Checkbox
                                        size="small"
                                        checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                                        indeterminate={selectedItems.size > 0 && selectedItems.size < filteredItems.length}
                                        onChange={handleSelectAll}
                                        sx={{ color: color }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Seleccionar todo
                                    </Typography>
                                </Box>

                                {selectedItems.size > 0 && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={openConfirmDialog}
                                        disabled={isUpdating}
                                        startIcon={isBatchCreation ? <GroupWorkIcon /> : <EmailIcon />}
                                        sx={{
                                            bgcolor: color,
                                            '&:hover': { bgcolor: `${color}dd` },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {isUpdating 
                                            ? (isBatchCreation ? 'Creando lote...' : 'Enviando correos...')
                                            : `${isBatchCreation ? 'Crear Lote' : 'Enviar correos'} (${selectedItems.size})`
                                        }
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Table */}
                        <TableContainer sx={{ maxHeight: 400, border: `1px solid ${color}20`, borderRadius: 1 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: `${color}10` }}>
                                        {shouldShowBulkActions && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    size="small"
                                                    checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                                                    indeterminate={selectedItems.size > 0 && selectedItems.size < filteredItems.length}
                                                    onChange={handleSelectAll}
                                                    sx={{ color: color }}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell sx={{ fontWeight: 600 }}>DNI</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Periodo</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Detalles</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedItems.length > 0 ? (
                                        paginatedItems.map((item) => (
                                            <ExpandableRow
                                                key={item.id}
                                                item={item}
                                                color={color}
                                                shouldShowBulkActions={shouldShowBulkActions}
                                                selectedItems={selectedItems}
                                                onSelectItem={handleSelectItem}
                                                expanded={expandedRows.has(item.id)}
                                                onToggleExpand={() => handleToggleRowExpand(item.id)}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={shouldShowBulkActions ? 9 : 8} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchTerm ? 'No se encontraron resultados' : 'No hay elementos disponibles'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        {filteredItems.length > rowsPerPage && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredItems.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                sx={{ '& .MuiTablePagination-toolbar': { pl: 0 } }}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Batch Processing Dialog */}
            <Dialog
                open={showBatchDialog}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        p: 0
                    }
                }}
            >
                <DialogTitle sx={{ color: color, textAlign: 'center' }}>
                    {isBatchCreation ? 'Creación de Lote' : 'Actualización Masiva'}
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
                        Procesando Lote {batchProgress.current} de {batchProgress.total}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(batchProgress.current / batchProgress.total) * 100}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 2,
                            bgcolor: `${color}20`
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {isBatchCreation 
                            ? 'Creando lote con los elementos seleccionados...'
                            : 'Actualizando registros en lotes de 100 para evitar sobrecargar el servidor...'
                        }
                    </Typography>
                    {operationStatus && (
                        <Alert
                            severity={operationStatus.severity}
                            sx={{ mt: 2 }}
                        >
                            {operationStatus.message}
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: color }}>
                    {isBatchCreation ? 'Confirmar Creación de Lote' : 'Confirmar Envío de Correos'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {isBatchCreation 
                            ? `¿Estás seguro de que deseas crear un lote con ${selectedItems.size} elemento${selectedItems.size !== 1 ? 's' : ''}?`
                            : `¿Estás seguro de que deseas enviar las liquidaciones a ${selectedItems.size} destinatario${selectedItems.size !== 1 ? 's' : ''}?`
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isBatchCreation 
                            ? 'Se agruparán los elementos seleccionados en un lote único para procesamiento de pago.'
                            : 'Se adjuntará el <strong>archivo de liquidación de haberes</strong> de cada colaborador en formato PDF, junto con un <strong>código de aprobación único</strong> para la firma digital.'
                        }
                    </Typography>
                    {isUpdating && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {isBatchCreation ? 'Creando lote...' : 'Generando PDFs y enviando correos...'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleBulkUpdate}
                        variant="contained"
                        disabled={isUpdating}
                        startIcon={isBatchCreation ? <GroupWorkIcon /> : <EmailIcon />}
                        sx={{ bgcolor: color, '&:hover': { bgcolor: `${color}dd` } }}
                    >
                        {isUpdating ? (isBatchCreation ? 'Creando...' : 'Enviando...') : (isBatchCreation ? 'Crear Lote' : 'Enviar Correos')}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
