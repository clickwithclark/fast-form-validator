import { getFormInputs, getFormState } from './stateManagement.js';

/**
 * @memberof FastFormValidator
 * @function displayErrorsHere
 * @param  {type} htmlID  ID of the HTML container element that will display the error messages
 * @return {FastFormValidator}
 */
export function displayErrorsHere(htmlID) {
  getFormState().feedbackElement = htmlID;
  const errorBlock = document.getElementById(htmlID);
  errorBlock.style.wordWrap = 'break-work';
  errorBlock.style.whiteSpace = 'pre-wrap';

  if (!errorBlock) {
    return console.error('ID to display the error messages not found');
  }
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';

  // eslint-disable-next-line arrow-body-style
  getFormInputs().forEach((id) => {
    const oneTypeOfErrors = getFormState().errors[id];
    oneTypeOfErrors.forEach((singleError) => {
      const li = document.createElement('li');
      li.textContent = singleError;
      ul.appendChild(li);
    });
  });

  // clear html for each form validation
  errorBlock.replaceChildren();
  errorBlock.appendChild(ul);
  return this;
}
