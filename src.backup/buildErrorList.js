import { getFormState } from './stateManagement.js';

/**
 * Creates a property in the FFV instance to contain the error(s)
 * generated from unsuccessful validation attempts from a given
 * input id
 * @function buildErrorList
 * @param  {String} id ID of input field
 * @return {Void} Nothing is returned
 */
export function buildErrorList(id) {
  const newError = { [id]: [] };
  getFormState().errors = { ...getFormState().errors, ...newError };
}
