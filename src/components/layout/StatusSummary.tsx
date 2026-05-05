import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';

interface StatusData {
    id: string;
    title: string;
    count: number;
    color: string;
}

interface StatusSummaryProps {
    statusData: StatusData[];
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({ statusData }) => {
    return (
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
                {statusData.map((status) => (
                    <Box key={status.id} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: status.color, fontWeight: 600 }}>
                            {status.count}
                        </Typography>
                        <Typography variant="body2" sx={{ color: status.color, fontWeight: 600 }}>
                            {status.title}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
