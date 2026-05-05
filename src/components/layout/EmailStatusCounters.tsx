import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';

interface EmailStatusCounter {
    id: string;
    title: string;
    count: number;
    color: string;
    description: string;
}

interface EmailStatusCountersProps {
    counters: EmailStatusCounter[];
}

export const EmailStatusCounters: React.FC<EmailStatusCountersProps> = ({ counters }) => {
    return (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Estados de Correo
            </Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)'
                },
                gap: 2
            }}>
                {counters.map((counter) => (
                    <Box key={counter.id} sx={{ 
                        textAlign: 'center',
                        p: 2,
                        border: `2px solid ${counter.color}20`,
                        borderRadius: 2,
                        bgcolor: `${counter.color}10`
                    }}>
                        <Typography variant="h5" sx={{ color: counter.color, fontWeight: 600 }}>
                            {counter.count}
                        </Typography>
                        <Typography variant="body2" sx={{ color: counter.color, fontWeight: 600 }}>
                            {counter.title}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
