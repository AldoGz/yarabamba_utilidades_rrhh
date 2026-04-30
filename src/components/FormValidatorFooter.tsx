// components/FormValidatorFooter.tsx
import { Box, Fade, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormData } from "../hooks/usePageValidator";

const FormValidatorFooter = () => {
    const { watch, formState } = useFormContext<FormData>();
    const dni = watch("dni") || "";
    const verificador = watch("verificador") || "";
    const isValid = formState.isValid;

    return (
        <>
            <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                <Typography variant="caption" color="text.secondary">
                    Este proceso es seguro y tus datos están protegidos
                </Typography>
            </Box>

            {/* Indicador de validación */}
            {(dni.length > 0 || verificador.length > 0) && (
                <Fade in={true}>
                    <Box
                        sx={{
                            width: '100%',
                            mt: 1,
                            p: 1,
                            bgcolor: isValid ? '#e8f5e9' : '#fff3e0',
                            borderRadius: 2,
                            textAlign: 'center'
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: isValid ? '#2e7d32' : '#ed6c02',
                                fontWeight: 500
                            }}
                        >
                            {isValid
                                ? '✓ Datos completos, puede continuar'
                                : '⚠ Complete ambos campos para continuar'}
                        </Typography>
                    </Box>
                </Fade>
            )}
        </>
    );
};

export default FormValidatorFooter;