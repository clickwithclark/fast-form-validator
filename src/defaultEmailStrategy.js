import { getFormInputs, getFormState } from './stateManagement.js';

export function defaultEmailStrategy(id) {
  // eslint-disable-next-line no-useless-escape
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  console.log('formInputsArr', getFormInputs());
  console.log('formState', getFormState());
  console.log('this[${id}Value]', this[`${id}Value`]);
  console.log('email1Value', this.email1Value);
  console.log({ FFV: this });

  console.log('Pretty\n', new Error().stack.split('\n'));
  console.log('Ugly\n', new Error().stack);

  if (!this[`${id}Value`]) {
    this[`${id}Error`] = '❌Email cannot be empty';
  }
  if (this[`${id}Value`] && !validEmailRegex.test(this[`${id}Value`])) {
    this[`${id}Error`] = '❌Email must be valid';
  }
}
