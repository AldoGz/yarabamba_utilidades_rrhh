import React from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography
} from '@mui/material';

interface StatusData {
    id: string;
    title: string;
    count: number;
    color: string;
    icon: React.ReactNode;
    description: string;
    items: any[];
    enabled: boolean;
}

interface StatusTabsProps {
    statusData: StatusData[];
    activeTab: number;
    onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StatusTabs: React.FC<StatusTabsProps> = ({
    statusData,
    activeTab,
    onTabChange
}) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Tabs
                value={activeTab}
                onChange={onTabChange}
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
                {statusData.map((status) => (
                    <Tab
                        key={status.id}
                        label={status.title}
                        disabled={!status.enabled}
                        sx={{
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: status.enabled ? 'text.primary' : 'text.disabled',
                            '&.Mui-selected': {
                                color: status.color
                            },
                            '&:hover': {
                                color: status.enabled ? status.color : 'text.disabled'
                            }
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};
