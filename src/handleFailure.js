import { getFormState } from './stateManagement.js';

export function handleFailure() {
  if (getFormState().successStrategy) {
    getFormState().failureStrategy();
  }
}
export function handleSuccess() {
  if (getFormState().successStrategy) {
    getFormState().successStrategy();
  }
}
