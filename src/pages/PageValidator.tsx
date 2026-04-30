// pages/PageValidator.tsx
import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { usePageValidator } from '../hooks/usePageValidator';
import FormValidator from '../components/FormValidator';
import PreviumDocument from '../components/PreviumDocument';

const PageValidator = () => {
  const {
    formMethods,
    handleSubmit,
    isPending,
    error,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  } = usePageValidator();

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
      }}
    >
      <FormProvider {...formMethods}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormValidator
              loading={isPending}
              error={error}
              handleOpenModal={handleOpenModal}
            />
          </form>
          <PreviumDocument
            modalOpen={modalOpen}
            handleCloseModal={handleCloseModal}
          />
        </Box>
      </FormProvider>
    </Box>
  );
};

export default PageValidator;