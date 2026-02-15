import { getFormState } from './stateManagement.js';
import { handleFormSubmit } from './handleFormSubmit';

/**
 * @memberof FastFormValidator
 * @function onSubmitButton
 * @param  {String} id  Submit button ID
 * @param  {Function} submitAction Function to run when the user submits the form and the form has passed validation (no input errors)
 * @return {FastFormValidator}
 */
export function onSubmitButton(id, submitAction) {
  getFormState().submitAction = submitAction;
  const submitBtn = document.getElementById(id);
  submitBtn.addEventListener('click', handleFormSubmit);
  return this;
}
