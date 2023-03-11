import { getFormStatus } from './formStatus';
import { getFormState } from './stateManagement.js';
import { stoplistening } from './stoplistening';



/**
 * If all fields are successfully validated
 * removed all event listeners and execute the function (submitAction())
 * that should run when the form is successfully validated
 * @function handleFormSubmit
 * @param  {InputEvent} event Input Event
 * @return {Void} Nothing is returned
 */
export function handleFormSubmit(event) {
  event.preventDefault();
  if (getFormStatus()) {
    this.removeEventListener('click', handleFormSubmit);
    getFormState().submitAction();
    stoplistening();
  }
}
