import { getFormInputs, getFormState } from './stateManagement.js';

/**
 * Check the instance's state for errors of each input provided
 * @function formHasErrors
 * @return {Boolean} True or False
 */
export function formHasErrors() {
  let amountOfErrorsFound = 0;
  getFormInputs().forEach((inputId) => {
    amountOfErrorsFound += getFormState().errors[inputId].length;
  });
  return !!amountOfErrorsFound;
}
