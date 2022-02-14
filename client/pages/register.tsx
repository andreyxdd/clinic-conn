import React from 'react';
import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';
import SkeletonLoader from '../components/RegisterForm/SkeletonLoader';
import useRedirect from '../customHooks/useRedirect';
import useLayout from '../customHooks/useLayout';

const RegisterForm = dynamic(
  () => import('../components/RegisterForm/RegisterForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);
interface IRegisterProps {}

const Register: React.FC<IRegisterProps> = () => {
  const isUser = useRedirect({ after: 6, where: '/home', whom: 'user' });
  useLayout({ showNavbar: false, showTransition: false, containerMaxWidth: 'xs' });

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
