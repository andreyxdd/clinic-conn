import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';

import Input, { IInputProps } from '../Input';
import { requiredFields, additionalFields } from './formFields';

const RegisterForm = () => {
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
  // --

  // -- additional fields
  const [
    additionalForm,
    setAdditionalForm,
  ] = React.useState<Array<IInputProps>>(additionalFields);

  const [birthdayField, setBithdayField] = React.useState<Date | null>(null);

  const handleAdditionalFormChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = [...additionalForm]; // copying the old datas array
    newForm[index].value = event.target.value;
    setAdditionalForm(newForm);
  };
  //--

  // -- submit button state
  const [disabledSubmit, setDisabledSubmit] = React.useState(true);
  const [showFormHelper, setShowFormHelper] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabledSubmit) {
      setShowFormHelper(true);
    } else {
      setShowFormHelper(false);

      console.log(additionalForm);
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
        Register
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel component='legend'>Required fields:</FormLabel>
          </Grid>
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
          <Grid item xs={12}>
            <FormLabel component='legend'>Additional fields:</FormLabel>
          </Grid>
          {additionalForm.map((field: IInputProps, idx: number) => (
            <Input
              id={field.id}
              label={field.label}
              name={field.name}
              autoComplete={field.autoComplete}
              type={field.type}
              required={field.required}
              handleChange={handleAdditionalFormChange(idx)}
              value={additionalForm[idx].value}
              halfWidth={field.halfWidth}
              validator={field.validator}
              key={field.label}
            />
          ))}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label='Birthday'
                openTo='year'
                views={['year', 'month', 'day']}
                value={birthdayField}
                onChange={(newBirthday: Date | null) => {
                  setBithdayField(newBirthday);
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
          <Grid sx={{ mt: 2 }} item xs={12}>
            <FormControlLabel
              control={<Checkbox value='allowExtraEmails' color='primary' />}
              label='I agree with terms and conditions'
            />
          </Grid>
          <Grid sx={{ mb: 2 }} item xs={12}>
            <FormControlLabel
              control={<Checkbox value='allowExtraEmails' color='primary' />}
              label='I want to receive inspiration, marketing promotions and updates via email.'
            />
          </Grid>
          {showFormHelper && (
            <Grid container justifyContent='center'>
              <Grid item>
                <FormHelperText error id='form-helper-text'>
                  Please filled out required fields or correct errors indicated above
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
