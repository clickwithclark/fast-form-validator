import { getFormState } from './stateManagement.js';

export function buildErrorList(id) {
  const newError = { [id]: [] };
  getFormState().errors = { ...getFormState().errors, ...newError };
}
