import React from 'react';
// import RegisterForm from '../components/RegisterForm/RegisterForm';
import Layout from '../layouts/Layout';

interface ILoginProps {
}

const Login: React.FC<ILoginProps> = () => (
  <Layout
    showNavbar={false}
    showTransition={false}
    maxWidth='xs'
  >
    <div>login page</div>
  </Layout>
);

export default Login;
