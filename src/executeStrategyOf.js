import { getFormState } from './stateManagement.js';
import { argumentsFor } from './argumentsFor';

export function executeStrategyOf(inputId) {
  // If no array of arguments are returned, assume a function exists and call
  // the function, if arguments do exists, call the function with the arguments
  // passed in
  if (!argumentsFor(inputId)) {
    getFormState().strategies[inputId]();
    return;
  }
  getFormState().strategies[inputId](...argumentsFor(inputId));
}
