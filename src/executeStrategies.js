import { setFormStatus } from './formStatus';
import { hasMissingStrategies } from './hasMissingStrategies';
import { getFormInputs, getFormState } from './stateManagement.js';
import { handleFailure, handleSuccess } from './handleFailure';
import { displayErrorsHere } from './displayErrorsHere';
import { executeStrategyOf } from './executeStrategyOf';
import { formHasErrors } from './formHasErrors';

export function executeStrategies() {
  if (hasMissingStrategies().length) {
    console.error(
      `Validation strategies have not been set for the following ID's: \n${hasMissingStrategies().join(
        '\n'
      )}`
    );
    return;
  }

  getFormInputs().forEach((inputId) => {
    getFormState().errors[inputId] = [];
    executeStrategyOf(inputId);
  });
  displayErrorsHere(getFormState().feedbackElement);
  if (formHasErrors()) {
    handleFailure();
    return setFormStatus(false);
  }
  handleSuccess();
  return setFormStatus(true);
}
