import React from 'react';
import { Box, TextField } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';
import { HashValidationFormData } from '../schemas/hashValidationSchema';
import { useOTPInput } from '../hooks/useOTPInput';

interface OTPInputProps {
  control: Control<HashValidationFormData>;
  name: keyof HashValidationFormData;
  errors?: FieldErrors<HashValidationFormData>;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ control, name, errors, disabled = false }) => {
  const {
    values,
    handleChange,
    handleKeyDown,
    handlePaste,
    inputRefs,
  } = useOTPInput(control, name);

  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
      {[0, 1, 2, 3].map((index) => (
        <TextField
          key={index}
          inputRef={(el) => (inputRefs.current[index] = el)}
          variant="outlined"
          value={values[index]}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              inputMode: 'numeric',
              autoComplete: 'one-time-code',
              style: { 
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: '900',
                color: '#1976d2'
              },
              'aria-label': `Digit ${index + 1} of 4`,
            },
          }}
          error={!!errors?.code}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          sx={{ width: '56px' }}
        />
      ))}
    </Box>
  );
};

export default OTPInput;