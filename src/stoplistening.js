import { evaluateInput } from './evaluateInput';
import { captureElements } from './captureElements';

/**
 * Remove event listeners from all input fields
 * @function stoplistening
 *  @return {Void} Nothing is returned
 */
export function stoplistening() {
  const cleanElements = captureElements();
  cleanElements.forEach((element) => {
    element.removeEventListener('input', evaluateInput);
  });
}
