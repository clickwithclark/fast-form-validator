const formInputs = [];
let formState = {};
const defaults = {};

export function setFormState(newState) {
  formState = { ...formState, ...newState };
}

export function getFormState() {
  return formState;
}

export function getFormInputs() {
  return formInputs;
}
export function setFormInputs(input) {
  return formInputs.push(input);
}
export function getDefaults() {
  return formInputs;
}
export function setDefaults(input) {
  return formInputs.push(input);
}
