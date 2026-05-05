import React from 'react';
import {
    Box,
    Typography,
    Fade,
    Container,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import StatusTable from '../components/cards/StatusTable';
import { StatusTabs } from '../components/layout/StatusTabs';
import { StatusSummary } from '../components/layout/StatusSummary';
import { EmailStatusCounters } from '../components/layout/EmailStatusCounters';
import { useGroupedStateData } from '../hooks/useGroupedStateData';
import { useGroupedStateUI } from '../hooks/useGroupedStateUI';
import { fetchGroupedByState, PersonalItem } from '../api/personal';

interface StatusData {
    id: string;
    title: string;
    count: number;
    color: string;
    icon: React.ReactNode;
    description: string;
    items: PersonalItem[];
    enabled: boolean;
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
            items: apiData.actualizados || [],
            enabled: true
        },
        {
            id: 'correo_procesados',
            title: 'Correo Procesado',
            count: apiData.actualizados.filter((item: any) => item.status === 'EC')?.length || 0,
            color: '#afa54c',
            icon: null,
            description: 'Documentos que han sido actualizados por el colaborador',
            items: [],
            enabled: false
        },
        {
            id: 'correo_enviados',
            title: 'Correo Enviados',
            count: apiData.actualizados.filter((item: any) => item.status === 'AP')?.length || 0,
            color: '#8b238f',
            icon: null,
            description: 'Documentos que han sido actualizados por el colaborador',
            items: [],
            enabled: false
        },
        {
            id: 'correo_rechazados',
            title: 'Correo Rechazados',
            count: apiData.actualizados.filter((item: any) => item.status === 'ER')?.length || 0,
            color: '#c06011',
            icon: null,
            description: 'Documentos que han sido actualizados por el colaborador',
            items: [],
            enabled: false
        },
        {
            id: 'firmados',
            title: 'Programación Pago',
            count: apiData.firmados?.length || 0,
            color: '#ff9800',
            icon: null,
            description: 'Documentos firmados y programados para pago',
            items: apiData.firmados || [],
            enabled: true
        }
    ];
};

// Get email status counters for visual display
const getEmailStatusCounters = (apiData: any) => {
    return [
        {
            id: 'correo_procesados',
            title: 'Correo Procesado',
            count: apiData.actualizados.filter((item: any) => item.status === 'EC')?.length || 0,
            color: '#2196f3',
            description: 'Correos procesados y enviados'
        },
        {
            id: 'correo_enviados',
            title: 'Correo Enviados',
            count: apiData.actualizados.filter((item: any) => item.status === 'AP')?.length || 0,
            color: '#9c27b0',
            description: 'Correos aprobados y entregados'
        },
        {
            id: 'correo_rechazados',
            title: 'Correo Rechazados',
            count: apiData.actualizados.filter((item: any) => item.status === 'ER')?.length || 0,
            color: '#f44336',
            description: 'Correos con errores o rechazados'
        }
    ];
};

export default function GroupedByStatePage() {
    // Custom hooks
    const { data: apiData, isLoading, error, refetch, emailSendMutation, batchCreateMutation } = useGroupedStateData();
    const { activeTab, snackbar, handleTabChange, setSnackbar, closeSnackbar } = useGroupedStateUI();

    // Dynamic year calculation
    const currentYear = new Date().getFullYear();
    const utilityYear = currentYear - 1;

    // Handlers
    const handleBulkUpdate = async (selectedIds: number[]) => {
        try {
            await emailSendMutation.mutateAsync(selectedIds);
            setSnackbar({
                open: true,
                message: `Se enviaron ${selectedIds.length} correos correctamente`,
                severity: 'success'
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Error al enviar los correos',
                severity: 'error'
            });
        }
    };

    const handleBatchCreate = async (selectedIds: number[]) => {
        try {
            await batchCreateMutation.mutateAsync(selectedIds);
            setSnackbar({
                open: true,
                message: `Se creó el lote con ${selectedIds.length} elementos correctamente`,
                severity: 'success'
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Error al crear el lote',
                severity: 'error'
            });
        }
    };

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

                {/* Status Summary Component */}
                <StatusSummary statusData={statusData.filter(status => status.enabled)} />

                {/* Email Status Counters Component */}
                {apiData && (
                    <EmailStatusCounters counters={getEmailStatusCounters(apiData.data)} />
                )}

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
            </Box>

            {/* Status Tabs Component */}
            <StatusTabs 
                statusData={statusData.filter(status => status.enabled)}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

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
