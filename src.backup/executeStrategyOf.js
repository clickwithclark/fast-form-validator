import { getFormState } from './stateManagement.js';
import { argumentsFor } from './argumentsFor';

/**
 * Executes the strategy function of a single input field based on
 * the input id
 *
 * If no array of arguments are returned, assume a function exists and
 * call the function, if arguments do exists, call the function with
 * the arguments passed in
 *
 * @function executeStrategyOf
 * @param  {type} inputId {description}
 * @return {type} {description}
 */
export function executeStrategyOf(inputId) {
  if (!argumentsFor(inputId)) {
    getFormState().strategies[inputId]();
    return;
  }
  getFormState().strategies[inputId](...argumentsFor(inputId));
}
