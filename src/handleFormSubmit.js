import { getFormStatus } from './formStatus';
import { getFormState } from './stateManagement.js';
import { stoplistening } from './stoplistening';

export function handleFormSubmit(event) {
  event.preventDefault();
  if (getFormStatus()) {
    this.removeEventListener('click', handleFormSubmit);
    getFormState().submitAction();
    stoplistening();
  }
}
