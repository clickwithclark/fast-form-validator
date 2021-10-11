import { setFormState } from './stateManagement.js';

export function saveInput(event) {
  const input = {
    [event.target.id]: event.target.value.trim(),
  };
  setFormState({ ...input });
}
