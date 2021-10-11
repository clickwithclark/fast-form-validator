import { getFormInputs, getFormState } from './stateManagement.js';

export function hasMissingStrategies() {
  const missingStrategies = [];
  getFormInputs().forEach((id) => {
    const strategyExist = Object.prototype.hasOwnProperty.call(getFormState().strategies, id);
    if (!strategyExist) {
      missingStrategies.push(id);
    }
  });
  return missingStrategies;
}
