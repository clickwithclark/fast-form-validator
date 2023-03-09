import { getFormInputs, getFormState } from './stateManagement.js';

/**
 * Checks all ids in Instance to see if they have a corresponding
 * strategy function, if not return list of ids that are
 * missing their functions
 * @function hasMissingStrategies
 * @return {Array} an array of ids whose strategy functions are missing
 */
export function hasMissingStrategies() {
  const missingStrategies = [];
  getFormInputs().forEach((id) => {
    const strategyExist = Object.prototype.hasOwnProperty.call(
      getFormState().strategies,
      id
    );
    if (!strategyExist) {
      missingStrategies.push(id);
    }
  });
  return missingStrategies;
}
