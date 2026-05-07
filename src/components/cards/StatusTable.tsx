import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useStatusTableStore } from '../../stores/useStatusTableStore.ts';
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
    GroupWork as GroupWorkIcon,
    List as ListIcon
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
    color: string; 
    items: Array<{
        id: number;
        numberDocument: string;
        fullName: string;
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
        statusColor: string;
        statusLabel: string;
        updatedAt: string
    }>;
    showBulkActions?: boolean;
    onBulkUpdate?: (selectedIds: number[]) => Promise<void>;
    statusId?: string;
    showEmailFilter?: boolean;
}


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

const ExpandableRow = ({ item, color, shouldShowBulkActions, selectedItems, onSelectItem, expanded, onToggleExpand, showBatchColumn }: any) => {

    return (
        <>
            <Row sx={{ bgcolor: selectedItems.has(item.id) ? `${color}15` : (item.isWorking ? '#e8f5e8' : '#ffebee') }}>

                {shouldShowBulkActions && (
                    <TableCell padding="checkbox">
                        {!showBatchColumn && (
                            <Checkbox
                                size="small"
                                checked={selectedItems.has(item.id)}
                                onChange={() => onSelectItem(item.id)}
                                sx={{ color: color }}
                            />
                        )}

                    </TableCell>
                )}
                {/* DESPUES !showBatchColumn arriba*/}
                {showBatchColumn && (
                    <TableCell sx={{ fontWeight: 600, color: color }}>
                        {item.batch || '-'}
                    </TableCell>
                )}
                <TableCell>{item.numberDocument}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell align="right">{item.amount}</TableCell>
                <TableCell>{item.period}</TableCell>
                <TableCell>{item.phone1}</TableCell>
                <TableCell>{item.updatedAt}</TableCell>
                <TableCell>
                    <Box sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: item.statusColor,
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        {item.statusLabel}
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={shouldShowBulkActions ? (showBatchColumn ? 10 : 9) : (showBatchColumn ? 9 : 8)}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Información Detallada
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Banco:</strong> {item.bank}
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
    color,
    items,
    showBulkActions = false,
    onBulkUpdate,
    statusId,
    showEmailFilter = false
}: StatusTableProps) {
    const [additionalFilter, setAdditionalFilter] = useState<string>('todos');
    
    const {
        searchTerm,
        batchSearchTerm,
        emailFilter,
        internalTab,
        page,
        rowsPerPage,
        selectedItems,
        expandedRows,
        expanded,
        setSearchTerm,
        setBatchSearchTerm,
        setEmailFilter,
        setInternalTab,
        setPage,
        setRowsPerPage,
        setSelectedItems,
        toggleSelectedItem,
        clearSelectedItems,
        setExpandedRows,
        toggleExpandedRow,
        setExpanded,
        resetTabStates
    } = useStatusTableStore();

    // Local states for component-specific functionality
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

    // For batch creation, show bulk actions only in "Generar Lote" tab
    const shouldShowSelectionBulkActions = useMemo(() => {
        if (!isBatchCreation) return shouldShowBulkActions;
        return shouldShowBulkActions && internalTab === 0;
    }, [shouldShowBulkActions, isBatchCreation, internalTab]);

    // Filter items with FR status for batch generation
    const frItems = useMemo(() => {
        return items.filter(item => item.status === 'FR');
    }, [items]);

    // Filter items that already have batches for displaying
    const batchItems = useMemo(() => {
        return items.filter(item => item.batch && item.batch.trim() !== '');
    }, [items]);

    // Internal tabs configuration for batch creation
    const batchTabs = [
        {
            label: 'Generar Lote',
            description: 'Seleccionar elementos en estado FR para generar nuevos lotes',
            count: frItems.length
        },
        /* {
            label: 'Lotes Programados',
            description: 'Ver elementos que ya tienen lote asignado',
            count: batchItems.length
        } */
    ];

    const filteredItems = useMemo(() => {
        let filtered = items;

        if (isBatchCreation) {
            if (internalTab === 0) {
                filtered = frItems;
            } else {
                filtered = batchItems;
                if (batchSearchTerm) {
                    filtered = filtered.filter(item =>
                        item.batch && item.batch.toLowerCase().includes(batchSearchTerm.toLowerCase())
                    );
                }
            }
        }

        if (showEmailFilter) {
            if (emailFilter === 'XX') {
                filtered = filtered.filter(item => ['EC', 'ER', 'AP'].includes(item.status));
                if (additionalFilter !== 'todos') {
                    filtered = filtered.filter(item => item.status === additionalFilter);
                }
            } else {
                filtered = filtered.filter(item => item.status === emailFilter);
            }
        }

        if (searchTerm && !(isBatchCreation && internalTab === 1)) {
            filtered = filtered.filter(item => {
                const normalizedSearch = searchTerm.trim().toLowerCase();
                const numberDoc = item.numberDocument || "";
                const fullName = item.fullName || "";

                const normalizedName = fullName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

                const normalizedSearchClean = normalizedSearch
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

                return (
                    numberDoc.includes(normalizedSearch) ||
                    normalizedName.includes(normalizedSearchClean)
                );
            });
        }

        return filtered;
    }, [items, searchTerm, emailFilter, showEmailFilter, isBatchCreation, internalTab, frItems, batchItems, batchSearchTerm, additionalFilter]);

    // Reset states when items change
    useEffect(() => {
        resetTabStates();
    }, [items, resetTabStates]);

    // Get paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredItems.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredItems, page, rowsPerPage]);



    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleEmailFilterChange = (event: any) => {
        setEmailFilter(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleSelectItem = (itemId: number) => {
        toggleSelectedItem(itemId);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === filteredItems.length) {
            clearSelectedItems();
        } else {
            setSelectedItems(new Set(filteredItems.map(item => item.id)));
        }
    };

    const handleInternalTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setInternalTab(newValue);
    };

    const handleClearBatchSearch = () => {
        setBatchSearchTerm('');
    };

    const handleToggleRowExpand = (itemId: number) => {
        toggleExpandedRow(itemId);
    };

    const openConfirmDialog = () => {
        if (selectedItems.size > 0) {
            // For batch creation, validate that selected items have FR status
            if (isBatchCreation) {
                const selectedIds = Array.from(selectedItems);
                const validItems = items.filter(item =>
                    selectedIds.includes(item.id) && item.status === 'FR'
                );

                if (validItems.length !== selectedItems.size) {
                    setOperationStatus({
                        message: 'Solo se pueden generar lotes con items en estado FR',
                        severity: 'error'
                    });
                    setTimeout(() => setOperationStatus(null), 3000);
                    return;
                }
            }
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

            clearSelectedItems();
            setConfirmDialogOpen(false);
            setOperationStatus({
                message: `Se actualizaron ${selectedIds.length} registros correctamente en ${batches.length} lotes xxx`,
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
                                        //setSearchTerm(''); // Clear search when switching tabs
                                        setPage(0);
                                        setSelectedItems(new Set()); // Clear selection when switching tabs
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
                                        Filtro activo xxx:
                                    </Typography>
                                    <pre>{additionalFilter}</pre>
                                    <pre>{JSON.stringify(emailFilterOptions, null,2)}</pre>
                                    
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
                            placeholder="Buscar por DNI o Nombres y Apellidos"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2, display: !(isBatchCreation && internalTab === 1) ? 'block' : 'none' }}
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

                        {/* Batch Search Field for Lotes Programados */}
                        {isBatchCreation && internalTab === 1 && (
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Buscar por número de lote..."
                                value={batchSearchTerm}
                                onChange={(e) => setBatchSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: batchSearchTerm && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearBatchSearch}
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    <ClearIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        )}

                        {/* Results Info */}
                        {searchTerm && !(isBatchCreation && internalTab === 1) && (
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
                            </Typography>
                        )}
                        {batchSearchTerm && isBatchCreation && internalTab === 1 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''} para "{batchSearchTerm}"
                            </Typography>
                        )}


                        {/* Internal Tabs for Batch Creation - Only for Programación Pago */}
                        {isBatchCreation && (
                            <Box sx={{ mb: 2 }}>
                                <Tabs
                                    value={internalTab}
                                    onChange={handleInternalTabChange}
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: `${color}30`,
                                        mb: 2,
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: color,
                                            height: 3
                                        }
                                    }}
                                >
                                    {batchTabs.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            label={`${tab.label} (${tab.count})`}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.875rem',
                                                minWidth: 'auto',
                                                px: 2,
                                                color: internalTab === index ? color : 'text.secondary',
                                                fontWeight: internalTab === index ? 600 : 400,
                                                bgcolor: internalTab === index ? `${color}10` : 'transparent',
                                                borderRadius: 1,
                                                mx: 0.5,
                                                '&:hover': {
                                                    bgcolor: internalTab === index ? `${color}15` : `${color}05`
                                                },
                                                '&.Mui-selected': {
                                                    color: color
                                                }
                                            }}
                                        />
                                    ))}
                                </Tabs>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Vista actual:
                                    </Typography>
                                    <Chip
                                        label={batchTabs[internalTab].label}
                                        color="primary"
                                        size="small"
                                        sx={{ bgcolor: `${color}20`, color: color }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {isBatchCreation && internalTab === 1 ? batchItems.length : filteredItems.length} resultado{(isBatchCreation && internalTab === 1 ? batchItems.length : filteredItems.length) !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 1, p: 1, bgcolor: `${color}10`, borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        <strong>Descripción:</strong>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {batchTabs[internalTab].description}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {emailFilter !== "AC" && (
                            <FormControl size="small" sx={{ minWidth: 180, mb: 2 }}>
                                <InputLabel id="additional-filter-label">Filtro adicional</InputLabel>
                                <Select
                                    labelId="additional-filter-label"
                                    value={additionalFilter}
                                    label="Filtro adicional"
                                    onChange={(e) => setAdditionalFilter(e.target.value)}
                                >
                                    <MenuItem value="todos">TODOS</MenuItem>
                                    <MenuItem value="AP">ENVIADO</MenuItem>
                                    <MenuItem value="EC">EN PROCESO</MenuItem>
                                    <MenuItem value="ER">RECHAZADOS</MenuItem>
                                </Select>
                            </FormControl>
                        )}


                        {/* Bulk Actions Header - Only for Email Sending (Colaboradores Registrados - Procesando tab only) */}
                        {!isBatchCreation && showBulkActions && emailFilter === 'AC' && (
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
                                        startIcon={<EmailIcon />}
                                        sx={{
                                            bgcolor: color,
                                            '&:hover': { bgcolor: `${color}dd` },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {isUpdating
                                            ? 'Enviando correos...'
                                            : `Enviar Correos (${selectedItems.size})`
                                        }
                                    </Button>
                                )}
                            </Box>
                        )}



                        {/* Bulk Actions Header - Only for Batch Creation (Programación Pago - Generar Lote tab) */}
                        {isBatchCreation && internalTab === 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                {/* DESPUES
                                
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
                                        startIcon={<GroupWorkIcon />}
                                        sx={{
                                            bgcolor: color,
                                            '&:hover': { bgcolor: `${color}dd` },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {isUpdating
                                            ? 'Generando Lote...'
                                            : `Generar Lote (${selectedItems.size})`
                                        }
                                    </Button>
                                )} */}
                            </Box>
                        )}
                        <TableContainer sx={{ maxHeight: 400, border: `1px solid ${color}20`, borderRadius: 1 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: `${color}10` }}>
                                        {(!isBatchCreation && showBulkActions && emailFilter === 'AC') && (
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
                                        {isBatchCreation && internalTab === 0 && (
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
                                        {isBatchCreation && internalTab === 1 && (
                                            <TableCell sx={{ fontWeight: 600 }}>Lote</TableCell>
                                        )}
                                        <TableCell sx={{ fontWeight: 600 }}>DNI</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Nombres y Apellidos</TableCell>
                                        <TableCell>Monto</TableCell>
                                        <TableCell>Periodo</TableCell>
                                        <TableCell>Teléfono</TableCell>
                                        <TableCell>Fecha Registro</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Detalles</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {paginatedItems.length > 0 ? (
                                        paginatedItems.map((item) => (
                                            <ExpandableRow
                                                key={item.id}
                                                item={item}
                                                color={color}
                                                shouldShowBulkActions={(!isBatchCreation && showBulkActions && emailFilter === 'AC') || (isBatchCreation && internalTab === 0)}
                                                selectedItems={selectedItems}
                                                onSelectItem={handleSelectItem}
                                                expanded={expandedRows.has(item.id)}
                                                onToggleExpand={() => handleToggleRowExpand(item.id)}
                                                showBatchColumn={isBatchCreation && internalTab === 1}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={shouldShowSelectionBulkActions ? (isBatchCreation && internalTab === 1 ? 10 : 9) : (isBatchCreation && internalTab === 1 ? 9 : 8)} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchTerm && !(isBatchCreation && internalTab === 1) ? 'No se encontraron resultados' :
                                                        batchSearchTerm && isBatchCreation && internalTab === 1 ? `No se encontraron resultados para "${batchSearchTerm}"` :
                                                            isBatchCreation && internalTab === 0 ? 'No hay elementos en estado FR para generar lotes' :
                                                                isBatchCreation && internalTab === 1 ? 'No hay lotes programados' :
                                                                    'No hay elementos disponibles'}
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
                    {isBatchCreation ? 'Generación de Lote' : 'Envio de Correo a los colaborados'}
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
                            ? 'Generando lote con los elementos seleccionados...'
                            : 'Enviando correo electronicos a los colaboradores'
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
                    {isBatchCreation ? 'Confirmar Generación de Lote' : 'Confirmar Envío de Correos'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {isBatchCreation
                            ? `¿Estás seguro de que deseas generar un lote con ${selectedItems.size} elemento${selectedItems.size !== 1 ? 's' : ''}?`
                            : `¿Estás seguro de que deseas enviar correos a ${selectedItems.size} destinatario${selectedItems.size !== 1 ? 's' : ''}?`
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isBatchCreation
                            ? 'Se agruparán los elementos seleccionados en un lote único para procesamiento de pago. Solo se pueden seleccionar elementos en estado FR.'
                            : 'Se adjuntará el archivo de haberes utilidades de cada colaborador en formato PDF, junto con un código de aprobación único para la firma digital.'
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
                        {isUpdating ? (isBatchCreation ? 'Generando...' : 'Enviando...') : (isBatchCreation ? 'Generar Lote' : 'Enviar Correos')}
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
}
