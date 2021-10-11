import { getFormInputs, getFormState } from './stateManagement.js';

export function formHasErrors() {
  let amountOfErrorsFound = 0;
  getFormInputs().forEach((inputId) => {
    amountOfErrorsFound += getFormState().errors[inputId].length;
  });
  return !!amountOfErrorsFound;
}
