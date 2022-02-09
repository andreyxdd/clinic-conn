import React from 'react';
import { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import Layout from '../layouts/Layout';
import SkeletonLoader from '../components/LoginForm/SkeletonLoader';
import useUserRedirect from '../customHooks/useRedirect';

const LoginForm = dynamic(
  () => import('../components/LoginForm/LoginForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);

interface ILoginPageProps {}

const Login: NextPage<ILoginPageProps> = () => {
  const isUser = useUserRedirect({ after: 6, where: '/home' });
  return (
    <Layout
      showNavbar={false}
      showTransition={false}
      maxWidth='xs'
    >
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
    </Layout>
  );
};
export default Login;
