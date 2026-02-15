import { getFormState } from './stateManagement.js';
/**
 * Returns the arguments for the strategy function associated with a
 * given id
 * @function argumentsFor
 * @param  {String} id ID of input field
 * @return {Array} Array of arguments
 */

export function argumentsFor(id) {
  return getFormState().strategies[`${id}Args`];
}
