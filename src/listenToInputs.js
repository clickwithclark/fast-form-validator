import { evaluateInput } from './evaluateInput';

export function listenToInputs(dirtyElements) {
  dirtyElements.forEach((element) => {
    element.addEventListener('input', evaluateInput);
  });
}
