import { useRef, useEffect, useState } from 'react';
import { useController, Control, FieldErrors } from 'react-hook-form';
import { HashValidationFormData } from '../schemas/hashValidationSchema';

interface UseOTPInputReturn {
  values: string[];
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export const useOTPInput = (
  control: Control<HashValidationFormData>,
  name: keyof HashValidationFormData
): UseOTPInputReturn => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = useState(['', '', '', '']);

  const { field } = useController({ control, name });

  const getValuesArray = (): string[] => {
    const raw = field.value || '';
    return raw.toString().split('').concat(['', '', '', '']).slice(0, 4);
  };

  const updateFormAndFocus = (newValues: string[], focusIndex?: number) => {
    field.onChange(newValues.join(''));
    if (focusIndex !== undefined && inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 1) {
      const newValues = getValuesArray();
      newValues[index] = numericValue;
      setValues(newValues);
      
      updateFormAndFocus(newValues, numericValue && index < 3 ? index + 1 : undefined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      const valuesArray = getValuesArray();
      if (!valuesArray[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newValues = [...valuesArray];
        newValues[index - 1] = '';
        setValues(newValues);
        updateFormAndFocus(newValues, index - 1);
      } else {
        const newValues = [...valuesArray];
        newValues[index] = '';
        setValues(newValues);
        updateFormAndFocus(newValues);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericData = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (numericData.length === 4) {
      const newValues = numericData.split('');
      while (newValues.length < 4) newValues.push('');
      const lastFilledIndex = newValues.findIndex(v => v === '') - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 3;
      updateFormAndFocus(newValues, focusIndex);
    }
  };

  useEffect(() => {
    const newValues = getValuesArray();
    setValues(newValues);
  }, [field.value]);

  return {
    values,
    handleChange,
    handleKeyDown,
    handlePaste,
    inputRefs,
  };
};
