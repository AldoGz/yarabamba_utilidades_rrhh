// hooks/useHashValidation.ts
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hashService } from '../api/hash';
import { hashValidationSchema, HashValidationFormData } from '../schemas/hashValidationSchema';

export type HashStatus = 'valid' | 'expired' | 'invalid' | 'approved' | null;

export interface UseHashValidationReturn {
  hashStatus: HashStatus;
  isValidatingHash: boolean;
  isLoading: boolean;
  error: string;
  termsModalOpen: boolean;
  setTermsModalOpen: (open: boolean) => void;
  validateHash: (hash: string) => Promise<void>;
  submitApproval: (hash: string, code: string) => Promise<void>;
  clearError: () => void;
  initializeHashValidation: (hash: string) => void;
  formControl: ReturnType<typeof useForm<HashValidationFormData>>;
  onSubmit: (hash: string) => Promise<void>;
}

export const useHashValidation = (): UseHashValidationReturn => {
  const [hashStatus, setHashStatus] = useState<HashStatus>(null);
  const [isValidatingHash, setIsValidatingHash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Ref para saber si ya se alcanzó un estado terminal (approved, expired, invalid)
  const isTerminalState = useRef(false);
  // Ref para almacenar el hash actual (se usa al persistir)
  const currentHashRef = useRef<string>('');

  const formControl = useForm<HashValidationFormData>({
    resolver: zodResolver(hashValidationSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  // Validar si el hash está activo (solo si no estamos en estado terminal)
  const validateHash = async (hash: string) => {
    if (isTerminalState.current) return;

    setIsValidatingHash(true);
    try {
      const response = await hashService.checkHashStatus({ hash });
      if (response.valid) {
        setHashStatus('valid');
        // 'valid' no es terminal, aún se puede aprobar
      } else {
        // Si el backend dice que no es válido, puede ser expirado o ya usado.
        // Verificamos si previamente se persistió una aprobación para este hash.
        const storedHash = sessionStorage.getItem('approvedHash');
        if (storedHash === hash) {
          setHashStatus('approved');
        } else {
          setHashStatus('expired');
        }
        isTerminalState.current = true;
      }
    } catch (err: any) {
      console.error('Error validando hash:', err);
      setHashStatus('invalid');
      isTerminalState.current = true;
    } finally {
      setIsValidatingHash(false);
    }
  };

  // Enviar código de aprobación
  const submitApproval = async (hash: string, code: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await hashService.validateHash({
        hash,
        codigo_aprobacion: code,
      });

      if (response.success) {
        setHashStatus('approved');
        isTerminalState.current = true;
        // Persistir aprobación para que sobreviva a recargas
        sessionStorage.setItem('approvedHash', hash);
        console.log('Aprobación exitosa, estado persistido');
      } else {
        setError(response.message || 'Error en la validación');
      }
    } catch (err: any) {
      setError(err.msg || 'Error del servidor. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError('');
    formControl.clearErrors();
  };

  // Inicializar validación del hash (se llama una vez desde el componente)
  const initializeHashValidation = (hash: string) => {
    if (!hash) {
      setHashStatus('invalid');
      isTerminalState.current = true;
      setIsValidatingHash(false);
      return;
    }

    currentHashRef.current = hash;

    // Verificar si ya hay un estado aprobado persistido para este hash
    const storedApprovedHash = sessionStorage.getItem('approvedHash');
    if (storedApprovedHash === hash) {
      setHashStatus('approved');
      isTerminalState.current = true;
      setIsValidatingHash(false);
      return;
    }

    // Si ya se alcanzó un estado terminal, no volver a validar
    if (isTerminalState.current) {
      setIsValidatingHash(false);
      return;
    }

    // Solo si no hay estado terminal, ejecutamos la validación
    validateHash(hash);
  };

  // Manejar submit del formulario con react-hook-form
  const onSubmit = async (hash: string) => {
    const isValid = await formControl.trigger();
    if (!isValid) return;

    const { code } = formControl.getValues();
    await submitApproval(hash, code);
  };

  // Limpiar la persistencia si el componente se desmonta y no estamos en estado approved
  useEffect(() => {
    return () => {
      if (hashStatus !== 'approved') {
        sessionStorage.removeItem('approvedHash');
      }
    };
  }, [hashStatus]);

  return {
    hashStatus,
    isValidatingHash,
    isLoading,
    error,
    termsModalOpen,
    setTermsModalOpen,
    validateHash,
    submitApproval,
    clearError,
    initializeHashValidation,
    formControl,
    onSubmit,
  };
};