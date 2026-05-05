import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGroupedByState, bulkUpdateStatus, sendBulkEmail, createBatch } from '../api/personal';

interface UseGroupedStateDataReturn {
    data: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
    bulkUpdateMutation: any;
    emailSendMutation: any;
    batchCreateMutation: any;
    handleBulkUpdate: (selectedIds: number[]) => Promise<void>;
    handleBatchCreate: (selectedIds: number[]) => Promise<void>;
}

export const useGroupedStateData = (): UseGroupedStateDataReturn => {
    const queryClient = useQueryClient();

    // Query for fetching data
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['grouped-by-state'],
        queryFn: fetchGroupedByState,
        refetchInterval: 30000, // Refetch every 30 seconds
        retry: 3
    });

    // Bulk update mutation - uses /actualizar-estado-masivo endpoint
    const bulkUpdateMutation = useMutation({
        mutationFn: bulkUpdateStatus,
        onSuccess: (data) => {
            console.log('Bulk update successful:', data);
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            console.error('Bulk update error:', error);
        }
    });

    // Email send mutation
    const emailSendMutation = useMutation({
        mutationFn: sendBulkEmail,
        onSuccess: (data) => {
            console.log('Email send successful:', data);
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            console.error('Email send error:', error);
        }
    });

    // Batch create mutation
    const batchCreateMutation = useMutation({
        mutationFn: createBatch,
        onSuccess: (data) => {
            console.log('Batch create successful:', data);
            queryClient.invalidateQueries({ queryKey: ['grouped-by-state'] });
        },
        onError: (error: any) => {
            console.error('Batch create error:', error);
        }
    });

    // Handlers
    const handleBulkUpdate = async (selectedIds: number[]) => {
        await bulkUpdateMutation.mutateAsync(selectedIds);
    };

    const handleBatchCreate = async (selectedIds: number[]) => {
        await batchCreateMutation.mutateAsync(selectedIds);
    };

    return {
        data,
        isLoading,
        error,
        refetch,
        bulkUpdateMutation,
        emailSendMutation,
        batchCreateMutation,
        handleBulkUpdate,
        handleBatchCreate
    };
};
