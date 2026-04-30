import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    backTo?: string | number;
    rightComponent?: React.ReactNode;
    subtitle?: string;
}

export default function Header({ 
    title, 
    showBackButton = true, 
    backTo = -1, 
    rightComponent,
    subtitle 
}: HeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (typeof backTo === 'string') {
            navigate(backTo);
        } else {
            navigate(backTo);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4, 
            position: 'relative', 
            zIndex: 2 
        }}>
            {showBackButton && (
                <Tooltip title="Volver">
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            bgcolor: 'rgba(46, 125, 50, 0.08)',
                            color: '#2e7d32',
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                                bgcolor: 'rgba(46, 125, 50, 0.12)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                            },
                            '&:active': {
                                transform: 'scale(0.95)'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            
            <Box sx={{ 
                textAlign: 'center', 
                flex: 1,
                mx: showBackButton ? 2 : 0
            }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        mt: 0.5,
                        fontSize: '0.875rem'
                    }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            
            {rightComponent || <Box sx={{ width: 40 }} />}
        </Box>
    );
}
