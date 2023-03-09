import { buildErrorList } from './buildErrorList';
import { generateAccessors } from './generateAccessors';
import { getFormInputs } from './stateManagement.js';

/**
 * Prepare input fields to be evaluated by their ids by:
 * -storing input ids in a list
 * -creating variables to store  and retrieve errors
 * -generating accessors (getters) to access the value of each
 *  input field to be used by their functions
 *
 * @function initializeInput
 * @param  {String} id ID of input field
 * @param  {Object} moduleInstance The FFV Instnace
 * @return {Void} Nothing is returned
 */
export function initializeInput(id, moduleInstance) {
  getFormInputs().push(id);
  buildErrorList(id);
  generateAccessors(id, moduleInstance);
}
