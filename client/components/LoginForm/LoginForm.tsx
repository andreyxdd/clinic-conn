import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import env from '../../config/env';

// custom
import Input, { IInputProps } from '../Input';
import requiredFields from './formFields';

// auth
import { setAccessToken } from '../../config/auth';

const LoginForm = () => {
  // -- required fields
  const [
    requiredForm,
    setRequiredForm,
  ] = React.useState<Array<IInputProps>>(requiredFields);

  const handleRequiredFormChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = [...requiredForm]; // copying the old datas array
    newForm[index].value = event.target.value;
    setRequiredForm(newForm);
  };

  const findRequiredFieldValue = (idToFind: string) => (
    requiredForm[
      requiredForm.findIndex(({ id }) => id === idToFind)
    ].value
  );

  // --

  // -- submit button state
  const [disabledSubmit, setDisabledSubmit] = React.useState(true);
  const [showFormHelper, setShowFormHelper] = React.useState(false);
  const [helper, setHelper] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    if (disabledSubmit) {
      setHelper(
        'Please filled out required fields or correct errors indicated above',
      );
    }
  }, [disabledSubmit]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabledSubmit) {
      setShowFormHelper(true);
    } else {
      setShowFormHelper(false);

      console.log('login form submitted!!');

      const res = await axios.post(`${env.api}/login`,
        {
          email: findRequiredFieldValue('email'),
          password: findRequiredFieldValue('password'),
        },
        { withCredentials: true });

      console.log(res);

      if (res) {
        if (res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          router.push('/home');
        } else {
          setShowFormHelper(true);
          setHelper('Internal Server error');
        }
      } else {
        setShowFormHelper(true);
        setHelper('Internal Server error');
      }
    }
  };
  // --

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Login
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {requiredForm.map((field: IInputProps, idx: number) => (
            <Input
              id={field.id}
              label={field.label}
              name={field.name}
              autoComplete={field.autoComplete}
              type={field.type}
              required={field.required}
              handleChange={handleRequiredFormChange(idx)}
              value={requiredForm[idx].value}
              halfWidth={field.halfWidth}
              validator={field.validator}
              valueToConfirm={
                requiredForm[
                  requiredForm.findIndex(({ id }) => id === 'password')
                ].value
              }
              setDisabledSubmit={setDisabledSubmit}
              key={field.label}
            />
          ))}
          {showFormHelper && (
            <Grid container justifyContent='center'>
              <Grid item>
                <FormHelperText error id='form-helper-text'>
                  {helper}
                </FormHelperText>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 1, mb: 2 }}
        >
          Login
        </Button>
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link href='/register' variant='body2'>
              Don&apos;t have an account? Register
            </Link>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
};

export default LoginForm;
