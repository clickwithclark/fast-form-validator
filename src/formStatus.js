import { getFormState } from './stateManagement.js';

export function setFormStatus(isValid) {
  getFormState().isValid = isValid;
}
export function getFormStatus() {
  return getFormState().isValid;
}
