import { getFormState } from './stateManagement.js';

/**
 * Sets the status of the form based on the evaluation of form field
 * inputs
 * @function setFormStatus
 * @param  {Boolean} isValid whether or not the form is valid
 * @return {Void} Nothing is returned
 */
export function setFormStatus(isValid) {
  getFormState().isValid = isValid;
}

/**
 * Gets the status of the form based on the evaluation of form field
 * inputs
 * @function getFormStatus
 * @return {Boolean} whether or not the form is valid
 */
export function getFormStatus() {
  return getFormState().isValid;
}
