import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface IValidationIconProps {
  valid: boolean;
  ml?: number; // margin left value
}

const ValidationIcon: React.FC<IValidationIconProps> = ({ valid, ml }) => {
  if (valid) {
    return <CheckCircleOutlineIcon color='success' sx={{ ml }} />;
  }
  return <ErrorOutlineIcon color='error' sx={{ ml }} />;
};

export default ValidationIcon;
