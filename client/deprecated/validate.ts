import React from 'react';

export interface IformFieldsProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface IformProps extends IformFieldsProps {
  confirmPassword: string;
  allowSubmit: boolean;
  success: boolean;
  generalHelperText: string;
}

// -- Regex:
const validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const maxInputLength = /^.{200,}$/;
const minUsernameLength = /^.{5,}$/;
const spaces = /^\S*$/;
const specialCharachters = /[*|":<>[\]{}`\\()';@&$]/;
const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//

const validate = (
  form: IformProps,
  setForm: React.Dispatch<React.SetStateAction<IformProps>>,
  errors: IformFieldsProps,
  setErrors: React.Dispatch<React.SetStateAction<IformFieldsProps>>,
  field: string,
  value: string,
) => {
  // -- EMAIL
  if (field === 'email') {
    if (!validEmail.test(
      value,
    )) {
      setErrors({ ...errors, email: 'Incorrect email provided' });
    } else {
      setErrors({ ...errors, email: '' });
      setForm({ ...form, email: value });
    }
  }
  //--

  // -- USERNAME
  if (field === 'username') {
    if (!minUsernameLength.test(value)) {
      setErrors(
        {
          ...errors,
          username: 'Username should be at least 5 charachters long',
        },
      );
    } else if (!spaces.test(value)) {
      setErrors(
        {
          ...errors,
          username: 'Spaces are not allowed in username',
        },
      );
    } else if (specialCharachters.test(value)) {
      setErrors(
        {
          ...errors,
          username: 'Special charachters are not allowed in username',
        },
      );
    } else if (maxInputLength.test(value)) {
      setErrors(
        {
          ...errors,
          username: 'Username can\'t be that long',
        },
      );
    } else {
      setErrors({ ...errors, username: '' });
      setForm({ ...form, username: value });
    }
  }
  //--

  // -- PASWORD
  if (field === 'password') {
    if (!validPassword.test(value)) {
      setErrors(
        {
          ...errors,
          password: 'Password should be at least eight characters long, have one letter and one number',
        },
      );
    } else if (maxInputLength.test(value)) {
      setErrors(
        {
          ...errors,
          password: 'Password can\'t be that long',
        },
      );
    } else {
      setErrors({ ...errors, password: '' });
      setForm({ ...form, password: value });
    }
  }
  //--

  // -- CONFIRM PASWORD
  if (field === 'confirmPassword') {
    if (form.password !== value) {
      setErrors(
        {
          ...errors,
          confirmPassword: 'Passwords do not match',
        },
      );
    } else {
      setErrors(
        {
          ...errors,
          confirmPassword: '',
        },
      );
      setForm({ ...form, confirmPassword: value });
    }
  }
  //--

  // -- FIRSTNAME
  if (field === 'firstName') {
    if (specialCharachters.test(value)) {
      setErrors(
        {
          ...errors,
          firstName: 'Special characters are not allowed',
        },
      );
    } else if (maxInputLength.test(value)) {
      setErrors(
        {
          ...errors,
          firstName: 'First name can\'t be that long',
        },
      );
    } else {
      setErrors(
        {
          ...errors,
          firstName: '',
        },
      );
      setForm({ ...form, firstName: value });
    }
  }
  //--

  // -- LASTNAME
  if (field === 'lastName') {
    if (specialCharachters.test(value)) {
      setErrors(
        {
          ...errors,
          lastName: 'Special characters are not allowed',
        },
      );
    } else if (maxInputLength.test(value)) {
      setErrors(
        {
          ...errors,
          lastName: 'Last name can\'t be that long',
        },
      );
    } else {
      setErrors(
        {
          ...errors,
          lastName: '',
        },
      );
      setForm({ ...form, lastName: value });
    }
  }
  //--
};

export default validate;
