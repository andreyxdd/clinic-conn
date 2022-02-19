import React from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ValidationIcon from './ValidationIcon';
import { IValidatorProps } from '../utils/validateInput';

export interface IInputProps {
  id: string;
  required: boolean;
  label: string;
  name: string;
  type: string;
  value: string;
  autoComplete: string;
  halfWidth: boolean;
  valueToConfirm?: string;
  checkInDB?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line no-unused-vars
  validator?: ({ value, valueToConfirm, checkInDB }:IValidatorProps) => Promise<string>;
  setDisabledSubmit?: React.Dispatch<React.SetStateAction<boolean>>
}

/*
 * This component supposed to be used within MUI Grid tag.
 * When id equals to 'password' or 'confirmPassword' the Adornment
 * appears in the end of the field allowing to togle visibility
 */

const Input: React.FC<IInputProps> = ({
  id,
  required,
  label,
  name,
  type,
  value,
  autoComplete,
  halfWidth,
  valueToConfirm,
  checkInDB,
  handleChange,
  validator,
  setDisabledSubmit,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showValidationIcon, setShowValidationIcon] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleClickShowPassword = () => {
    setShowPassword((b) => !b);
  };

  const handleBlur = async () => {
    if (value !== '' && validator) {
      const validationResult = await validator(
        { value, valueToConfirm, checkInDB },
      );

      setError(validationResult);
      setShowValidationIcon(true);
    }
  };

  React.useEffect(() => {
    if (setDisabledSubmit) {
      if (required && value === '') {
        setDisabledSubmit(true);
      } else {
        setDisabledSubmit(false);
      }

      if (value !== '' && error !== '') {
        setDisabledSubmit(true);
      } else {
        setDisabledSubmit(false);
      }
    }
  }, [error, value]);

  React.useEffect(() => {
    if (value === '') {
      setShowValidationIcon(false);
    }
  }, [value]);

  return (
    <Grid item xs={12} sm={halfWidth ? 6 : 12}>
      <FormControl
        variant='outlined'
        required={required}
        fullWidth
      >
        <InputLabel error={error !== ''} htmlFor={`outlined-input-${id}`}>
          {label}
        </InputLabel>
        <OutlinedInput
          name={name}
          label={label}
          id={id}
          type={
            // eslint-disable-next-line no-nested-ternary
            (id === 'password' || id === 'confirmPassword')
              ? (showPassword ? 'text' : 'password')
              : type
          }
          value={value}
          autoComplete={autoComplete}
          onBlur={handleBlur}
          onChange={
            handleChange
          }
          error={error !== ''}
          endAdornment={(
            <InputAdornment position='end'>
              {(id === 'password' || id === 'confirmPassword') && (
                <IconButton
                  aria-label={`toggle ${id} visibility`}
                  onClick={
                    handleClickShowPassword
                  }
                  edge='end'
                  type='button'
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              )}
              {showValidationIcon && <ValidationIcon ml={2} valid={error === ''} />}
            </InputAdornment>
          )}
        />
        <FormHelperText id={`${id}-helper-text`} error={error !== ''}>
          {error}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default Input;
