import { evaluateInput } from './evaluateInput';

/**
 * Attach eventlisteners to all input fields provided
 * @function listenToInputs
 * @param  {Array} dirtyElements list of HTML form field elements
 *  @return {Void} Nothing is returned
 */
export function listenToInputs(dirtyElements) {
  dirtyElements.forEach((element) => {
    element.addEventListener('input', evaluateInput);
  });
}
