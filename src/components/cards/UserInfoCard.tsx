import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar,
    Chip,
    Fade
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface UserInfoCardProps {
    userName?: string;
    userDni?: string;
    userRole?: string;
    isVerified?: boolean;
    lastLogin?: string;
}

export default function UserInfoCard({ 
    userName, 
    userDni,
    userRole = 'Usuario',
    isVerified = false,
    lastLogin 
}: UserInfoCardProps) {
    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const getAvatarColor = (name?: string) => {
        if (!name) return '#2e7d32';
        const colors = [
            '#2e7d32', '#1976d2', '#7b1fa2', '#c62828', 
            '#f57c00', '#00796b', '#455a64', '#5d4037'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Fade in={true} timeout={600}>
            <Card sx={{ 
                mb: 3, 
                bgcolor: 'linear-gradient(145deg, #f8f9ff 0%, #ffffff 100%)',
                borderRadius: 3,
                border: '1px solid rgba(46, 125, 50, 0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(46, 125, 50, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #2e7d32 100%)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(46, 125, 50, 0.08)'
                }
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: getAvatarColor(userName),
                                    fontSize: 24,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    border: '3px solid white'
                                }}
                            >
                                {userName ? getInitials(userName) : <PersonIcon />}
                            </Avatar>
                            {isVerified && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -2,
                                        right: -2,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: '#4caf50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ fontSize: 14, color: 'white' }} />
                                </Box>
                            )}
                        </Box>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        fontWeight: 500
                                    }}
                                >
                                    Bienvenido/a
                                </Typography>
                                <Chip
                                    label={userRole}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        bgcolor: 'rgba(46, 125, 50, 0.1)',
                                        color: '#2e7d32',
                                        fontWeight: 500
                                    }}
                                />
                            </Box>
                            
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {userName || 'Usuario'}
                            </Typography>
                            
                            {userDni && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontSize: '0.875rem',
                                        mb: 0.5,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    DNI: {userDni}
                                </Typography>
                            )}
                            
                                                        
                            {lastLogin && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontSize: '0.75rem',
                                        mt: 0.5,
                                        display: 'block'
                                    }}
                                >
                                    Último acceso: {lastLogin}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Fade>
    );
}
