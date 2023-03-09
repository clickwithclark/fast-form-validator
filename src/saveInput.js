import { setFormState } from './stateManagement.js';

/**
 * Input event triggered on input fields
 * @typedef {Object} InputEvent
 */

/**
 * Saves the current value of an input field in the instance's state
 * so it can be evaluated
 *
 * Although values are stored against ids, getters (accessors) are
 * created as properties with a `Value` suffix assuming camelCase
 *
 *  @example
 *  an id of email will create a property named emailValue
 *  an id of password2 will create a property named password2Value
 *
 * @see generateAccessors
 *
 * @function saveInput
 * @param  {InputEvent} event Input event
 * @return {Void} Nothing is returned
 */
export function saveInput(event) {
  const input = {
    [event.target.id]: event.target.value.trim(),
  };
  setFormState({ ...input });
}
