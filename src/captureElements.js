import { getFormInputs } from './stateManagement.js';

export function captureElements() {
  return getFormInputs().map((element) => document.getElementById(element));
}
