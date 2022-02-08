import React from 'react';
import { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Layout from '../layouts/Layout';
import useUserCSR from '../customHooks/useUserCSR';

const LoginForm = dynamic(() => import('../components/LoginForm/LoginForm'));

interface ILoginPageProps { }

const Login: NextPage<ILoginPageProps> = () => {
  const router = useRouter();
  const { user } = useUserCSR();
  const [showLoginForm, setShowLoginForm] = React.useState(false);

  React.useEffect(() => {
    // fetcher returns null if unauthorized
    if (user && user === null) {
      setShowLoginForm(true);
    } else {
      setTimeout(() => {
        router.push('/home');
      }, 6000);
    }
  }, [user]);

  return (
    <Layout
      showNavbar={false}
      showTransition={false}
      maxWidth='xs'
    >

      {showLoginForm ? (
        <LoginForm />
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
          You are already logged in
        </Typography>
      )}
    </Layout>
  );
};

export default Login;
