import { getFormState, setFormState } from './stateManagement.js';

export function initInputValues(id, moduleInstance) {
  setFormState({ [id]: '' });

  Object.defineProperty(moduleInstance, `${id}Value`, {
    get() {
      return getFormState()[id];
    },
    configurable: true,
  });
}
