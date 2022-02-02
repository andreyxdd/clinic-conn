import React from 'react';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import Layout from '../layouts/Layout';

interface IRegisterProps {
}

const Register: React.FC<IRegisterProps> = () => <Layout><RegisterForm /></Layout>;

export default Register;
