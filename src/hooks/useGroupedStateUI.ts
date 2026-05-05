import { useState } from 'react';

interface UseGroupedStateUIReturn {
    activeTab: number;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    };
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
    setSnackbar: (snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }) => void;
    closeSnackbar: () => void;
}

export const useGroupedStateUI = (): UseGroupedStateUIReturn => {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return {
        activeTab,
        snackbar,
        handleTabChange,
        setSnackbar,
        closeSnackbar
    };
};
