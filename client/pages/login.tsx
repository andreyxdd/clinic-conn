import React from 'react';
import { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import SkeletonLoader from '../components/LoginForm/SkeletonLoader';
import useUserRedirect from '../customHooks/useUserRedirect';
import useNoLayoutPage from '../customHooks/useNoLayoutPage';

const LoginForm = dynamic(
  () => import('../components/LoginForm/LoginForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);

interface ILoginPageProps {}

const Login: NextPage<ILoginPageProps> = () => {
  const isUser = useUserRedirect({ after: 6, where: '/home' });
  useNoLayoutPage();

  return (
    <>
      {!isUser ? (
        <LoginForm />
      ) : (
        <Typography
          variant='h5'
          sx={{
            fontStyle: 'italic',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          You are already logged in
        </Typography>
      )}
    </>
  );
};
export default Login;
