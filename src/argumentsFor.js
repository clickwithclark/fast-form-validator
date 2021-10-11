import { getFormState } from './stateManagement.js';

export function argumentsFor(id) {
  return getFormState().strategies[`${id}Args`];
}
