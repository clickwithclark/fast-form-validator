import { getDefaults } from './stateManagement.js';

export function defaultEmailStrategy() {
  // eslint-disable-next-line no-useless-escape
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!this.emailValue) {
    this.emailError = '❌Email cannot be empty';
  }
  if (this.emailValue && !validEmailRegex.test(this.emailValue)) {
    this.emailError = '❌Email must be valid';
  }
}
