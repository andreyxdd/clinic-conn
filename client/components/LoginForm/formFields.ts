import { IInputProps } from '../Input';

const requiredFields: Array<IInputProps> = [
  {
    id: 'email',
    required: true,
    label: 'Email Address',
    name: 'email',
    type: 'email',
    value: '',
    autoComplete: 'email',
    halfWidth: false,
  },
  {
    id: 'password',
    required: true,
    label: 'Password',
    name: 'password',
    type: 'password',
    value: '',
    autoComplete: 'password',
    halfWidth: false,
  },
];

export default requiredFields;
