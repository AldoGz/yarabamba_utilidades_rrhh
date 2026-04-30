import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/useAuthStore';
import { useUpdateUser } from './useUpdateUser';
import { useUpdateFormStore } from '../stores/useUpdateFormStore';

// Esquema de validación con zod
const formSchema = z.object({
    banco: z.string().min(1, 'Seleccione un banco'),
    cuenta: z.string().min(1, 'Ingrese el número de cuenta'),
    cci: z.string().length(20, 'El CCI debe tener exactamente 20 dígitos'),
    correo: z.string().email('Ingrese un correo válido'),
    tel1: z.string().min(9, 'Ingrese un número de teléfono válido'),
    tel2: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const usePageUpdate = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Store de autenticación para obtener el usuario
    const { usuario } = useAuthStore();

    console.log();
    
    // Hook para actualizar usuario
    const updateUser = useUpdateUser();
    
    // Store del formulario para manejar estado de guardado
    const { guardado } = useUpdateFormStore();
    
    // Configuración de react-hook-form
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            banco: '',
            cuenta: '',
            cci: '',
            correo: '',
            tel1: '',
            tel2: '',
        }
    });

    // Watch values para validación de pasos
    const formValues = watch();

    // Mapeo de bancos
    const bancoPorId: { [key: number]: string } = {
        1: 'BCP',
        2: 'BBVA', 
        3: 'Interbank',
        4: 'Scotiabank',
        5: 'BanBif',
        6: 'Banco de la Nación',
        7: 'Banco Pichincha',
        8: 'Citibank',
        9: 'Mibanco',
        10: 'Banco Falabella',
        11: 'Banco Ripley',
        12: 'Alfin Banco',
        13: 'Compartamos Financiera',
        14: 'Crediscotia',
        15: 'Financiera Oh!',
        16: 'Qapaq'
    };

    const bancoCodigos: { [key: string]: number } = {
        'BCP': 1,
        'BBVA': 2,
        'Interbank': 3,
        'Scotiabank': 4,
        'BanBif': 5,
        'Banco de la Nación': 6,
        'Banco Pichincha': 7,
        'Citibank': 8,
        'Mibanco': 9,
        'Banco Falabella': 10,
        'Banco Ripley': 11,
        'Alfin Banco': 12,
        'Compartamos Financiera': 13,
        'Crediscotia': 14,
        'Financiera Oh!': 15,
        'Qapaq': 16
    };

    // Pre-llenar el formulario con los datos del usuario cuando se carga
    useEffect(() => {
        if (usuario) {
            // Llenar datos bancarios
            if (usuario.idBanco) {
                const bancoSeleccionado = bancoPorId[usuario.idBanco] || '';
                setValue('banco', bancoSeleccionado);
            }
            if (usuario.cuentaBancaria) setValue('cuenta', usuario.cuentaBancaria);
            if (usuario.cci) setValue('cci', usuario.cci);
            
            // Llenar datos de contacto
            if (usuario.email) setValue('correo', usuario.email);
            if (usuario.phone1) setValue('tel1', usuario.phone1);
            if (usuario.phone2) setValue('tel2', usuario.phone2 || '');
        }
    }, [usuario, setValue]);

    // Mostrar backdrop cuando la mutación comienza y mantenerlo hasta éxito
    useEffect(() => {
        if (updateUser.isPending) {
            setShowSuccessModal(true);
        }
    }, [updateUser.isPending]);

    // Limpiar error cuando la mutación tiene éxito
    useEffect(() => {
        if (updateUser.isSuccess) {
            setError(null);
            // El backdrop ya está mostrándose, no necesitamos hacer nada más aquí
        }
    }, [updateUser.isSuccess]);
    
    // Manejar errores de la mutación
    useEffect(() => {
        if (updateUser.isError && updateUser.error) {
            setError(updateUser.error.msg || 'Error al actualizar los datos. Intente nuevamente.');
            setShowSuccessModal(false); // Ocultar backdrop en caso de error
        }
    }, [updateUser.isError, updateUser.error]);

    const steps = ['Datos Bancarios', 'Datos de Contacto'];

    const isStepValid = (step: number): boolean => {
        if (step === 0) return Boolean(formValues.banco && formValues.cuenta && formValues.cci.length === 20);
        if (step === 1) return Boolean(formValues.correo && formValues.tel1.length >= 9);
        return false;
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            // Enviar formulario
            handleSubmit((data) => {
                console.log('Datos del formulario:', data);
                
                const updatePayload = {
                    id_banco: bancoCodigos[data.banco] || 1,
                    cuenta_bancaria: data.cuenta,
                    cci: data.cci,
                    email: data.correo,
                    telefono_1: data.tel1,
                    telefono_2: data.tel2 || '',
                };
                
                // Llamar al endpoint de actualización
                updateUser.mutate(updatePayload);
            })();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    return {
        // Estado
        activeStep,
        error,
        showSuccessModal,
        guardado,
        formValues,
        errors,
        isValid,
        
        // Formulario
        control,
        handleSubmit,
        setValue,
        watch,
        
        // Acciones
        handleNext,
        handleBack,
        
        // Utilidades
        steps,
        isStepValid,
        bancoPorId,
        bancoCodigos,
        
        // Estado de la mutación
        updateUser,
        user: usuario
    };
};
