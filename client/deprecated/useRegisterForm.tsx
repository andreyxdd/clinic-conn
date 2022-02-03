import { useEffect, useState } from 'react';
import validate, { IformFieldsProps, IformProps } from './validate';
import { useRegisterMutMutation } from '../generated/graphql';

const formFields = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
};

const initialFormState = {
  ...formFields,
  allowSubmit: false,
  success: false,
  generalHelperText: '',
};

const useRegisterForm = () => {
  const [, register] = useRegisterMutMutation();

  // "errors" is used to check the required fields for errors
  const [errors, setErrors] = useState<IformFieldsProps>(formFields);

  const [form, setForm] = useState<IformProps>(initialFormState);

  useEffect(() => {
    // check if required fields are filled
    // and if there is no errors at all
    if (
      form.email
      && form.username
      && form.password
      && form.confirmPassword
      && Object.values(errors).every((er) => er === '')
    ) {
      setForm({ ...form, allowSubmit: true });
    } else {
      setForm({ ...form, allowSubmit: false });
    }
  }, [form.email && form.username && form.password && form.confirmPassword]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const currentTarget = (event.target as HTMLInputElement);
    validate(
      form,
      setForm,
      errors,
      setErrors,
      currentTarget.id,
      currentTarget.value,
    );
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({ ...form, password: event.target.value });
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({ ...form, confirmPassword: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await register({
        email: form.email,
        username: form.username,
        password: form.password,
        first_name: form.firstName ? form.firstName : null,
        last_name: form.lastName ? form.lastName : null,
      });

      const data = response.data?.register;

      // send request to db
      // check if username and email aren't duplicates
      // const res = { ok: false, field: 'email', error: 'email already exists' };

      console.log(data);

      if (data?.ok) {
        setForm({ ...form, success: true });
      } else if (data?.field === 'email') {
        setErrors(
          {
            ...errors,
            email: data!.error!,
          },
        );
      } else if (data?.field === 'username') {
        setErrors(
          {
            ...errors,
            username: data!.error!,
          },
        );
      } else {
        console.log(form);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    handleSubmit,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleBlur,
    errors,
    form,
  };
};

export default useRegisterForm;
