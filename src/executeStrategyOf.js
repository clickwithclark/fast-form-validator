import { getFormState } from './stateManagement.js';
import { argumentsFor } from './argumentsFor';

export function executeStrategyOf(inputId) {
  if (!argumentsFor(inputId)) {
    getFormState().strategies[inputId]();
    return;
  }
  getFormState().strategies[inputId](...argumentsFor(inputId));
}
