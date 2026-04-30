// components/FormValidatorMain.tsx
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import { useFormContext, Controller } from "react-hook-form";
import { FormData } from "../hooks/usePageValidator";

interface FormValidatorMainProps {
  loading: boolean;
  error: any;
  handleOpenModal: () => void;
}

const FormValidatorMain: React.FC<FormValidatorMainProps> = ({
  loading,
  error,
  handleOpenModal,
}) => {
  const {
    control,
    formState: { errors, isValid },
  } = useFormContext<FormData>();

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        {/* Campo DNI */}
        <Controller
          name="dni"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Número de DNI"
              fullWidth
              size="small"
              onChange={(e) => {
                const sanitized = e.target.value.replace(/\D/g, "").slice(0, 8);
                field.onChange(sanitized);
              }}
              value={field.value || ""}
              helperText={
                errors.dni?.message ||
                (field.value?.length === 8 ? "✓ DNI completo" : "Ingrese los 8 dígitos")
              }
              slotProps={{
                input: {
                  inputProps: { maxLength: 8, autoComplete: "off" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              error={!!errors.dni || (!!error && error.code === 404)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&:hover fieldset": { borderColor: "#667eea" },
                },
              }}
            />
          )}
        />

        {/* Campo Verificador */}
        <Box sx={{ width: 140 }}>
          <Controller
            name="verificador"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="C. Verificador"              
                size="small"
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/\D/g, "").slice(0, 1);
                  field.onChange(sanitized);
                }}
                value={field.value || ""}
                helperText={
                  errors.verificador?.message ||
                  (field.value?.length === 1 ? "✓ Válido" : "1 dígito")
                }
                slotProps={{
                  input: {
                    inputProps: { maxLength: 1, autoComplete: "off" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                error={!!errors.verificador || (!!error && error.code === 401)}
                sx={{
                  width: 120,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": { borderColor: "#667eea" },
                  },
                }} 
              />
            )}
          />
        </Box>
      </Box>

      {/* Botón de ayuda */}
      <Box sx={{ width: "100%", textAlign: "left", mt: -1 }}>
        <Button
          size="small"
          onClick={handleOpenModal}
          startIcon={<HelpIcon fontSize="small" />}
          sx={{ textTransform: "none", color: "#667eea" }}
        >
          ¿Dónde encontrar mi código verificador?
        </Button>
      </Box>

      {/* Mensaje de error global */}
      <Fade in={!!error}>
        <Box sx={{ width: "100%" }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                borderRadius: 2,
                "& .MuiAlert-icon": { alignItems: "center" },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {error.msg}
              </Typography>
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Botón de consulta */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="medium"
          disabled={loading || !isValid}
          type="submit"
          sx={{
            height: 44,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #2e7d32 0%, #00902f 50%, #00902f 100%)",
            boxShadow: "0 4px 15px rgba(0, 144, 47, 0.3)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #2e7d32 0%, #00902f 50%, #3ab87b 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0, 144, 47, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
          endIcon={!loading && isValid ? <LoginIcon /> : null}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Consultar Identidad"}
        </Button>
      </Box>
    </Box>
  );
};

export default FormValidatorMain;