/*
 * Methods to validate input data (usually for the forms).
 * Methods return the string describing the error; if no errors
 * were detected the empty string is returned.
 */

import axios from 'axios';
import env from '../config/env';

// -- Regex:
const validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const maxInputLength = /^.{200,}$/;
const minUsernameLength = /^.{5,}$/;
const spaces = /^\S*$/;
const specialCharachters = /[*|":<>[\]{}`\\()';@&$]/;
const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const numbers = /^([^0-9]*)$/;
// --

interface ICheckFieldProps{
  ok: boolean;
  message: string;
}

export interface IValidatorProps{
  value: string;
  valueToConfirm?: string;
  checkInDB?: boolean;
}

// method to check if the same email existed in db
async function checkEmail(emailToCheck: string): Promise<ICheckFieldProps> {
  try {
    const res = await axios.get(`${env.api}/auth/check_email`, {
      params: { email: emailToCheck },
    });

    return res.data;
  } catch (e) {
    console.log('%cvalidateInput.tsx line:40 e', 'color: #007acc;', e);
  }

  return { ok: false, message: 'Internal Server Error' };
}

// method to check if the same username existed in db
async function checkUsername(usernameToCheck: string):Promise<ICheckFieldProps> {
  try {
    const res = await axios.get(`${env.api}/auth/check_username`, {
      params: { username: usernameToCheck },
    });

    return res.data;
  } catch (e) {
    console.log('%cvalidateInput.tsx line:55 e', 'color: #007acc;', e);
  }

  return { ok: false, message: 'Internal Server Error' };
}

export async function validateEmail(
  { value, checkInDB }: IValidatorProps,
): Promise<string> {
  if (!validEmail.test(
    value,
  )) {
    return 'Incorrect email provided';
  }
  if (checkInDB) {
    const { ok, message } = await checkEmail(value);
    if (!ok) {
      return message;
    }
  }

  return '';
}

export async function validateUsername(
  { value, checkInDB }: IValidatorProps,
): Promise<string> {
  if (!minUsernameLength.test(value)) {
    return 'Username should be at least 5 charachters long';
  } if (!spaces.test(value)) {
    return 'Spaces are not allowed in username';
  } if (specialCharachters.test(value)) {
    return 'Special charachters are not allowed in username';
  } if (maxInputLength.test(value)) {
    return 'Username can\'t be that long';
  } if (checkInDB) {
    const { ok, message } = await checkUsername(value);
    if (!ok) {
      return message;
    }
  }
  return '';
}

export async function validatePassword(
  { value }: IValidatorProps,
): Promise<string> {
  if (!validPassword.test(value)) {
    return 'Password should be at least eight characters long, have one letter and one number';
  } if (maxInputLength.test(value)) {
    return 'Password can\'t be that long';
  }
  return '';
}

export async function validateConfirmPassword(
  { value, valueToConfirm }: IValidatorProps,
): Promise<string> {
  if (value !== valueToConfirm) {
    return 'Passwords do not match';
  }
  return '';
}

export async function validateName(
  { value }: IValidatorProps,
): Promise<string> {
  if (specialCharachters.test(value)) {
    return 'Special characters are not allowed';
  } if (maxInputLength.test(value)) {
    return 'This field can\'t be that long';
  } if (!numbers.test(value)) {
    return 'Numbers are not allowed';
  }
  return '';
}
