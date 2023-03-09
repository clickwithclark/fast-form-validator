import { getFormState, setFormState } from './stateManagement.js';

/**
 * Generates an accessor(getter) property on the FFV instance
 * that will return the current value of an input field
 * Although a new property is being used to return the value
 * the values are actually stored in the instance's state by id
 *
 * @see saveInput
 *
 * @function generateAccessors
 * @param  {String} id ID of input field
 * @param  {Object} moduleInstance FastFormValidator instance
 * @return {Void} Nothing is returned
 */
export function generateAccessors(id, moduleInstance) {
  setFormState({ [id]: '' });

  Object.defineProperty(moduleInstance, `${id}Value`, {
    get() {
      return getFormState()[id];
    },
    configurable: true,
  });
}
