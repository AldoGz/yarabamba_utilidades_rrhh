import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Fade,
    Container,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StatusTable from '../components/cards/StatusTable';
import { fetchGroupedByState, PersonalItem, bulkUpdateStatus, sendBulkEmail, createBatch } from '../api/personal';

interface StatusData {
    id: string;
    title: string;
    count: number;
    color: string;
    icon: React.ReactNode;
    description: string;
    items: PersonalItem[];
}

// Map API response to component data structure
const mapApiDataToStatusData = (apiData: any): StatusData[] => {
    return [
        {
            id: 'actualizados',
            title: 'Colaboradores Registrados',
            count: apiData.actualizados.filter((item: any) => item.status === 'AC')?.length || 0,
            color: '#4caf50',
            icon: null,
            description: 'Documentos que han sido actualizados por el colaborador',
            items: apiData.actualizados || []
        },
        {
            id: 'firmados',
            title: 'Programación Pago',
            count: apiData.firmados?.length || 0,
            color: '#ff9800',
            icon: null,
            description: 'Documentos firmados y programados para pago',
            items: apiData.firmados || []
        },
        {
            id: 'pendientes',
            title: 'Colaborados Pendientes',
            count: apiData.pendientes?.length || 0,
            color: '#f44336',
            icon: null,
            description: 'Documentos que requieren actualización de información',
            items: apiData.pendientes || []
        },
    ];
};

export default function GroupedByStatePage() {
    const queryClient = useQueryClient();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [activeTab, setActiveTab] = useState(0);

    // Dynamic year calculation
    const currentYear = new Date().getFullYear();
    const utilityYear = currentYear - 1;

    const { data: apiData, isLoading, error, refetch } = useQuery({
        queryKey: ['grouped-by-state'],
        queryFn: fetchGroupedByState,
        refetchInterval: 30000, // Refetch every 30 seconds
        retry: 3
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: bulkUpdateStatus,
        onSuccess: (data) => {
            setSnackbar({
                open: true,
                message: data.message || `Se actualizaron ${data.updatedCount || 0} elementos correctamente`,
                severity: 'success'
            });
            // Refetch data to show updated counts
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || 'Error al actualizar los elementos',
                severity: 'error'
            });
        }
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleBulkUpdate = async (selectedIds: number[]) => {
        await bulkUpdateMutation.mutateAsync(selectedIds);
    };

    const handleBatchCreate = async (selectedIds: number[]) => {
        await batchCreateMutation.mutateAsync(selectedIds);
    };

    const emailSendMutation = useMutation({
        mutationFn: sendBulkEmail,
        onSuccess: (data) => {
            setSnackbar({
                open: true,
                message: data.message || `Se enviaron ${data.sentCount || 0} correos correctamente`,
                severity: 'success'
            });
            // Refetch data to show updated counts
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || 'Error al enviar los correos',
                severity: 'error'
            });
        }
    });

    const batchCreateMutation = useMutation({
        mutationFn: createBatch,
        onSuccess: (data) => {
            setSnackbar({
                open: true,
                message: data.message || `Se creó el lote con ${data.batchCount || 0} elementos correctamente`,
                severity: 'success'
            });
            // Refetch data to show updated counts
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || 'Error al crear el lote',
                severity: 'error'
            });
        }
    });

    const statusData = apiData ? mapApiDataToStatusData(apiData.data) : [];

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    Error al cargar los datos: {error instanceof Error ? error.message : 'Error desconocido'}
                </Alert>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <button onClick={() => refetch()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Reintentar
                    </button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2
                    }}
                >
                    Sistema de Reparto de Utilidades {utilityYear}
                </Typography>

                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Resumen General
                    </Typography>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(4, 1fr)'
                        },
                        gap: 2
                    }}>
                        {
                            statusData.map((status: StatusData) => (
                                <Box key={status.id} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: status.color, fontWeight: 600 }}>
                                        {status.count}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: status.color, fontWeight: 600 }}>
                                        {status.title}
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 3
                    }}
                >
                    Plataforma centralizada para la gestión, procesamiento y seguimiento del reparto de utilidades
                    correspondientes al ejercicio fiscal {utilityYear}. Monitorea en tiempo real el estado de los documentos
                    de los colaboradores y optimiza el flujo de aprobación.
                </Typography>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 4,
                        '& .MuiTabs-indicator': {
                            backgroundColor: statusData[activeTab]?.color || 'primary',
                            height: 3
                        }
                    }}
                >
                    {statusData.map((status: StatusData) => (
                        <Tab
                            key={status.id}
                            label={status.title}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                minWidth: 'auto',
                                px: 5,
                                '&.Mui-selected': {
                                    color: 'white',
                                    backgroundColor: status.color,
                                    height: 10 
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Fade in={true} timeout={600}>
                    <Box>
                        <StatusTable
                            title={statusData[activeTab].title}
                            count={statusData[activeTab].count}
                            color={statusData[activeTab].color}
                            description={statusData[activeTab].description}
                            items={statusData[activeTab].items}
                            showBulkActions={statusData[activeTab].id === 'actualizados' || statusData[activeTab].id === 'firmados'}
                            showEmailFilter={statusData[activeTab].id === 'actualizados'}
                            onBulkUpdate={statusData[activeTab].id === 'actualizados' ? handleBulkUpdate : handleBatchCreate}
                            statusId={statusData[activeTab].id}
                        />
                    </Box>
                </Fade>
            </Box>



            {/* Success/Error Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
