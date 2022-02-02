import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import useRegisterForm from './useRegisterForm';

const RegisterForm = () => {
  const {
    handleBlur, errors, handleSubmit, form,
    handlePasswordChange, handleConfirmPasswordChange,
  } = useRegisterForm();

  const [birthday, setBirthday] = React.useState<Date | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((b) => !b);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Register
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel component='legend'>Required fields:</FormLabel>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onBlur={handleBlur}
              error={errors.email !== ''}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              onBlur={handleBlur}
              helperText={errors.username}
              error={errors.username !== ''}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl
              variant='outlined'
              fullWidth
              required
            >
              <InputLabel error={errors.password !== ''} htmlFor='outlined-adornment-password'>
                Password
              </InputLabel>
              <OutlinedInput
                name='password'
                label='Password'
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                autoComplete='new-password'
                onBlur={handleBlur}
                onChange={
                  handlePasswordChange
                }
                error={errors.password !== ''}
                endAdornment={(
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={
                        handleClickShowPassword
                      }
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )}
                fullWidth
              />
              <FormHelperText id='password-helper-text'>
                {errors.password}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl
              variant='outlined'
              fullWidth
              required
            >
              <InputLabel error={errors.confirmPassword !== ''} htmlFor='outlined-adornment-confirm-password'>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                name='confirmPassword'
                label='Confirm Password'
                id='confirmPassword'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                onBlur={handleBlur}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword !== ''}
                value={form.confirmPassword}
                endAdornment={(
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={
                        handleClickShowPassword
                      }
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )}
                fullWidth
              />
              <FormHelperText id='confirm-password-helper-text'>
                {errors.confirmPassword}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item sx={{ mt: 2 }} xs={12}>
            <FormLabel component='legend'>Additional fields:</FormLabel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id='firstName'
              label='First Name'
              name='firstName'
              autoComplete='given-name'
              onBlur={handleBlur}
              helperText={errors.firstName}
              error={errors.firstName !== ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id='lastName'
              label='Last Name'
              name='lastName'
              autoComplete='family-name'
              onBlur={handleBlur}
              helperText={errors.lastName}
              error={errors.lastName !== ''}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label='Birthday'
                openTo='year'
                views={['year', 'month', 'day']}
                value={birthday}
                onChange={(newBirthday: Date | null) => {
                  setBirthday(newBirthday);
                }}
                renderInput={(params: any) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    id='birthday'
                    name='birthday'
                    autoComplete='bday'
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid sx={{ mt: 2, mb: 2 }} item xs={12}>
            <FormControlLabel
              control={<Checkbox value='allowExtraEmails' color='primary' />}
              label='I want to receive inspiration, marketing promotions and updates via email.'
            />
          </Grid>
        </Grid>
        {form.generalHelperText && (
          <Grid sx={{ mt: 3 }} container justifyContent='center'>
            <Grid item>
              <FormHelperText error id='general-helper-text'>
                {form.generalHelperText}
              </FormHelperText>
            </Grid>
          </Grid>
        )}
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 1, mb: 2 }}
          disabled={!form.allowSubmit}
        >
          Register
        </Button>
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link href='/login' variant='body2'>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegisterForm;
