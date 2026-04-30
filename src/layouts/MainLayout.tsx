import {
    Box
} from '@mui/material';


const MainLayout: React.FC = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                /* background: 'linear-gradient(135deg, #2e7d32 0%, #00902f 50%, #3ab87b 100%)', */
                p: 2
            }}>
            {children}
        </Box>
    );
}

export default MainLayout;