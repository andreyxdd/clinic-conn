import React from 'react';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import Layout from '../layouts/Layout';

interface IRegisterProps {
}

const Register: React.FC<IRegisterProps> = () => (
  <Layout
    showNavbar={false}
    showTransition={false}
    maxWidth='xs'
  >
    <RegisterForm />
  </Layout>
);

export default Register;
