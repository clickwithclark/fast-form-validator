import { evaluateInput } from './evaluateInput';
import { captureElements } from './captureElements';

export function stoplistening() {
  const cleanElements = captureElements();
  cleanElements.forEach((element) => {
    element.removeEventListener('input', evaluateInput);
  });
}
