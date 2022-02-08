import React from 'react';
import { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Layout from '../layouts/Layout';
import SkeletonLoader from '../components/LoginForm/SkeletonLoader';
import { IUser } from '../config/types';
import withUser from '../lib/api/SSR/getProps';

export const getServerSideProps = withUser();

const LoginForm = dynamic(() => import('../components/LoginForm/LoginForm'),
  { loading: () => <SkeletonLoader />, ssr: false });

interface ILoginPageProps {
  user: IUser;
}

const Login: NextPage<ILoginPageProps> = ({ user }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (user) {
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
      {!user ? (
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
