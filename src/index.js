/* eslint-disable prefer-rest-params */
/* eslint-disable no-use-before-define */

import { hide, show, remove, display, addClassName, removeClassName } from './handleFeedback';
import { initializeInput } from './initializeInput';
import { getDefaults, getFormInputs, getFormState } from './stateManagement.js';
import { displayErrorsHere } from './displayErrorsHere.js';
import { defaultEmailStrategy } from './defaultEmailStrategy';
import { defaultDateOfBirthStrategy } from './defaultDateOfBirthStrategy';
import { defaultPasswordStrategy } from './defaultPasswordStrategy';
import { onSubmitButton } from './onSubmitButton.js';
import { validate } from './validate.js';

/**
 * Validates email input fields based on the input field ID
 * @memberof FastFormValidator
 * @function onEmail
 * @param  {String} id email input ID
 * @return {FastFormValidator}
 */
getDefaults().email = function (id) {
  setStrategyFor(id, defaultEmailStrategy);
  getFormState().strategies[`${id}Args`] = [...arguments];
  getFormState().strategies[id]();
  return FFV;
};
/**
 * Validates password input fields with a minimum and maximum character limit
 * based on the input field Id
 * it also enforces at least One upper case ,one lowercase and one digit.
 * default character limits are between 6 and 16 characters
 * @memberof FastFormValidator
 * @function onPassword
 * @param  {String} id Password input ID
 * @param  {Number} minLength Min password character length
 * @param  {Number} maxLength Max password character length
 * @return {FastFormValidator}
 */
getFormInputs().password = function (id) {
  setStrategyFor(id, defaultPasswordStrategy);
  getFormState().strategies[`${id}Args`] = [...arguments].slice(1);
  getFormState().strategies[id]();
  return FFV;
};

/**
 * Validates date input fields with a minimum age limit based on the input
 * field Id
 * @memberof FastFormValidator
 * @function onDateOfBirth
 * @param  {String} id  Date of birth input ID
 * @param  {Number} age Minimum age allowed checked against today's date
 * @return {FastFormValidator}
 */
getFormInputs().dateOfBirth = function (id) {
  setStrategyFor(id, defaultDateOfBirthStrategy);
  getFormState().strategies[`${id}Args`] = [...arguments].slice(1);
  getFormState().strategies[id]();
  return FFV;
};

function setStrategyFor(id, strategyFunction) {
  initializeInput(id, FFV);
  if (!getFormInputs().includes(id)) {
    console.error(`Your ID '${id}' was not found in the list of ID's to validate, please set them first`);
    return;
  }
  Object.defineProperty(FFV, `${id}Error`, {
    set(message) {
      getFormState().errors[id].push(message);
    },
  });

  const newStrategy = { [id]: strategyFunction.bind(FFV) };
  getFormState().strategies = { ...getFormState().strategies, ...newStrategy };
  return FFV;
}

const onSuccess = {
  hideFeedback,
  removeFeedback,
  addClass,
  removeClass,
};
/**
 * Hides the element that contains the feedback messages using
 *  css visibility property
 * @memberof FastFormValidator
 * @function onSuccess.hideFeedback
 * @return {FastFormValidator}
 */
function hideFeedback() {
  const strategy = hide;
  getFormState().successStrategy = strategy.bind(FFV);
  getFormState().failureStrategy = show.bind(FFV);
  return FFV;
}

/**
 * Hides the element that contains the feedback messages using
 * css display property
 * @memberof FastFormValidator
 * @function onSuccess.removeFeedback
 * @return {FastFormValidator}
 */
function removeFeedback() {
  const strategy = remove;
  getFormState().successStrategy = strategy.bind(FFV);
  getFormState().failureStrategy = display.bind(FFV);
  return FFV;
}

/**
 * Adds a classname to the element that contains the feedback
 * messages on successful validation
 * @memberof FastFormValidator
 * @function onSuccess.addClass
 * @return {FastFormValidator}
 */
function addClass(className) {
  getFormState().feedbackClassName = className;
  getFormState().successStrategy = addClassName.bind(FFV);
  getFormState().failureStrategy = removeClassName.bind(FFV);
  return FFV;
}
/**
 * Removes a classname to the element that contains the feedback
 * messages on successful validation
 * @memberof FastFormValidator
 * @function onSuccess.removeClass
 * @return {FastFormValidator}
 */
function removeClass(className) {
  getFormState().feedbackClassName = className;
  getFormState().successStrategy = removeClassName.bind(FFV);
  getFormState().failureStrategy = addClassName.bind(FFV);
  return FFV;
}

export const FFV = (function () {
  return {
    onEmail: getFormInputs().email,
    onPassword: getFormInputs().password,
    onDateOfBirth: getFormInputs().dateOfBirth,
    validate,
    setStrategyFor,
    onSubmitButton,
    onSuccess,
    displayErrorsHere,
    showState: function functionName() {
      return getFormState();
    },
  };
})();
