import { Box, Zoom } from "@mui/material";
import logo from '../assets/logo.png';

const FormValidatorHeader = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>            
            <Zoom in={true} timeout={800}>
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Zoom>
        </Box>
    );
}

export default FormValidatorHeader;