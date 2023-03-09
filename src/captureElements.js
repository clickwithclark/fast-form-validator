import { getFormInputs } from './stateManagement.js';

/**
 * Iterate over all form input ids to generate an array
 * of elements based on them
 * @function captureElements
 * @return {Array} An Array of form input HTML elements
 */
export function captureElements() {
  return getFormInputs().map((element) => document.getElementById(element));
}
