import React from 'react';
import type { NextPage } from 'next';
import {
  Typography, Grid, Box, FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios, { AxiosError } from 'axios';
import Countdown from 'react-countdown';
import useRedirect from '../customHooks/useRedirect';
import useLayout from '../customHooks/useLayout';
import ClientOnlyDiv from '../components/ClientOnlyDiv';
import Input from '../components/Input';
import env from '../config/env';

const timeToAllowResend = 180; // 3 min

const Reconfirmation: NextPage = (): JSX.Element => {
  useLayout();
  const isUser = useRedirect({ after: 6, where: '/home', whom: 'user' });

  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [helperText, setHelperText] = React.useState('');
  const [disabledSubmit, setDisabledSubmit] = React.useState(false);
  const countdownRef = React.useRef<Countdown>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setHelperText('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHelperText('');
    setIsLoading(true);

    try {
      const res = await axios.get(`${env.api}/auth/reconfirm`, {
        params: {
          email: inputValue,
        },
      });

      if (res.status === 200) {
        setIsLoading(false);
        setDisabledSubmit(true);

        if (countdownRef.current) {
          countdownRef.current.start();
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorRes = axiosError.response;
      if (errorRes) {
        if (errorRes.status === 400) {
          setHelperText(
            // eslint-disable-next-line max-len
            'User with this email is not registered.\nPlease check the correctness of the email input or proceed to the registration form.',
          );
          setIsLoading(false);
        } if (errorRes.status === 403) {
          setHelperText(
            // eslint-disable-next-line max-len
            'User with this email is already verified. \nPlease check the correctness of the email input or proceed to the login form.',
          );
          setIsLoading(false);
        } if (errorRes.status === 500) {
          setHelperText(
            'Internal Server Error',
          );
          setIsLoading(false);
        }
      }
    }
  };

  // Render a countdown
  const countdownRenderer = (
    props: {
      minutes: number,
      seconds: number,
      completed: boolean,
    },
  ) => (
    <span>
      You an request another confirmation link in:
      {' '}
      {props.minutes}
      :
      {props.seconds < 10 ? `0${props.seconds}` : props.seconds}
    </span>
  );
  return (
    <ClientOnlyDiv>
      {isUser ? (
        <Typography variant='h4' align='center'>
          Sorry, this page is not availble to you. In a few secs you will be redirected to the Home page
        </Typography>
      )
        : (
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid
              container
              spacing={3}
              alignItems='center'
              justifyContent='center'
              direction='column'
            >
              <Grid
                item
                sx={{ mt: 5, mb: 5 }}
              >
                <Typography variant='h4' align='center'>
                  Resend Confirmation Link
                </Typography>
              </Grid>
              <Grid
                item
              >
                <Typography variant='body1' align='center'>
                  To confirm your newly created account, please specify an email you used during the regsitation
                </Typography>
              </Grid>
              <Input
                id='email'
                required
                label='Email Address'
                name='email'
                type='email'
                value={inputValue}
                autoComplete='email'
                halfWidth={false}
                handleChange={handleInputChange}
              />
              {helperText && (
                <FormHelperText error id='form-helper-text'>
                  {helperText}
                </FormHelperText>
              )}
              <Grid
                item
              >
                <LoadingButton
                  variant='contained'
                  loading={isLoading}
                  type='submit'
                  fullWidth
                  size='large'
                  disabled={disabledSubmit}
                >
                  Resend Link
                </LoadingButton>
              </Grid>
              {
                disabledSubmit ? (
                  <Grid item>
                    <Countdown
                      date={Date.now() + timeToAllowResend * 1000}
                      renderer={countdownRenderer}
                      autoStart={false}
                      ref={countdownRef}
                      onComplete={() => { setDisabledSubmit(false); }}
                    />
                  </Grid>
                ) : <></>
              }

            </Grid>
          </Box>
        )}
    </ClientOnlyDiv>
  );
};

export default Reconfirmation;
