// components/FormValidator.tsx
import { Box, Paper, Zoom } from "@mui/material";
import FormValidatorHeader from "./FormValidatorHeader";
import FormValidatorMain from "./FormValidatorMain";
import FormValidatorFooter  from "./FormValidatorFooter";
import { boxCenterPaper } from "../styles";
import { theme } from "../theme";

interface FormValidatorProps {
    loading: boolean;
    error: any; // Ajusta el tipo según tu ApiError
    handleOpenModal: () => void;
}

const FormValidator: React.FC<FormValidatorProps> = ({
    loading,
    error,
    handleOpenModal,
}) => {
    return (
        <Zoom in={true} timeout={500}>
            <Paper
                elevation={8}
                className="relative overflow-hidden rounded-2xl bg-white"
                sx={{
                    ...boxCenterPaper,
                    borderRight: `3px solid ${theme.palette.secondary.main}`,
                    borderBottom: `3px solid ${theme.palette.secondary.main}`,
                }}
            >
                <Box className="flex flex-col items-center gap-2">
                    <FormValidatorHeader />
                    <FormValidatorMain
                        loading={loading}
                        error={error}
                        handleOpenModal={handleOpenModal}
                    />
                    <FormValidatorFooter />
                </Box>
            </Paper>
        </Zoom>
    );
};

export default FormValidator;