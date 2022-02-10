import React from 'react';
import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';
import SkeletonLoader from '../components/RegisterForm/SkeletonLoader';
import useUserRedirect from '../customHooks/useUserRedirect';
import useNoLayoutPage from '../customHooks/useNoLayoutPage';

const RegisterForm = dynamic(
  () => import('../components/RegisterForm/RegisterForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);
interface IRegisterProps {}

const Register: React.FC<IRegisterProps> = () => {
  const isUser = useUserRedirect({ after: 6, where: '/home' });
  useNoLayoutPage();

  return (
    <>
      {!isUser ? (
        <RegisterForm />
      ) : (
        <Typography
          component='h1'
          variant='h5'
          sx={{
            fontStyle: 'italic',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          You are already registered
        </Typography>
      )}
    </>
  );
};

export default Register;
