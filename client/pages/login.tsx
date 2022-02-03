import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import Layout from '../layouts/Layout';

interface ILoginProps {
}

const Login: React.FC<ILoginProps> = () => (
  <Layout
    showNavbar={false}
    showTransition={false}
    maxWidth='xs'
  >
    <LoginForm />
  </Layout>
);

export default Login;
