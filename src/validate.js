import { setFormStatus, getFormStatus } from './formStatus';
import { executeStrategies } from './executeStrategies';
import { captureElements } from './captureElements';
import { listenToInputs } from './listenToInputs';

/**
 * The last method that should be called  after setting strategies
 * for inputs or after using default strategies, it starts the validating
 * process by listening to input fields.
 * @memberof FastFormValidator
 * @function validate
 * @return {Boolean} true if the all fields have valid input, false otherwise
 */
export function validate() {
  setFormStatus(false);
  const dirtyElements = captureElements();
  listenToInputs(dirtyElements);
  executeStrategies();
  return getFormStatus();
}
