import { buildErrorList } from './buildErrorList';
import { initInputValues } from './initInputValues';
import { getFormInputs } from './stateManagement.js';

export function initializeInput(id, moduleInstance) {
  getFormInputs().push(id);
  buildErrorList(id);
  initInputValues(id, moduleInstance);
}
