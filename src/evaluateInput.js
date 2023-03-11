import { saveInput } from './saveInput';
import { executeStrategies } from './executeStrategies';

/**
 * When an input event is triggered on a form input field, the value is
 * stored in the instance's state and the respective evaluation function
 * (strategy) is called testing all input fields
 * @function evaluateInput
 * @param  {InputEvent} event An input event
 * @return {Void} Nothing is returned
 */
export function evaluateInput(event) {
  saveInput(event);
  executeStrategies();
}
