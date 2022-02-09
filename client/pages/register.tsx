import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';
import Layout from '../layouts/Layout';
import SkeletonLoader from '../components/RegisterForm/SkeletonLoader';
import { IUser } from '../config/types';
import withUser from '../lib/api/ssr/getProps';

export const getServerSideProps = withUser();

const RegisterForm = dynamic(
  () => import('../components/RegisterForm/RegisterForm'),
  { loading: () => <SkeletonLoader />, ssr: false },
);
interface IRegisterProps {
  user: IUser;
}

const Register: React.FC<IRegisterProps> = ({ user }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push('/hospitals');
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

    </Layout>
  );
};

export default Register;
