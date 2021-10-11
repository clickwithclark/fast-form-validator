import { getFormState } from './stateManagement.js';

export function hide() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.style.visibility = 'hidden';
}
export function show() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.style.visibility = 'visible';
}
export function display() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.style.display = 'block';
}
export function remove() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.style.display = 'none';
}

export function addClassName() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.classList.add(getFormState().feedbackClassName);
}
export function removeClassName() {
  const errorBlock = document.getElementById(getFormState().feedbackElement);
  errorBlock.classList.remove(getFormState().feedbackClassName);
}
