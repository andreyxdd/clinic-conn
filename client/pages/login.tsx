import React from 'react';
import Typography from '@mui/material/Typography';
import LoginForm from '../components/LoginForm/LoginForm';
import { useUser } from '../context/userContext';
import Layout from '../layouts/Layout';

import { withUser } from '../lib/getProps';

export const getServerSideProps = withUser({ dstAuthorized: '/hospitals' });

interface ILoginProps {}

const Login: React.FC<ILoginProps> = () => {
  const { user } = useUser();
  return (
    <Layout
      showNavbar={false}
      showTransition={false}
      maxWidth='xs'
    >
      {user ? (
        <Typography variant='h5' sx={{ fontStyle: 'italic' }}>
          You are already logged in
        </Typography>
      ) : <LoginForm />}

    </Layout>
  );
};

export default Login;
