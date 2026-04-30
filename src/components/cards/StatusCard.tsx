import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    TextField,
    Pagination,
    InputAdornment,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface StatusCardProps {
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
    statusId?: string; // To identify which status this card represents
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


export default function StatusCard({ 
    title, 
    count, 
    color, 
    description, 
    items,
    showBulkActions = false,
    onBulkUpdate,
    statusId
}: StatusCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const itemsPerPage = 5;

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        
        return items.filter(item => 
            item.numberDocument.includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone1.includes(searchTerm) ||
            item.period.includes(searchTerm)
        );
    }, [items, searchTerm]);

    // Get paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, page, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded) {
            setPage(1); // Reset to first page when expanding
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
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

    const handleBulkUpdate = async () => {
        if (!onBulkUpdate || selectedItems.size === 0) return;
        
        setIsUpdating(true);
        try {
            await onBulkUpdate(Array.from(selectedItems));
            setSelectedItems(new Set());
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error('Error in bulk update:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const openConfirmDialog = () => {
        if (selectedItems.size > 0) {
            setConfirmDialogOpen(true);
        }
    };

    return (
        <>
            <Card sx={{ 
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: `2px solid ${color}20`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: `${color}40`
                }
            }}>
                <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                            variant="h6" 
                            component="h3"
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 1,
                                lineHeight: 1.2
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'text.secondary',
                                lineHeight: 1.4,
                                mb: 2
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Box>

                {/* Count Badge */}
                <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: `${color}15`,
                    border: `2px solid ${color}30`,
                    mb: 2
                }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 700,
                            color: color
                        }}
                    >
                        {count}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            fontStyle: 'italic'
                        }}
                    >
                        {items.length > 0 ? `${items.length} totales` : 'Sin elementos'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {showBulkActions && expanded && selectedItems.size > 0 && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: color,
                                    fontWeight: 600,
                                    bgcolor: `${color}10`,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                {selectedItems.size} seleccionado{selectedItems.size !== 1 ? 's' : ''}
                            </Typography>
                        )}
                        
                        {items.length > 0 && (
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="mostrar más"
                                sx={{ 
                                    color: color,
                                    '&:hover': { bgcolor: `${color}10` }
                                }}
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        )}
                    </Box>
                </Box>

                {/* Expandable Content */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2, borderColor: `${color}30` }} />
                        
                        {/* Bulk Actions Header */}
                        {showBulkActions && (
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
                                        sx={{ 
                                            bgcolor: color,
                                            '&:hover': { bgcolor: `${color}dd` },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {isUpdating ? 'Actualizando...' : `Actualizar (${selectedItems.size})`}
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Search Field */}
                        {items.length > 5 && (
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
                        )}

                        {/* Results Info */}
                        {searchTerm && (
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
                            </Typography>
                        )}

                        {/* Items List */}
                        <List dense sx={{ p: 0, mb: 2 }}>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item, index) => (
                                    <ListItem 
                                        key={item.id}
                                        sx={{ 
                                            px: 0,
                                            py: 1,
                                            bgcolor: selectedItems.has(item.id) ? `${color}15` : (item.isWorking ? '#e8f5e8' : '#ffebee'),
                                            borderRadius: 1,
                                            mb: index < paginatedItems.length - 1 ? 1 : 0,
                                            border: selectedItems.has(item.id) ? `2px solid ${color}` : 'none'
                                        }}
                                    >
                                        {showBulkActions && (
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedItems.has(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                    sx={{ color: color }}
                                                />
                                            </ListItemIcon>
                                        )}
                                        
                                        <ListItemIcon sx={{ minWidth: showBulkActions ? 40 : 'auto' }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 32, 
                                                    height: 32,
                                                    bgcolor: `${color}20`,
                                                    color: color,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {item.numberDocument.slice(-4)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        DNI: {item.numberDocument}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.email}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Periodo: {item.period}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>
                                                            S/. {item.amount.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tel: {item.phone1}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ 
                                                            color: item.isWorking ? '#4caf50' : '#f44336',
                                                            fontWeight: 500
                                                        }}>
                                                            {item.isWorking ? 'Activo' : 'Inactivo'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {searchTerm ? 'No se encontraron resultados' : 'No hay elementos disponibles'}
                                    </Typography>
                                </Box>
                            )}
                        </List>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    size="small"
                                    color="primary"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog 
            open={confirmDialogOpen} 
            onClose={() => setConfirmDialogOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ color: color }}>
                Confirmar Actualización Masiva
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    ¿Estás seguro de que deseas actualizar el estado de {selectedItems.size} elemento{selectedItems.size !== 1 ? 's' : ''}?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Esta acción moverá los elementos seleccionados al siguiente estado del proceso.
                </Typography>
                {isUpdating && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Procesando actualización...
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
                    sx={{ bgcolor: color, '&:hover': { bgcolor: `${color}dd` } }}
                >
                    {isUpdating ? 'Actualizando...' : 'Confirmar'}
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
