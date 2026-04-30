import {
    Box,
    Button,
    Alert,
    Fade,
    Modal,
    Card,
    CardMedia,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Backdrop,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import usePreviumDocument from '../hooks/usePreviumDocument';
interface PreviumDocumentProps {
    modalOpen: boolean;
    handleCloseModal: () => void;
}

const PreviumDocument: React.FC<PreviumDocumentProps> = ({ modalOpen, handleCloseModal }) => {
    const { dniType, modalStyle, handleDniTypeChange, titleDocument, dniImageSrc } = usePreviumDocument('normal');

    return (
        <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={modalOpen}>
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3, 
                        pb: 2, 
                        borderBottom: '2px solid #f3f4f6'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                            ¿Dónde encontrar tu código verificador?
                        </Typography>
                        <IconButton 
                            onClick={handleCloseModal} 
                            size="small"
                            sx={{
                                color: '#6b7280',
                                '&:hover': {
                                    color: '#374151',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Selector de tipo de DNI */}
                    <div className="mb-6">
                        <Typography variant="subtitle2" className="mb-1 font-semibold">
                            Selecciona tu tipo de documento:
                        </Typography>
                        <ToggleButtonGroup
                            value={dniType}
                            exclusive
                            onChange={handleDniTypeChange}
                            aria-label="tipo de DNI"
                            sx={{ width: '100%' }}
                        >
                            <ToggleButton
                                value="normal"
                                aria-label="DNI normal"
                                className="flex-1 gap-1"
                            >
                                <CreditCardIcon />
                                DNI Normal (Azul)
                            </ToggleButton>
                            <ToggleButton
                                value="electronico"
                                aria-label="DNI electrónico"
                                className="flex-1 gap-1"
                            >
                                <SmartphoneIcon />
                                DNI Electrónico
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    {/* Imagen según tipo seleccionado */}
                    <Card className="mb-4 rounded-lg overflow-hidden">
                        <CardMedia
                            component="img"
                            image={dniImageSrc}
                            alt={titleDocument}
                            className="object-contain max-h-32 bg-gray-100 p-2"
                            sx={{
                                height: 128,
                                width: '100%',
                                objectFit: 'contain',
                                backgroundColor: '#f9fafb',
                                padding: 1
                            }}
                        />
                    </Card>

                    {/* Información adicional */}
                    <Alert severity="info" className="rounded-lg">
                        <Typography variant="body2">
                            <strong>⚠️ Importante:</strong> El código verificador es un número de <strong>1 solo dígito</strong> que sirve para validar tu identidad. Asegúrate de ingresarlo correctamente.
                        </Typography>
                    </Alert>

                    {/* Botón de cerrar */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCloseModal}
                        className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                        Entendido
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
}

export default PreviumDocument;