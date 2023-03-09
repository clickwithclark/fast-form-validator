import { getFormState } from './stateManagement.js';

/**
 * If validation fails,execute the functions that shows appropriate
 * feedback to the user
 * @function handleFailure
 * @return {Void} Nothing is returned
 */
export function handleFailure() {
  if (getFormState().failureStrategy) {
    getFormState().failureStrategy();
  }
}

/**
 * If validation succeeds,execute the functions that shows appropriate
 * feedback to the user
 * @function handleSuccess
 * @return {Void} Nothing is returned
 */
export function handleSuccess() {
  if (getFormState().successStrategy) {
    getFormState().successStrategy();
  }
}
