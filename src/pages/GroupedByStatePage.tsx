import React, { useEffect } from 'react';
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
import { useStatusTableStore } from '../stores/useStatusTableStore';
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
    // Transform API data to match PersonalItem interface
    const transformApiItem = (item: any) => ({
        id: item.id,
        numberDocument: item.numberDocument,
        fullName: item.fullName,
        period: item.period,
        amount: item.amount,
        bankId: item.bankId,
        bankAccountNumber: item.bankAccountNumber,
        cci: item.cci,
        email: item.email,
        phone1: item.phone1,
        phone2: item.phone2,
        isWorking: item.isWorking,
        status: item.status,
        batch: item.batch,
        statusColor: item.statusColor,
        statusLabel: item.statusLabel,
        updatedAt: item.updatedAt ?? "-",
        bank: item.bank.description
    });

    return [
        {
            id: 'actualizados',
            title: 'Colaboradores Registrados',
            count: apiData.actualizados.filter((item: any) => item.status === 'AC')?.length || 0,
            color: '#4caf50',
            icon: null,
            description: 'Documentos que han sido actualizados por el colaborador',
            items: (apiData.actualizados || []).map(transformApiItem),
            enabled: true
        },
        {
            id: 'firmados',
            title: 'Para Programación de Pago',
            count: apiData.firmados?.length || 0,
            color: '#ff9800',
            icon: null,
            description: 'Documentos firmados y programados para pago',
            items: (apiData.firmados || []).map(transformApiItem),
            enabled: true
        },
        {
            id: 'confirmado-pago',
            title: 'Lote Confirmado para Pago',
            count: apiData.lotes?.length || 0,
            color: '#9c27b0',
            icon: null,
            description: 'Lotes confirmados para envío de correos',
            items: [],
            enabled: true,
            showInTabs: false
        }
    ];
};



// Get email status counters for visual display
const getEmailStatusCounters = (apiData: any) => {
    return [
        {
            id: 'correo_procesados',
            title: ' Correos siendo Procesados',
            count: apiData.actualizados.filter((item: any) => item.status === 'EC')?.length || 0,
            color: '#2196f3',
            description: 'Correos siendo procesados para enviados'
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
    const { data: apiData, batches, isLoading, error, refetch, emailSendMutation, batchCreateMutation, handleBatchEmailSend } = useGroupedStateData();
    const { activeTab, snackbar, handleTabChange, setSnackbar, closeSnackbar } = useGroupedStateUI();
    const setTableConfig = useStatusTableStore(state => state.setTableConfig);

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


    const currentStatus = statusData[activeTab] || statusData[0];

    // Effect to update the store when tab or data changes
    useEffect(() => {
        if (!currentStatus) return;

        const showBulkActions = currentStatus.id === 'actualizados' || currentStatus.id === 'firmados';
        const showEmailFilter = currentStatus.id === 'actualizados';
        const onBulkUpdateHandler = currentStatus.id === 'actualizados' ? handleBulkUpdate : handleBatchCreate;

        setTableConfig({
            items: currentStatus.items,
            color: currentStatus.color,
            statusId: currentStatus.id,
            showBulkActions,
            showEmailFilter,
            onBulkUpdate: onBulkUpdateHandler,
        });
    }, [currentStatus, handleBulkUpdate, handleBatchCreate, setTableConfig]);

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
                statusData={statusData.filter(status => status.enabled && (status.showInTabs !== false))}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <Box sx={{ mb: 4 }}>
                <Fade in={true} timeout={600}>
                    <Box>
                        <StatusTable batches={batches} onSendBatchEmail={handleBatchEmailSend} />
                    </Box>
                </Fade>
            </Box>



            {/* Success/Error Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
