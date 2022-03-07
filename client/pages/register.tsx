import React from 'react';
import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';
import SkeletonLoader from '../components/RegisterForm/SkeletonLoader';
import useRedirect from '../customHooks/useRedirect';
import useLayout from '../customHooks/useLayout';
import ClientOnlyDiv from '../components/ClientOnlyDiv';

const RegisterForm = dynamic(
  () => import('../components/RegisterForm/RegisterForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);
interface IRegisterProps {}

const Register: React.FC<IRegisterProps> = () => {
  const user = useRedirect({ after: 6, where: '/home', whom: 'user' });
  useLayout({ showNavbar: false, showTransition: false, containerMaxWidth: 'xs' });

  return (
    <ClientOnlyDiv>
      {!user ? (
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
    </ClientOnlyDiv>
  );
};

export default Register;
